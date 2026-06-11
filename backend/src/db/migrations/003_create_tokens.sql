CREATE TABLE IF NOT EXISTS tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  doctor_id UUID REFERENCES users(id),
  token_number INTEGER NOT NULL,
  token_display VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'WAITING'
    CHECK (status IN ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
  priority INTEGER DEFAULT 3
    CHECK (priority IN (1, 2, 3)),
  reason VARCHAR(255),
  issued_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  is_synced BOOLEAN DEFAULT TRUE,
  offline_uuid UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Aaj ke tokens fast fetch ke liye
CREATE INDEX IF NOT EXISTS idx_tokens_date
  ON tokens (DATE(issued_at));

-- Status ke hisaab se filter ke liye
CREATE INDEX IF NOT EXISTS idx_tokens_status
  ON tokens (status);