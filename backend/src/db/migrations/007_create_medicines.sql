CREATE TABLE medicines (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(200) NOT NULL,
  composition1        VARCHAR(200),
  composition2        VARCHAR(200),
  manufacturer        VARCHAR(200),
  pack_size           VARCHAR(100),
  type                VARCHAR(50),
  is_discontinued     BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_medicines_name
  ON medicines USING GIN (name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_medicines_composition
  ON medicines USING GIN (composition1 gin_trgm_ops);