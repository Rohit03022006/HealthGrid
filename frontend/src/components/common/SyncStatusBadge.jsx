import { useOfflineSync } from "@/hooks/useOfflineSync";

const SyncStatusBadge = () => {
  const { isOnline, pending, syncing } = useOfflineSync();

  // ─── States ───────────────────────────────────────────────────
  // 1. Online + no pending
  // 2. Online + syncing
  // 3. Online + pending (should not happen long)
  // 4. Offline + pending
  // 5. Offline + no pending

  const getStatus = () => {
    if (!isOnline && pending > 0) return "OFFLINE_PENDING";
    if (!isOnline)                return "OFFLINE";
    if (syncing)                  return "SYNCING";
    if (pending > 0)              return "PENDING";
    return "ONLINE";
  };

  const STATUS_CONFIG = {
    ONLINE: {
      label: "Online",
      dot:   "🟢",
    },
    SYNCING: {
      label: "Syncing...",
      dot:   "🔵",
    },
    PENDING: {
      label: `${pending} pending`,
      dot:   "🟡",
    },
    OFFLINE_PENDING: {
      label: `Offline — ${pending} pending`,
      dot:   "🔴",
    },
    OFFLINE: {
      label: "Offline",
      dot:   "🔴",
    },
  };

  const status = getStatus();
  const config = STATUS_CONFIG[status];

  return (
    <div>
      <span>{config.dot}</span>
      <span>{config.label}</span>
    </div>
  );
};

export default SyncStatusBadge;