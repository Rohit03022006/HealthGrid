export const ROLES = {
  RECEPTIONIST: "RECEPTIONIST",
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
};

export const TOKEN_STATUS = {
  WAITING: "WAITING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export const VALID_TOKEN_STATUS_TRANSITIONS = {
  [TOKEN_STATUS.WAITING]: [TOKEN_STATUS.IN_PROGRESS, TOKEN_STATUS.CANCELLED],
  [TOKEN_STATUS.IN_PROGRESS]: [TOKEN_STATUS.COMPLETED, TOKEN_STATUS.CANCELLED],
};

export const VALID_QUEUE_TOKEN_STATUS = [
  TOKEN_STATUS.WAITING,
  TOKEN_STATUS.IN_PROGRESS,
];

export const SOCKET_ROOMS = {
  DOCTOR_PREFIX: "doctor:",
  RECEPTIONIST: "receptionist",
};

export const VALID_PRESCRIPTION_MEDS_FREQUENCY = [
  "1-0-0",
  "0-0-1",
  "1-0-1",
  "1-1-1",
  "SOS",
  "TDS",
  "BD",
];

export const PRIORITY = {
  URGENT: 1,
  HIGH: 2,
  NORMAL: 3,
};

export const PRIORITY_MAP = {
  "chest pain": PRIORITY.URGENT,
  "breathing problem": PRIORITY.URGENT,
  unconscious: PRIORITY.URGENT,
  "heart attack": PRIORITY.URGENT,
  stroke: PRIORITY.URGENT,
  "high fever": PRIORITY.HIGH,
  "severe pain": PRIORITY.HIGH,
  accident: PRIORITY.HIGH,
  "head injury": PRIORITY.HIGH,
  vomiting: PRIORITY.HIGH,
  "routine checkup": PRIORITY.NORMAL,
  "follow up": PRIORITY.NORMAL,
  general: PRIORITY.NORMAL,
  cold: PRIORITY.NORMAL,
  cough: PRIORITY.NORMAL,
};
