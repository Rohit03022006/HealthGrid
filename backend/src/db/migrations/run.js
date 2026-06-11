import pool from "../../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runMigrations = async () => {
  const client = await pool.connect();

  try {
    // Migrations track karne ke liye table
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        ran_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Saari migration files lo
    const files = fs
      .readdirSync(__dirname)
      .filter((f) => f.endsWith(".sql"))
      .sort(); // 001, 002, 003 order mein chalein

    for (const file of files) {
      // Already run hua hai?
      const { rows } = await client.query(
        "SELECT id FROM migrations WHERE filename = $1",
        [file],
      );

      if (rows.length > 0) {
        console.log(`Skipping ${file} — already ran`);
        continue;
      }

      // SQL file run 
      const sql = fs.readFileSync(path.join(__dirname, file), "utf8");
      await client.query(sql);

      // Mark as done
      await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
        file,
      ]);

      console.log(`Ran migration: ${file}`);
    }

    console.log("All migrations complete!");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

runMigrations();
