import pool from "../../config/db.js";
import { getIO } from "../../websocket/socket.js";
import { TOKEN_STATUS } from "../../lib/constants.js";

//  Create Prescription ──
export const createPrescriptionService = async (prescriptionData, doctorId) => {
  const {
    tokenId,
    chiefComplaint,
    diagnosis,
    medicines,
    advice,
    followupDate,
  } = prescriptionData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Token valid hai? Aur IN_PROGRESS mein hai?
    const { rows: tokenRows } = await client.query(
      `SELECT 
         t.id,
         t.patient_id,
         t.status,
         t.doctor_id
       FROM tokens t
       WHERE t.id = $1
       LIMIT 1`,
      [tokenId]
    );

    if (!tokenRows[0]) throw new Error("TOKEN_NOT_FOUND");
    if (tokenRows[0].status !== TOKEN_STATUS.IN_PROGRESS) throw new Error("TOKEN_NOT_ACTIVE");

    const patientId = tokenRows[0].patient_id;

    // Visit create 
    const { rows: visitRows } = await client.query(
      `INSERT INTO visits
         (token_id, patient_id, doctor_id, chief_complaint, diagnosis)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tokenId, patientId, doctorId, chiefComplaint, diagnosis]
    );

    const visit = visitRows[0];

    // Medicines validate 
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
      throw new Error("MEDICINES_REQUIRED");
    }

    // Prescription create 
    const { rows: rxRows } = await client.query(
      `INSERT INTO prescriptions
         (visit_id, medicines, advice, followup_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        visit.id,
        JSON.stringify(medicines),
        advice || null,
        followupDate || null,
      ]
    );

    // Token COMPLETED mark
    await client.query(
      `UPDATE tokens SET
         status       = $2,
         completed_at = NOW()
       WHERE id = $1`,
      [tokenId, TOKEN_STATUS.COMPLETED]
    );

    await client.query("COMMIT");

    // Full prescription data assemble 
    const result = {
      visit,
      prescription: rxRows[0],
    };

    // WebSocket  - doctor screen pe next patient load ho
    const io = getIO();
    io.emit("queue:token_completed", { tokenId, patientId });

    return result;

  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//  Get Prescription By Visit ──
export const getPrescriptionByVisitService = async (visitId) => {
  const { rows } = await pool.query(
    `SELECT
       p.id             AS prescription_id,
       p.medicines,
       p.advice,
       p.followup_date,
       p.created_at,
       v.chief_complaint,
       v.diagnosis,
       v.visit_date,
       pat.name         AS patient_name,
       pat.age          AS patient_age,
       pat.gender       AS patient_gender,
       pat.phone        AS patient_phone,
       pat.patient_code,
       doc.name         AS doctor_name
     FROM prescriptions p
     JOIN visits v        ON v.id = p.visit_id
     JOIN patients pat    ON pat.id = v.patient_id
     JOIN users doc       ON doc.id = v.doctor_id
     WHERE p.visit_id = $1
     LIMIT 1`,
    [visitId]
  );

  if (!rows[0]) throw new Error("PRESCRIPTION_NOT_FOUND");
  return rows[0];
};

//  Get All Prescriptions By Patient 
export const getPrescriptionsByPatientService = async (patientId) => {
  const { rows } = await pool.query(
    `SELECT
       p.id             AS prescription_id,
       p.medicines,
       p.advice,
       p.followup_date,
       p.created_at,
       v.chief_complaint,
       v.diagnosis,
       v.visit_date,
       doc.name         AS doctor_name
     FROM prescriptions p
     JOIN visits v     ON v.id = p.visit_id
     JOIN users doc    ON doc.id = v.doctor_id
     WHERE v.patient_id = $1
     ORDER BY v.visit_date DESC
     LIMIT 20`,
    [patientId]
  );

  return rows;
};