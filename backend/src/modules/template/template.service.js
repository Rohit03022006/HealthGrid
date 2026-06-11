import pool from "../../config/db.js";

//  Get Doctor's Templates 
export const getMyTemplatesService = async (doctorId) => {
  const { rows } = await pool.query(
    `SELECT id, name, medicines, advice, created_at
     FROM templates
     WHERE doctor_id = $1
     ORDER BY name ASC`,
    [doctorId]
  );
  return rows;
};

//  Create Template 
export const createTemplateService = async (doctorId, data) => {
  const { name, medicines, advice } = data;

  const { rows } = await pool.query(
    `INSERT INTO templates (doctor_id, name, medicines, advice)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [doctorId, name, JSON.stringify(medicines), advice || null]
  );

  return rows[0];
};

//  Update Template 
export const updateTemplateService = async (templateId, doctorId, data) => {
  const { name, medicines, advice } = data;

  // Sirf apna template update kar sake
  const { rows } = await pool.query(
    `UPDATE templates SET
       name      = COALESCE($1, name),
       medicines = COALESCE($2, medicines),
       advice    = COALESCE($3, advice)
     WHERE id = $4
       AND doctor_id = $5
     RETURNING *`,
    [
      name,
      medicines ? JSON.stringify(medicines) : null,
      advice,
      templateId,
      doctorId,
    ]
  );

  if (!rows[0]) throw new Error("TEMPLATE_NOT_FOUND");
  return rows[0];
};

//  Delete Template 
export const deleteTemplateService = async (templateId, doctorId) => {
  const { rows } = await pool.query(
    `DELETE FROM templates
     WHERE id = $1
       AND doctor_id = $2
     RETURNING id`,
    [templateId, doctorId]
  );

  if (!rows[0]) throw new Error("TEMPLATE_NOT_FOUND");
  return { deleted: true };
};