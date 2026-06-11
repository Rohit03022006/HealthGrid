import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db";
import { assignTokenAPI } from "@/services/tokenService";
import { registerPatientAPI } from "@/services/patientService";

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  // Online/offline detect karo
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Pending count update karo
  useEffect(() => {
    const updateCount = async () => {
      const count = await db.pendingSync.count();
      setPending(count);
    };
    updateCount();
  }, [isOnline]);

  // Save Offline
  const saveOffline = useCallback(async (type, data) => {
    await db.pendingSync.add({
      type, // "PATIENT" | "TOKEN"
      data,
      createdAt: new Date().toISOString(),
      offlineUuid: crypto.randomUUID(),
    });

    setPending((prev) => prev + 1);
  }, []);

  // Sync Pending
  const syncPending = useCallback(async () => {
    if (!isOnline || syncing) return;

    setSyncing(true);

    const items = await db.pendingSync.toArray();

    for (const item of items) {
      try {
        if (item.type === "PATIENT") {
          await registerPatientAPI(item.data);
        } else if (item.type === "TOKEN") {
          await assignTokenAPI({
            ...item.data,
            offlineUuid: item.offlineUuid,
          });
        }

        // Sync hua — delete karo
        await db.pendingSync.delete(item.id);
        setPending((prev) => Math.max(0, prev - 1));
      } catch (err) {
        // Already synced — delete karo
        if (err.message === "ALREADY_SYNCED") {
          await db.pendingSync.delete(item.id);
        }
        console.error("Sync failed for item:", item.id, err.message);
      }
    }

    setSyncing(false);
  }, [isOnline, syncing]);

  // Online aate hi sync karo
  useEffect(() => {
    if (isOnline) syncPending();
  }, [isOnline]);

  return {
    isOnline,
    pending,
    syncing,
    saveOffline,
    syncPending,
  };
};
