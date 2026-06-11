import pool from "../../config/db.js";

//  Dashboard Stats 
export const getDashboardStatsService = async (date) => {
  const targetDate = date || new Date().toISOString().split("T")[0];

  // Sab queries parallel chalao — fast!
  const [todayResult, avgTimeResult, completedResult, waitingResult] =
    await Promise.all([

      // Aaj ke total patients
      pool.query(
        `SELECT COUNT(*) AS total
         FROM tokens
         WHERE DATE(issued_at) = $1`,
        [targetDate]
      ),

      // Average consultation time (minutes)
      pool.query(
        `SELECT ROUND(
           AVG(
             EXTRACT(EPOCH FROM (completed_at - started_at)) / 60
           )
         ) AS avg_minutes
         FROM tokens
         WHERE DATE(issued_at) = $1
           AND status = 'COMPLETED'
           AND started_at IS NOT NULL
           AND completed_at IS NOT NULL`,
        [targetDate]
      ),

      // Completed tokens
      pool.query(
        `SELECT COUNT(*) AS completed
         FROM tokens
         WHERE DATE(issued_at) = $1
           AND status = 'COMPLETED'`,
        [targetDate]
      ),

      // Waiting tokens
      pool.query(
        `SELECT COUNT(*) AS waiting
         FROM tokens
         WHERE DATE(issued_at) = $1
           AND status = 'WAITING'`,
        [targetDate]
      ),
    ]);

  return {
    date: targetDate,
    totalPatients:   parseInt(todayResult.rows[0].total),
    completed:       parseInt(completedResult.rows[0].completed),
    waiting:         parseInt(waitingResult.rows[0].waiting),
    avgConsultation: parseInt(avgTimeResult.rows[0].avg_minutes) || 0,
  };
};

//  Doctor Load ─
export const getDoctorLoadService = async (date) => {
  const targetDate = date || new Date().toISOString().split("T")[0];

  const { rows } = await pool.query(
    `SELECT
       u.id          AS doctor_id,
       u.name        AS doctor_name,
       COUNT(t.id)   AS total_patients,
       COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) AS completed,
       ROUND(
         AVG(
           CASE WHEN t.completed_at IS NOT NULL AND t.started_at IS NOT NULL
           THEN EXTRACT(EPOCH FROM (t.completed_at - t.started_at)) / 60
           END
         )
       ) AS avg_minutes
     FROM users u
     LEFT JOIN tokens t
       ON t.doctor_id = u.id
       AND DATE(t.issued_at) = $1
     WHERE u.role = 'DOCTOR'
       AND u.is_active = TRUE
     GROUP BY u.id, u.name
     ORDER BY total_patients DESC`,
    [targetDate]
  );

  return rows;
};

//  Hourly Heatmap ─
export const getHourlyHeatmapService = async () => {

  // Last 30 days ka hourly pattern
  const { rows } = await pool.query(
    `SELECT
       EXTRACT(DOW  FROM issued_at) AS day_of_week,  -- 0=Sun, 6=Sat
       EXTRACT(HOUR FROM issued_at) AS hour,
       COUNT(*) AS patient_count
     FROM tokens
     WHERE issued_at >= NOW() - INTERVAL '30 days'
     GROUP BY day_of_week, hour
     ORDER BY day_of_week, hour`
  );

  return rows;
};

//  Top Medicines ──
export const getTopMedicinesService = async (days = 30) => {
  const { rows } = await pool.query(
    `SELECT
       med->>'name' AS medicine_name,
       COUNT(*)     AS prescribed_count
     FROM prescriptions,
          jsonb_array_elements(medicines) AS med
     WHERE created_at >= NOW() - INTERVAL '${days} days'
     GROUP BY medicine_name
     ORDER BY prescribed_count DESC
     LIMIT 10`
  );

  return rows;
};