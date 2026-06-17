import pool from "../../config/db.js";
import bcrypt from "bcryptjs";

// Config
const PATIENT_COUNT = 1000;
const VISIT_LOOKBACK_DAYS = 180;
const DEMO_PASSWORD = "demo123";

// Helpers
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - randomInt(0, daysAgo));
  d.setHours(randomInt(8, 18), randomInt(0, 59), 0, 0);
  return d.toISOString();
};

const randomPhone = () => {
  const prefixes = [
    "98",
    "97",
    "96",
    "95",
    "94",
    "93",
    "91",
    "90",
    "89",
    "88",
    "87",
    "86",
    "85",
    "84",
    "83",
    "82",
    "81",
    "80",
    "79",
    "78",
  ];

  return randomItem(prefixes) + String(randomInt(10000000, 99999999));
};

const randomAge = () => {
  const group = randomInt(1, 100);

  if (group <= 10) return randomInt(1, 12); // children
  if (group <= 20) return randomInt(13, 18); // teens
  if (group <= 75) return randomInt(19, 60); // adults
  return randomInt(61, 85); // elderly
};

const getFollowupDate = (priority) => {
  const chance = priority === 1 ? 65 : priority === 2 ? 40 : 20;

  if (randomInt(1, 100) > chance) return null;

  return new Date(Date.now() + randomInt(3, 30) * 86400000)
    .toISOString()
    .split("T")[0];
};

//  Data
const FIRST_NAMES = [
  "Rahul",
  "Priya",
  "Amit",
  "Sneha",
  "Vikram",
  "Pooja",
  "Rajesh",
  "Anita",
  "Suresh",
  "Kavita",
  "Arjun",
  "Neha",
  "Manish",
  "Sunita",
  "Deepak",
  "Rekha",
  "Sanjay",
  "Meena",
  "Rohit",
  "Geeta",
  "Aakash",
  "Divya",
  "Nikhil",
  "Shweta",
  "Vivek",
  "Anjali",
  "Pankaj",
  "Ritu",
  "Gaurav",
  "Nisha",
  "Mohit",
  "Simran",
  "Karan",
  "Isha",
  "Harsh",
  "Tanvi",
  "Rakesh",
  "Seema",
  "Yash",
  "Komal",
  "Aditya",
  "Riya",
  "Varun",
  "Payal",
  "Abhishek",
  "Sakshi",
  "Nitin",
  "Monika",
  "Dev",
  "Kirti",
];

const LAST_NAMES = [
  "Sharma",
  "Verma",
  "Singh",
  "Gupta",
  "Kumar",
  "Yadav",
  "Mishra",
  "Tiwari",
  "Pandey",
  "Joshi",
  "Agarwal",
  "Saxena",
  "Srivastava",
  "Chauhan",
  "Patel",
  "Rathore",
  "Mehta",
  "Bansal",
  "Malhotra",
  "Kapoor",
  "Jain",
  "Saini",
  "Choudhary",
  "Khan",
  "Ansari",
];

