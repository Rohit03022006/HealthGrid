import pool from "../../config/db.js";
import fs from "fs";
import https from "https";
import { parse } from "csv-parse";

const CSV_URL =
  "https://raw.githubusercontent.com/junioralive/Indian-Medicine-Dataset/main/DATA/indian_medicine_data.csv";

const seedMedicines = async () => {
  const client = await pool.connect();

  try {
    // Already seeded?
    const { rows } = await client.query("SELECT COUNT(*) FROM medicines");
    if (parseInt(rows[0].count) > 0) {
      console.log("Medicines already seeded");
      return;
    }

    console.log("Downloading CSV...");

    // CSV download + parse
    const records = await new Promise((resolve, reject) => {
      const results = [];

      https.get(CSV_URL, (res) => {
        res
          .pipe(
            parse({
              columns: true,
              skip_empty_lines: true,
              trim: true,
            }),
          )
          .on("data", (row) => {
            // Sirf active medicines lo
            if (row["Is_discontinued"] === "FALSE") {
              results.push({
                name: row["name"]?.slice(0, 200),
                composition1: row["short_composition1"]?.slice(0, 200),
                composition2: row["short_composition2"]?.slice(0, 200),
                manufacturer: row["manufacturer_name"]?.slice(0, 200),
                pack_size: row["pack_size_label"]?.slice(0, 100),
                type: row["type"]?.slice(0, 50),
              });
            }
          })
          .on("end", () => resolve(results))
          .on("error", reject);
      });
    });

    console.log(`${records.length} active medicines found`);
    console.log("Inserting into PostgreSQL...`");

    // Batch insert  - 1000 at a time (fast)
    const BATCH_SIZE = 1000;

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      const values = batch
        .map(
          (_, j) =>
            `($${j * 6 + 1}, $${j * 6 + 2}, $${j * 6 + 3}, 
            $${j * 6 + 4}, $${j * 6 + 5}, $${j * 6 + 6})`,
        )
        .join(", ");

      const params = batch.flatMap((r) => [
        r.name,
        r.composition1 || null,
        r.composition2 || null,
        r.manufacturer || null,
        r.pack_size || null,
        r.type || null,
      ]);

      await client.query(
        `INSERT INTO medicines
           (name, composition1, composition2, manufacturer, pack_size, type)
         VALUES ${values}
         ON CONFLICT DO NOTHING`,
        params,
      );

      console.log(
        `Inserted ${Math.min(i + BATCH_SIZE, records.length)} / ${records.length}`,
      );
    }

    console.log("Medicines seeded successfully!");
  } finally {
    client.release();
    pool.end();
  }
};

seedMedicines();
