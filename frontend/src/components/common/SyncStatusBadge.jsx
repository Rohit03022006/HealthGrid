import {
  FiWifi,
  FiWifiOff,
  FiRefreshCw,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

import { Badge } from "@/components/ui/badge";

import { useOfflineSync } from "@/hooks/useOfflineSync";

const SyncStatusBadge = () => {
  const { isOnline, pending, syncing } = useOfflineSync();

  const getStatus = () => {
    if (!isOnline && pending > 0) return "OFFLINE_PENDING";
    if (!isOnline) return "OFFLINE";
    if (syncing) return "SYNCING";
    if (pending > 0) return "PENDING";
    return "ONLINE";
  };

  const STATUS_CONFIG = {
    ONLINE: {
      label: "Online",
      Icon: FiWifi,
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
      iconClass: "text-emerald-600 dark:text-emerald-400",
    },
    SYNCING: {
      label: "Syncing...",
      Icon: FiRefreshCw,
      className:
        "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
      iconClass: "animate-spin text-blue-600 dark:text-blue-400",
    },
    PENDING: {
      label: `${pending} pending`,
      Icon: FiClock,
      className:
        "border-yellow-500/30 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
      iconClass: "text-yellow-600 dark:text-yellow-400",
    },
    OFFLINE_PENDING: {
      label: `Offline - ${pending} pending`,
      Icon: FiAlertCircle,
      className:
        "border-destructive/30 bg-destructive/10 text-destructive",
      iconClass: "text-destructive",
    },
    OFFLINE: {
      label: "Offline",
      Icon: FiWifiOff,
      className:
        "border-destructive/30 bg-destructive/10 text-destructive",
      iconClass: "text-destructive",
    },
  };

  const status = getStatus();
  const config = STATUS_CONFIG[status];
  const Icon = config.Icon;

  return (
    <Badge
      variant="outline"
      className={`h-9 gap-2 rounded-full px-3 text-sm font-medium ${config.className}`}
    >
      <Icon className={`h-4 w-4 ${config.iconClass}`} />
      {config.label}
    </Badge>
  );
};

export default SyncStatusBadge;