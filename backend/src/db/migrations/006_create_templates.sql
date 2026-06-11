CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES users(id),
  name VARCHAR(100) NOT NULL,
  medicines JSONB NOT NULL DEFAULT '[]',
  advice TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(doctor_id, name)
);