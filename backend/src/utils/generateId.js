// PAT-2026-00421
export const generatePatientCode = (sequenceNumber) => {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(5, "0");
  return `PAT-${year}-${padded}`;
};

// T001, T002  - daily reset
export const generateTokenDisplay = (number) => {
  return `T${String(number).padStart(3, "0")}`;
};