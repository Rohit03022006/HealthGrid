// src/hooks/useOfflineSync.js
import { useState, useEffect, useCallback, useRef } from "react";
import { db } from "@/lib/db";
import { assignTokenAPI } from "@/services/tokenService";
import { registerPatientAPI } from "@/services/patientService";

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  const syncingRef = useRef(false);

  const updatePendingCount = useCallback(async () => {
    try {
      const count = await db.pendingSync.count();

      setPending((prev) => {
        return prev === count ? prev : count;
      });
    } catch (err) {
      console.error("Pending count failed:", err);

      setPending((prev) => {
        return prev === 0 ? prev : 0;
      });
    }
  }, []);

  const syncPending = useCallback(async () => {
    if (!navigator.onLine) return;
    if (syncingRef.current) return;

    syncingRef.current = true;
    setSyncing(true);

    try {
      const items = await db.pendingSync.orderBy("createdAt").toArray();

      for (const item of items) {
        try {
          if (!navigator.onLine) break;

          if (item.type === "PATIENT") {
            await registerPatientAPI(item.data);
          }

          if (item.type === "TOKEN") {
            await assignTokenAPI({
              ...item.data,
              offlineUuid: item.offlineUuid,
            });
          }

          await db.pendingSync.delete(item.id);
        } catch (err) {
          if (err?.message === "ALREADY_SYNCED") {
            await db.pendingSync.delete(item.id);
          } else {
            console.error("Sync failed for item:", item.id, err);
            break;
          }
        }
      }

      await updatePendingCount();
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [updatePendingCount]);

  const saveOffline = useCallback(async (type, data) => {
    const dedupeKey =
      data?.offlineUuid ||
      data?.id ||
      data?.patientId ||
      `${type}-${JSON.stringify(data)}`;

    const existing = await db.pendingSync
      .where("dedupeKey")
      .equals(dedupeKey)
      .first()
      .catch(() => null);

    if (existing) {
      await updatePendingCount();
      return existing.id;
    }

    const id = await db.pendingSync.add({
      type,
      data,
      dedupeKey,
      createdAt: new Date().toISOString(),
      offlineUuid: crypto.randomUUID(),
    });

    await updatePendingCount();

    return id;
  }, [updatePendingCount]);

  useEffect(() => {
    let mounted = true;

    const setOnlineSafely = (value) => {
      if (!mounted) return;

      setIsOnline((prev) => {
        return prev === value ? prev : value;
      });
    };

    const handleOnline = () => {
      setOnlineSafely(true);
      console.log("🟢 Back online — syncing...");
      syncPending();
    };

    const handleOffline = () => {
      setOnlineSafely(false);
      console.log("🔴 Gone offline — saving locally");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    updatePendingCount();

    return () => {
      mounted = false;

      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [syncPending, updatePendingCount]);

  return {
    isOnline,
    pending,
    syncing,
    saveOffline,
    syncPending,
  };
};