const MEDICINES_LIST = [
  {
    name: "Paracetamol 500mg",
    dosage: "1 tablet",
    frequency: "1-0-1",
    duration: "3 days",
    instructions: "Take after food",
  },
  {
    name: "Cetirizine 10mg",
    dosage: "1 tablet",
    frequency: "0-0-1",
    duration: "5 days",
    instructions: "Take at night",
  },
  {
    name: "ORS Sachet",
    dosage: "1 sachet",
    frequency: "TDS",
    duration: "2 days",
    instructions: "Mix in clean water",
  },
  {
    name: "Pantoprazole 40mg",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "7 days",
    instructions: "Take before breakfast",
  },
  {
    name: "Amoxicillin 500mg",
    dosage: "1 capsule",
    frequency: "1-1-1",
    duration: "5 days",
    instructions: "Complete full course",
  },
  {
    name: "Ibuprofen 400mg",
    dosage: "1 tablet",
    frequency: "1-0-1",
    duration: "3 days",
    instructions: "Take after food",
  },
  {
    name: "Vitamin C 500mg",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "15 days",
    instructions: "Take after breakfast",
  },
  {
    name: "Metformin 500mg",
    dosage: "1 tablet",
    frequency: "1-0-1",
    duration: "30 days",
    instructions: "Take after meals",
  },
  {
    name: "Amlodipine 5mg",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "30 days",
    instructions: "Take at same time daily",
  },
  {
    name: "Azithromycin 500mg",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "3 days",
    instructions: "Take after food",
  },
  {
    name: "Domperidone 10mg",
    dosage: "1 tablet",
    frequency: "1-1-1",
    duration: "3 days",
    instructions: "Take before meals",
  },
  {
    name: "Calcium + Vitamin D3",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "30 days",
    instructions: "Take after food",
  },
  {
    name: "Iron Folic Acid",
    dosage: "1 tablet",
    frequency: "1-0-0",
    duration: "30 days",
    instructions: "Take after lunch",
  },
  {
    name: "Cough Syrup",
    dosage: "10 ml",
    frequency: "1-1-1",
    duration: "5 days",
    instructions: "Shake well before use",
  },
  {
    name: "Salbutamol Inhaler",
    dosage: "2 puffs",
    frequency: "SOS",
    duration: "7 days",
    instructions: "Use during breathing difficulty",
  },
  {
    name: "Levocetirizine 5mg",
    dosage: "1 tablet",
    frequency: "0-0-1",
    duration: "5 days",
    instructions: "Take at night",
  },
];

const CASES = [
  {
    reason: "high fever with body ache",
    priority: 2,
    diagnoses: ["Viral fever", "Seasonal flu"],
    medicines: ["Paracetamol 500mg", "Vitamin C 500mg", "Cetirizine 10mg"],
    advices: [
      "Rest and drink plenty of fluids",
      "Monitor temperature every 6 hours",
      "Come back if fever persists more than 3 days",
    ],
  },
  {
    reason: "cold and cough",
    priority: 3,
    diagnoses: ["Upper respiratory tract infection", "Allergic rhinitis"],
    medicines: ["Cetirizine 10mg", "Cough Syrup", "Vitamin C 500mg"],
    advices: [
      "Avoid cold water",
      "Steam inhalation twice daily",
      "Drink warm fluids",
    ],
  },
  {
    reason: "chest pain",
    priority: 1,
    diagnoses: [
      "Chest pain under evaluation",
      "Acidity related chest discomfort",
    ],
    medicines: ["Pantoprazole 40mg", "Amlodipine 5mg"],
    advices: [
      "ECG advised",
      "Avoid heavy exertion",
      "Visit emergency if pain increases",
    ],
  },
  {
    reason: "headache",
    priority: 3,
    diagnoses: ["Tension headache", "Migraine headache"],
    medicines: ["Paracetamol 500mg", "Ibuprofen 400mg"],
    advices: ["Avoid screen overuse", "Sleep well", "Drink enough water"],
  },
  {
    reason: "stomach pain and acidity",
    priority: 2,
    diagnoses: ["Gastritis", "Acidity"],
    medicines: ["Pantoprazole 40mg", "Domperidone 10mg"],
    advices: [
      "Avoid spicy and oily food",
      "Eat light meals",
      "Do not skip breakfast",
    ],
  },
  {
    reason: "vomiting and loose motion",
    priority: 2,
    diagnoses: ["Acute gastroenteritis", "Food poisoning"],
    medicines: ["ORS Sachet", "Domperidone 10mg", "Pantoprazole 40mg"],
    advices: [
      "Drink ORS frequently",
      "Avoid outside food",
      "Come back if dehydration symptoms appear",
    ],
  },
  {
    reason: "breathing problem",
    priority: 1,
    diagnoses: ["Bronchitis", "Asthma exacerbation"],
    medicines: ["Salbutamol Inhaler", "Levocetirizine 5mg", "Cough Syrup"],
    advices: [
      "Avoid dust and smoke",
      "Use inhaler as advised",
      "Emergency visit if breathing worsens",
    ],
  },
  {
    reason: "back pain",
    priority: 3,
    diagnoses: ["Lumbar strain", "Lumbar spondylosis"],
    medicines: ["Ibuprofen 400mg", "Calcium + Vitamin D3"],
    advices: [
      "Avoid heavy lifting",
      "Apply warm compression",
      "Back stretching exercises advised",
    ],
  },
  {
    reason: "routine diabetes follow up",
    priority: 3,
    diagnoses: ["Type 2 Diabetes"],
    medicines: ["Metformin 500mg"],
    advices: [
      "Check fasting blood sugar regularly",
      "Avoid sweets",
      "Regular walking recommended",
    ],
  },
  {
    reason: "high blood pressure follow up",
    priority: 2,
    diagnoses: ["Hypertension"],
    medicines: ["Amlodipine 5mg"],
    advices: [
      "Monitor blood pressure daily",
      "Reduce salt intake",
      "Regular walking recommended",
    ],
  },
  {
    reason: "weakness and fatigue",
    priority: 3,
    diagnoses: ["Anemia", "Vitamin D deficiency"],
    medicines: ["Iron Folic Acid", "Calcium + Vitamin D3", "Vitamin C 500mg"],
    advices: [
      "Balanced diet advised",
      "Morning sunlight exposure",
      "Blood test advised if symptoms continue",
    ],
  },
  {
    reason: "skin allergy and itching",
    priority: 3,
    diagnoses: ["Allergic dermatitis", "Skin allergy"],
    medicines: ["Cetirizine 10mg", "Levocetirizine 5mg"],
    advices: [
      "Avoid scratching",
      "Avoid suspected allergens",
      "Keep affected area clean",
    ],
  },
];

