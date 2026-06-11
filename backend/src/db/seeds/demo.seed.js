
import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

const seedDemo = async () => {
  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      "SELECT COUNT(*) FROM users"
    );

    if (parseInt(rows[0].count) > 0) {
      console.log("Demo data already seeded");
      return;
    }

    const password = await bcrypt.hash("demo123", 10);

    await client.query(
      `INSERT INTO users (name, email, password, role) VALUES
         ('Admin User',      'admin@healthgrid.com',        $1, 'ADMIN'),
         ('Dr. Sharma',      'doctor@healthgrid.com',       $1, 'DOCTOR'),
         ('Dr. Verma',       'doctor2@healthgrid.com',      $1, 'DOCTOR'),
         ('Receptionist',    'reception@healthgrid.com',    $1, 'RECEPTIONIST')`,
      [password]
    );

    console.log("✅ Demo users seeded");
    console.log("----------------------------------------------");
    console.log("Admin       → admin@healthgrid.com");
    console.log("Doctor      → doctor@healthgrid.com");
    console.log("Receptionist→ reception@healthgrid.com");
    console.log("Password    → demo123");
    console.log("-----------------------------------------------");

  } finally {
    client.release();
    pool.end();
  }
};

seedDemo();