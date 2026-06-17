// src/utils/auditLogger.js

import pool from "../config/db.js";
import logger from "./logger.js";

export const createAuditLog = async ({
  userId = null,
  action,
  tableName,
  recordId = null,
  oldData = null,
  newData = null,
  ipAddress = null,
}) => {
  try {
    await pool.query(
      `INSERT INTO audit_logs
        (user_id, action, table_name, record_id, old_data, new_data, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userId,
        action,
        tableName,
        recordId,
        oldData ? JSON.stringify(oldData) : null,
        newData ? JSON.stringify(newData) : null,
        ipAddress,
      ],
    );
  } catch (err) {
    logger.error(`Audit log failed: ${err.message}`);
  }
};