const getMedicineByName = (name) =>
  MEDICINES_LIST.find((medicine) => medicine.name === name);

const getMedicinesForCase = (caseItem) => {
  const medCount = randomInt(2, 4);
  const selected = [];
  const used = new Set();

  const preferredMedicines = caseItem.medicines
    .map(getMedicineByName)
    .filter(Boolean);

  const pool = [...preferredMedicines, ...MEDICINES_LIST];

  while (selected.length < medCount && used.size < pool.length) {
    const medicine = randomItem(pool);

    if (!used.has(medicine.name)) {
      used.add(medicine.name);
      selected.push({ ...medicine });
    }
  }

  return selected;
};

// Main Seed Function
const seedDemo = async () => {
  const client = await pool.connect();

  try {
    console.log("🌱 Starting demo seed...");

    await client.query("BEGIN");

    // Users
    const { rows: existingUsers } = await client.query(
      "SELECT COUNT(*) FROM users",
    );

    let doctorIds = [];

    if (parseInt(existingUsers[0].count, 10) === 0) {
      const password = await bcrypt.hash(DEMO_PASSWORD, 10);

      const { rows: users } = await client.query(
        `INSERT INTO users (name, email, password, role) VALUES
           ('Admin User','admin@healthgrid.com',       $1, 'ADMIN'),
           ('Dr. R. Sharma','doctor@healthgrid.com',      $1, 'DOCTOR'),
           ('Dr. P. Verma','doctor2@healthgrid.com',     $1, 'DOCTOR'),
           ('Dr. S. Kumar','doctor3@healthgrid.com',     $1, 'DOCTOR'),
           ('Dr. A. Mehta','doctor4@healthgrid.com',     $1, 'DOCTOR'),
           ('Receptionist',      'reception@healthgrid.com',   $1, 'RECEPTIONIST')
         RETURNING id, role`,
        [password],
      );

      doctorIds = users
        .filter((user) => user.role === "DOCTOR")
        .map((user) => user.id);

      console.log("Demo users created");
      console.log("─────────────────────────────────");
      console.log("Admin        → admin@healthgrid.com");
      console.log("Doctor 1     → doctor@healthgrid.com");
      console.log("Doctor 2     → doctor2@healthgrid.com");
      console.log("Doctor 3     → doctor3@healthgrid.com");
      console.log("Doctor 4     → doctor4@healthgrid.com");
      console.log("Receptionist → reception@healthgrid.com");
      console.log(`Password     → ${DEMO_PASSWORD}`);
      console.log("─────────────────────────────────");
    } else {
      const { rows } = await client.query(
        "SELECT id FROM users WHERE role = 'DOCTOR'",
      );

      doctorIds = rows.map((row) => row.id);

      console.log("Users already exist — skipping");
    }

    if (doctorIds.length === 0) {
      throw new Error("No doctors found. Please create at least one doctor.");
    }

    const { rows: existingPatients } = await client.query(
      "SELECT COUNT(*) FROM patients",
    );

    if (parseInt(existingPatients[0].count, 10) > 0) {
      console.log("Patients already seeded — skipping");
      await client.query("COMMIT");
      return;
    }

    console.log(`Seeding ${PATIENT_COUNT} patients + visits...`);

    let seededVisitCount = 0;
    const year = new Date().getFullYear();

    for (let i = 1; i <= PATIENT_COUNT; i++) {
      const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
      const age = randomAge();
      const gender = randomItem(["MALE", "FEMALE", "MALE", "FEMALE", "OTHER"]);
      const phone = randomPhone();
      const code = `PAT-${year}-${String(i).padStart(5, "0")}`;

      // Patient insert
      const { rows: patientRows } = await client.query(
        `INSERT INTO patients
           (patient_code, name, age, gender, phone)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [code, name, age, gender, phone],
      );

      const patientId = patientRows[0].id;

      // 1-4 visits per patient
      const visitCount = randomInt(1, 4);

      for (let v = 0; v < visitCount; v++) {
        const caseItem = randomItem(CASES);
        const doctorId = randomItem(doctorIds);

        const tokenNumber = seededVisitCount + 1;
        const issuedAt = randomDate(VISIT_LOOKBACK_DAYS);

        const startedAt = new Date(
          new Date(issuedAt).getTime() + randomInt(5, 35) * 60000,
        ).toISOString();

        const completedAt = new Date(
          new Date(startedAt).getTime() + randomInt(5, 25) * 60000,
        ).toISOString();

        // Token insert
        const { rows: tokenRows } = await client.query(
          `INSERT INTO tokens
             (patient_id, doctor_id, token_number, token_display,
              status, priority, reason, issued_at, started_at, completed_at)
           VALUES ($1, $2, $3, $4, 'COMPLETED', $5, $6, $7, $8, $9)
           RETURNING id`,
          [
            patientId,
            doctorId,
            tokenNumber,
            `T${String(tokenNumber).padStart(4, "0")}`,
            caseItem.priority,
            caseItem.reason,
            issuedAt,
            startedAt,
            completedAt,
          ],
        );

        const tokenId = tokenRows[0].id;
        const diagnosis = randomItem(caseItem.diagnoses);

        // Visit insert
        const { rows: visitRows } = await client.query(
          `INSERT INTO visits
             (token_id, patient_id, doctor_id,
              chief_complaint, diagnosis, visit_date)
           VALUES ($1, $2, $3, $4, $5, $6::date)
           RETURNING id`,
          [
            tokenId,
            patientId,
            doctorId,
            caseItem.reason,
            diagnosis,
            issuedAt.split("T")[0],
          ],
        );

        const visitId = visitRows[0].id;

        const medicines = getMedicinesForCase(caseItem);
        const advice = randomItem(caseItem.advices);
        const followupDate = getFollowupDate(caseItem.priority);

        // Prescription insert
        await client.query(
          `INSERT INTO prescriptions
             (visit_id, medicines, advice, followup_date)
           VALUES ($1, $2, $3, $4)`,
          [visitId, JSON.stringify(medicines), advice, followupDate],
        );

        seededVisitCount++;
      }

      // Progress log
      if (i % 100 === 0) {
        console.log(`   ${i}/${PATIENT_COUNT} patients seeded...`);
      }
    }

    await client.query("COMMIT");

    console.log(
      `${seededVisitCount} visits seeded across ${PATIENT_COUNT} patients`,
    );
    console.log("Demo seed complete!");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});

    console.error("Seed failed:", err.message);
    process.exit(1);
  } finally {
    client.release();
    pool.end();
  }
};

seedDemo();
