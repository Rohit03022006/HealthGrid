import pool from "../../config/db.js";

export const searchMedicinesService = async (query) => {
  if (!query || query.length < 2) return [];

  const { rows } = await pool.query(
    `SELECT
       id,
       name,
       composition1,
       composition2,
       pack_size,
       type
     FROM medicines
     WHERE 
       name         ILIKE $1 OR
       composition1 ILIKE $1
     AND is_discontinued = FALSE
     ORDER BY
       CASE WHEN name ILIKE $2 THEN 0 ELSE 1 END,
       name ASC
     LIMIT 10`,
    [`%${query}%`, `${query}%`],
  );

  return rows;
};
