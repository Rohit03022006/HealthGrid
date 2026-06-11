import pool from "../../config/db.js";
import { generatePatientCode } from "../../utils/generateId.js";

//  Register New Patient
export const registerPatientService = async (patientData) => {
  const { name, age, gender, phone, address } = patientData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Phone already exist karta hai?
    const existing = await client.query(
      `SELECT id, patient_code, name 
       FROM patients 
       WHERE phone = $1 
       LIMIT 1`,
      [phone],
    );

    if (existing.rows[0]) {
      throw new Error("PATIENT_EXISTS");
    }

    // Next sequence number lo  - fast counter
    const seqResult = await client.query(
      `SELECT COUNT(*) + 1 AS next_seq FROM patients`,
    );
    const patientCode = generatePatientCode(seqResult.rows[0].next_seq);

    // Patient insert 
    const { rows } = await client.query(
      `INSERT INTO patients 
         (patient_code, name, age, gender, phone, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING 
         id, patient_code, name, age, gender, phone, address, created_at`,
      [patientCode, name, age, gender, phone, address || null],
    );

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//  Get All Patients (Paginated)
export const getPatientsService = async (page = 1, limit = 20, search = "") => {
  const offset = (page - 1) * limit;
  const searchTerm = `%${search}%`;

  // Data + count ek saath  - 2 queries parallel chalao
  const [dataResult, countResult] = await Promise.all([
    pool.query(
      `SELECT 
         id, patient_code, name, age, gender, phone, created_at
       FROM patients
       WHERE 
         name ILIKE $1 OR
         phone ILIKE $1 OR
         patient_code ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset],
    ),
    pool.query(
      `SELECT COUNT(*) 
       FROM patients
       WHERE 
         name ILIKE $1 OR
         phone ILIKE $1 OR
         patient_code ILIKE $1`,
      [searchTerm],
    ),
  ]);

  return {
    data: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit),
  };
};

//  Get Patient By ID with Full History
export const getPatientByIdService = async (patientId) => {
  // Patient info
  const { rows: patientRows } = await pool.query(
    `SELECT 
       id, patient_code, name, age, gender, phone, address, created_at
     FROM patients
     WHERE id = $1
     LIMIT 1`,
    [patientId],
  );

  if (!patientRows[0]) throw new Error("PATIENT_NOT_FOUND");

  // Last 10 visits with prescriptions  - single JOIN query
  const { rows: visitRows } = await pool.query(
    `SELECT 
       v.id AS visit_id,
       v.chief_complaint,
       v.diagnosis,
       v.visit_date,
       u.name AS doctor_name,
       p.medicines,
       p.advice,
       p.followup_date
     FROM visits v
     JOIN users u ON u.id = v.doctor_id
     LEFT JOIN prescriptions p ON p.visit_id = v.id
     WHERE v.patient_id = $1
     ORDER BY v.visit_date DESC
     LIMIT 10`,
    [patientId],
  );

  return {
    ...patientRows[0],
    visitHistory: visitRows,
  };
};

//  Search By Phone
export const getPatientByPhoneService = async (phone) => {
  const { rows } = await pool.query(
    `SELECT 
       id, patient_code, name, age, gender, phone
     FROM patients
     WHERE phone = $1
     LIMIT 1`,
    [phone],
  );

  if (!rows[0]) throw new Error("PATIENT_NOT_FOUND");
  return rows[0];
};

//  Update Patient
export const updatePatientService = async (patientId, updateData, userId) => {
  const { name, age, gender, phone, address } = updateData;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Old data audit ke liye
    const { rows: oldRows } = await client.query(
      `SELECT * FROM patients WHERE id = $1`,
      [patientId],
    );

    if (!oldRows[0]) throw new Error("PATIENT_NOT_FOUND");

    // Update 
    const { rows } = await client.query(
      `UPDATE patients SET
         name    = COALESCE($1, name),
         age     = COALESCE($2, age),
         gender  = COALESCE($3, gender),
         phone   = COALESCE($4, phone),
         address = COALESCE($5, address)
       WHERE id = $6
       RETURNING 
         id, patient_code, name, age, gender, phone, address`,
      [name, age, gender, phone, address, patientId],
    );

    // Audit log
    await client.query(
      `INSERT INTO audit_logs 
         (user_id, action, table_name, record_id, old_data, new_data)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        "UPDATE",
        "patients",
        patientId,
        JSON.stringify(oldRows[0]),
        JSON.stringify(rows[0]),
      ],
    );

    await client.query("COMMIT");
    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

