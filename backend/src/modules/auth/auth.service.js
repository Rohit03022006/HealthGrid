import pool from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerService = async ({ name, email, password, role }) => {
  const existing = await pool.query("SELECT id FROM users WHERE email=$1", [
    email,
  ]);

  if (existing.rows.length) {
    throw new Error("EMAIL_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(
    `
    INSERT INTO users
    (
      name,
      email,
      password,
      role
    )
    VALUES
    ($1,$2,$3,$4)
    RETURNING id,name,email,role
    `,
    [name, email, hashedPassword, role],
  );

  return rows[0];
};

export const loginService = async (email, password) => {
  // Single optimized query  - sirf zaruri columns fetch 
  const { rows } = await pool.query(
    `SELECT id, name, email, password, role 
     FROM users 
     WHERE email = $1 
       AND is_active = TRUE
     LIMIT 1`,
    [email],
  );

  const user = rows[0];

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN },
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMeService = async (userId) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, role 
     FROM users 
     WHERE id = $1 
       AND is_active = TRUE
     LIMIT 1`,
    [userId],
  );

  if (!rows[0]) throw new Error("USER_NOT_FOUND");
  return rows[0];
};
