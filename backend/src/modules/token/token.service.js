import pool from "../../config/db.js";
import { generateTokenDisplay } from "../../utils/generateId.js";
import { getIO } from "../../websocket/socket.js";
import { PRIORITY, PRIORITY_MAP, TOKEN_STATUS, VALID_QUEUE_TOKEN_STATUS, VALID_TOKEN_STATUS_TRANSITIONS } from "../../lib/constants.js";

// Priority mapping
const getPriority = (reason = "") => {
  const lower = reason.toLowerCase();
  for (const [keyword, priority] of Object.entries(PRIORITY_MAP)) {
    if (lower.includes(keyword)) return priority;
  }
  return PRIORITY.NORMAL;
};

//  Assign Token
export const assignTokenService = async (
  patientId,
  reason,
  doctorId,
  offlineUuid = null,
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Patient exist karta hai?
    const { rows: patientRows } = await client.query(
      `SELECT id, name, age, phone 
       FROM patients 
       WHERE id = $1 
       LIMIT 1`,
      [patientId],
    );

    if (!patientRows[0]) throw new Error("PATIENT_NOT_FOUND");

    // Offline UUID already synced hua hai?
    if (offlineUuid) {
      const { rows: existing } = await client.query(
        `SELECT id FROM tokens WHERE offline_uuid = $1 LIMIT 1`,
        [offlineUuid],
      );
      if (existing[0]) throw new Error("ALREADY_SYNCED");
    }

    // Aaj ka last token number lo
    const { rows: lastToken } = await client.query(
      `SELECT MAX(token_number) AS last_num
       FROM tokens
       WHERE DATE(issued_at) = CURRENT_DATE`,
    );

    const nextNumber = (lastToken[0].last_num || 0) + 1;
    const tokenDisplay = generateTokenDisplay(nextNumber);
    const priority = getPriority(reason);

    // Token insert karo
    const { rows } = await client.query(
      `INSERT INTO tokens
     (patient_id, doctor_id, token_number, token_display,   
      status, priority, reason, offline_uuid)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
   RETURNING *`,
      [
        patientId,
        doctorId || null,
        nextNumber,
        tokenDisplay,
        TOKEN_STATUS.WAITING,
        priority,
        reason || null,
        offlineUuid || null,
      ],
    );

    const token = rows[0];

    // Full token data with patient info
    const fullToken = {
      ...token,
      patient: patientRows[0],
    };

    await client.query("COMMIT");

    // WebSocket  - sabko batao ki naya token aaya hai
    const io = getIO();
    io.emit("queue:new_token", fullToken);

    return fullToken;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

//  Get Today's Queue
export const getQueueTodayService = async (doctorId = null) => {
  const { rows } = await pool.query(
    `
    SELECT
      t.id,
      t.patient_id,
      t.doctor_id,
      t.token_display,
      t.token_number,
      t.status,
      t.priority,
      t.reason,
      t.issued_at,
      t.started_at,

      p.name         AS patient_name,
      p.age          AS patient_age,
      p.phone        AS patient_phone,
      p.gender       AS patient_gender,
      p.patient_code AS patient_code,

      u.name         AS doctor_name

    FROM tokens t
    JOIN patients p ON p.id = t.patient_id
    LEFT JOIN users u ON u.id = t.doctor_id

    WHERE t.status = ANY($2::text[])
      AND (
        $1::uuid IS NULL
        OR t.doctor_id IS NULL
        OR t.doctor_id = $1
      )

    ORDER BY
      t.priority ASC,
      t.issued_at ASC
    `,
    [doctorId, VALID_QUEUE_TOKEN_STATUS],
  );

  const waiting = rows.filter((r) => r.status === TOKEN_STATUS.WAITING).length;
  const inProgress = rows.filter((r) => r.status === TOKEN_STATUS.IN_PROGRESS);

  return {
    queue: rows,
    stats: {
      waiting,
      inProgress: inProgress.length,
      currentPatient: inProgress[0] || null,
    },
  };
};

//  Get Token By ID
export const getTokenByIdService = async (tokenId) => {
  const { rows } = await pool.query(
    `SELECT
       t.*,
       p.name    AS patient_name,
       p.age     AS patient_age,
       p.phone   AS patient_phone,
       p.gender  AS patient_gender,
       u.name    AS doctor_name
     FROM tokens t
     JOIN patients p ON p.id = t.patient_id
     LEFT JOIN users u ON u.id = t.doctor_id
     WHERE t.id = $1
     LIMIT 1`,
    [tokenId],
  );

  if (!rows[0]) throw new Error("TOKEN_NOT_FOUND");
  return rows[0];
};

//  Update Token Status
export const updateTokenStatusService = async (tokenId, status, doctorId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: current } = await client.query(
      `
      SELECT status
      FROM tokens
      WHERE id = $1::uuid
      LIMIT 1
      `,
      [tokenId],
    );

    if (!current[0]) {
      throw new Error("TOKEN_NOT_FOUND");
    }

    const allowed = VALID_TOKEN_STATUS_TRANSITIONS[current[0].status];

    if (!allowed || !allowed.includes(status)) {
      throw new Error("INVALID_TRANSITION");
    }

    let query = `
      UPDATE tokens
      SET
        status = $1,
        doctor_id = COALESCE(doctor_id, $2::uuid)
    `;

    const values = [status, doctorId, tokenId];

    if (status === TOKEN_STATUS.IN_PROGRESS) {
      query += `,
        started_at = NOW()
      `;
    }

    if (status === TOKEN_STATUS.COMPLETED) {
      query += `,
        completed_at = NOW()
      `;
    }

    query += `
      WHERE id = $3::uuid
      RETURNING *
    `;

    const { rows } = await client.query(query, values);

    await client.query("COMMIT");

    const io = getIO();

    io.emit("queue:status_update", {
      tokenId,
      status,
      doctorId,
    });

    return rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
