// User Roles
export const ROLES = {
  RECEPTIONIST: "RECEPTIONIST",
  DOCTOR: "DOCTOR",
  ADMIN: "ADMIN",
};

//  Token Status
export const TOKEN_STATUS = {
  WAITING: "WAITING",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

// Status jo queue se remove ho jayein
export const REMOVE_FROM_QUEUE = [
  TOKEN_STATUS.COMPLETED,
  TOKEN_STATUS.CANCELLED,
];

//  Token Priority
export const PRIORITY = {
  URGENT: 1,
  HIGH: 2,
  NORMAL: 3,
};

export const PRIORITY_LABELS = {
  1: "URGENT",
  2: "HIGH",
  3: "NORMAL",
};

export const PRIORITY_MAP = {
  // Priority 1  - Immediate
  "chest pain": PRIORITY.URGENT,
  "breathing problem": PRIORITY.URGENT,
  unconscious: PRIORITY.URGENT,
  "heart attack": PRIORITY.URGENT,
  stroke: PRIORITY.URGENT,

  // Priority 2  - Urgent
  "high fever": PRIORITY.HIGH,
  "severe pain": PRIORITY.HIGH,
  accident: PRIORITY.HIGH,
  "head injury": PRIORITY.HIGH,
  vomiting: PRIORITY.HIGH,

  // Priority 3  - Normal (default)
  "routine checkup": PRIORITY.NORMAL,
  "follow up": PRIORITY.NORMAL,
  general: PRIORITY.NORMAL,
  cold: PRIORITY.NORMAL,
  cough: PRIORITY.NORMAL,
};

// Medicine Frequency
export const FREQUENCY_OPTIONS = [
  { value: "1-0-0", label: "1-0-0  (Morning only)" },
  { value: "0-0-1", label: "0-0-1  (Night only)" },
  { value: "1-0-1", label: "1-0-1  (Morning + Night)" },
  { value: "1-1-1", label: "1-1-1  (Three times)" },
  { value: "SOS", label: "SOS    (When needed)" },
  { value: "TDS", label: "TDS    (Three times daily)" },
  { value: "BD", label: "BD     (Twice daily)" },
];

export const FREQUENCY_VALUES = FREQUENCY_OPTIONS.map((f) => f.value);

//  Gender
export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const GENDER_VALUES = GENDER_OPTIONS.map((g) => g.value);

// Analytics
export const ANALYTICS_DAYS_OPTIONS = [
  { value: 7, label: "Last 7 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

//  Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
};

//  Offline Sync
export const SYNC_TYPES = {
  PATIENT: "PATIENT",
  TOKEN: "TOKEN",
};

//  API
export const API_TIMEOUT = 10000; // 10 seconds

//   Heatmap
export const HEATMAP_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const HEATMAP_HOURS = Array.from(
  { length: 12 },
  (_, i) => i + 8, // 8am to 7pm
);

//   Drug Warnings
export const DANGEROUS_COMBOS = [
  {
    drugs: ["Warfarin", "Aspirin"],
    warning: "Increased bleeding risk",
  },
  {
    drugs: ["Metformin", "Alcohol"],
    warning: "Risk of lactic acidosis",
  },
  {
    drugs: ["Ciprofloxacin", "Antacid"],
    warning: "Reduced antibiotic absorption",
  },
];

//   Routes
export const ROLE_ROUTES = {
  [ROLES.RECEPTIONIST]: "/receptionist",
  [ROLES.DOCTOR]: "/doctor",
  [ROLES.ADMIN]: "/admin",
};

//  IndexedDB
export const DB_NAME = "HealthGridDB";
export const DB_VERSION = 1;