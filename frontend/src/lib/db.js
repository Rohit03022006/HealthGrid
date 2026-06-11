import Dexie from "dexie";

export const db = new Dexie("HealthGridDB");

db.version(1).stores({
  pendingSync: "++id, type, createdAt, offlineUuid",
});
