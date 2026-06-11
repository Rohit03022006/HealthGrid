import pool from "../../config/db.js";
import { TOKEN_STATUS } from "../../lib/constants.js";

export const getQueueStatusService = async (tokenDisplay) => {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      token_display,
      token_number,
      status,
      issued_at
    FROM tokens
    WHERE token_display = $1
      AND DATE(issued_at) = CURRENT_DATE
    LIMIT 1
    `,
    [tokenDisplay],
  );

  const token = rows[0];

  if (!token) {
    throw new Error("TOKEN_NOT_FOUND");
  }

  if (token.status === TOKEN_STATUS.COMPLETED || token.status === TOKEN_STATUS.CANCELLED) {
    return {
      token: token.token_display,
      status: token.status,
      position: 0,
      estimatedWaitMinutes: 0,
    };
  }

  const { rows: aheadRows } = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM tokens
    WHERE token_number < $1
      AND status = $2
      AND DATE(issued_at) = CURRENT_DATE
    `,
    [token.token_number, TOKEN_STATUS.WAITING],
  );

  const patientsAhead = Number(aheadRows[0].count);

  return {
    token: token.token_display,
    status: token.status,
    position: patientsAhead + 1,
    estimatedWaitMinutes: patientsAhead * 5,
  };
};
