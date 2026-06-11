-- Patients phone se fast search
CREATE INDEX idx_patients_phone ON patients (phone);

-- Patient code se fast search
CREATE INDEX idx_patients_code ON patients (patient_code);

-- User email login fast 
CREATE INDEX idx_users_email ON users (email);

-- Doctor ke visits fast fetch
CREATE INDEX idx_visits_doctor ON visits (doctor_id, visit_date DESC);

-- Patient history fast fetch
CREATE INDEX idx_visits_patient ON visits (patient_id, visit_date DESC);

-- Prescriptions visit se fast fetch
CREATE INDEX idx_prescriptions_visit ON prescriptions (visit_id);

-- Templates doctor ke hisaab se
CREATE INDEX idx_templates_doctor ON templates (doctor_id);