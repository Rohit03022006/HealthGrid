CREATE TABLE IF NOT EXISTS prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id),
  medicines JSONB NOT NULL DEFAULT '[]',
  advice TEXT,
  followup_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- medicines JSONB fast search ke liye
CREATE INDEX IF NOT EXISTS idx_prescriptions_medicines
  ON prescriptions USING GIN (medicines);