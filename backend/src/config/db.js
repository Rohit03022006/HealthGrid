import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                  // Max 10 connections
  idleTimeoutMillis: 30000, // 30 sec idle timeout
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("PostgreSQL connection failed:", err.message);
    return;
  }
  console.log("PostgreSQL connected successfully");
  release();
});

export default pool;