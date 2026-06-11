import { useEffect, useState } from "react";
import {
  FaBolt,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaHeartbeat,
  FaNotesMedical,
  FaPhoneAlt,
  FaSignal,
  FaSyncAlt,
  FaTicketAlt,
  FaUserInjured,
  FaWifi,
} from "react-icons/fa";

import { useWebSocket } from "@/hooks/useWebSocket";
import { getQueueTodayAPI } from "@/services/tokenService";
import { useOfflineSync } from "@/hooks/useOfflineSync";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const QueueDisplay = () => {
  const [selectedToken, setSelectedToken] = useState(null);
  const { queue, setQueue, connected } = useWebSocket();
  const { isOnline, pending, syncing } = useOfflineSync();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await getQueueTodayAPI();
        setQueue(res.data.queue || []);
      } catch {
        setQueue([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [setQueue]);

  const priorityLabel = (p) => {
    if (p === 1) return "URGENT";
    if (p === 2) return "HIGH";
    return "NORMAL";
  };

  const priorityVariant = (p) => {
    if (p === 1) return "destructive";
    if (p === 2) return "secondary";
    return "outline";
  };

  const waitingCount = queue.filter((t) => t.status === "WAITING").length;
  const inProgressCount = queue.filter(
    (t) => t.status === "IN_PROGRESS",
  ).length;

  const isLive = isOnline && connected;

  return (
    <div className="space-y-5">
      {/* Sync Status */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={isOnline ? "secondary" : "destructive"}
          className={
            isOnline
              ? "gap-2 border border-primary/20 bg-primary/10 text-primary"
              : "gap-2 border border-destructive/20 bg-destructive/10 text-destructive"
          }
        >
          <FaWifi />
          {isOnline ? "Online" : "Offline"}
        </Badge>

        {pending > 0 && (
          <Badge
            variant="outline"
            className="gap-2 border-primary/20 bg-background text-foreground"
          >
            <FaSyncAlt className={syncing ? "animate-spin text-primary" : ""} />
            {syncing ? "Syncing..." : `${pending} pending`}
          </Badge>
        )}

        <Badge
          variant={isLive ? "secondary" : "destructive"}
          className={
            isLive
              ? "gap-2 border border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-400"
              : "gap-2 border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          }
        >
          <FaSignal />
          {isLive ? "Live" : isOnline ? "Reconnecting..." : "Offline"}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Card className="border-blue-200 bg-blue-50 shadow-none dark:border-blue-900/40 dark:bg-blue-950/30">
          <CardContent className="flex flex-col items-center justify-center p-2 text-center sm:p-4">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-blue-700 sm:gap-2 sm:text-sm dark:text-blue-400">
              <FaUserInjured className="shrink-0" />
              <span>Total</span>
            </p>

            <p className="mt-2 text-center text-2xl font-bold leading-none text-blue-800 sm:text-3xl dark:text-blue-300">
              {queue.length}
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50 shadow-none dark:border-amber-900/40 dark:bg-amber-950/30">
          <CardContent className="flex flex-col items-center justify-center p-2 text-center sm:p-4">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-amber-700 sm:gap-2 sm:text-sm dark:text-amber-400">
              <FaClock className="shrink-0" />
              <span>Waiting</span>
            </p>

            <p className="mt-2 text-center text-2xl font-bold leading-none text-amber-800 sm:text-3xl dark:text-amber-300">
              {waitingCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50 shadow-none dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <CardContent className="flex flex-col items-center justify-center p-2 text-center sm:p-4">
            <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-emerald-700 sm:gap-2 sm:text-sm dark:text-emerald-400">
              <FaHeartbeat className="shrink-0" />
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Progress</span>
            </p>

            <p className="mt-2 text-center text-2xl font-bold leading-none text-emerald-800 sm:text-3xl dark:text-emerald-300">
              {inProgressCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Queue List */}
      {loading ? (
        <Card className="shadow-none">
          <CardContent className="flex min-h-40 items-center justify-center p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <FaHeartbeat className="h-10 w-10 animate-pulse text-primary" />
              <p className="text-sm text-muted-foreground">Loading queue...</p>
            </div>
          </CardContent>
        </Card>
      ) : queue.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-40 items-center justify-center p-6">
            <div className="text-center">
              <FaCheckCircle className="mx-auto mb-3 text-3xl text-primary" />
              <p className="font-medium">No patients in queue</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Assigned tokens will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 px-1 py-1">
          {queue.map((token) => (
            <button
              key={token.id}
              type="button"
              onClick={() => setSelectedToken(token)}
              className="block w-full rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="w-full overflow-hidden border-border bg-card shadow-none transition hover:border-primary/30 hover:bg-muted/40">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 pl-1">
                      <p className="text-xs text-muted-foreground">Token</p>
                      <p className="break-words text-3xl font-black leading-tight tracking-wide text-primary sm:text-4xl">
                        {token.token_display}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                      <Badge
                        variant={priorityVariant(token.priority)}
                        className="gap-1"
                      >
                        <FaBolt />
                        {priorityLabel(token.priority)}
                      </Badge>

                      <Badge variant="secondary">{token.status}</Badge>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex min-w-0 items-center gap-2">
                      <FaUserInjured className="shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate font-medium">
                        {token.patient_name || token.patient?.name || "N/A"}
                      </span>

                      {token.patient_age && (
                        <span className="shrink-0 text-muted-foreground">
                          {token.patient_age} yrs
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <FaNotesMedical className="shrink-0" />
                      <span className="min-w-0 truncate">
                        {token.reason || "General"}
                      </span>
                    </div>
                  </div>

                  <p
                    className="mt-3 text-xs text-muted-foreground no-underline hover:underline hover:text-blue-800"
                  >
                    Click to view full patient details
                  </p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}

      {/* Token Detail Dialog */}
      <Dialog
        open={Boolean(selectedToken)}
        onOpenChange={(open) => {
          if (!open) setSelectedToken(null);
        }}
      >
        <DialogContent className="max-h-[92vh] w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FaTicketAlt className="text-primary" />
              Token Details
            </DialogTitle>

            <DialogDescription>
              Patient and queue information for this token.
            </DialogDescription>
          </DialogHeader>

          {selectedToken && (
            <div className="space-y-4">
              <Card className="border-primary/20 bg-primary/5 shadow-none">
                <CardContent className="p-5 text-center">
                  <p className="text-sm text-muted-foreground">Current Token</p>

                  <p className="mt-1 text-5xl font-black tracking-wide text-primary">
                    {selectedToken.token_display}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant={priorityVariant(selectedToken.priority)}>
                      <FaBolt className="mr-1" />
                      {priorityLabel(selectedToken.priority)}
                    </Badge>

                    <Badge variant="secondary">{selectedToken.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none">
                <CardContent className="space-y-3 p-4">
                  <DetailRow
                    icon={<FaUserInjured />}
                    label="Patient Name"
                    value={
                      selectedToken.patient_name ||
                      selectedToken.patient?.name ||
                      "N/A"
                    }
                  />

                  <Separator />

                  <DetailRow
                    icon={<FaClock />}
                    label="Age"
                    value={
                      selectedToken.patient_age
                        ? `${selectedToken.patient_age} yrs`
                        : selectedToken.patient?.age
                          ? `${selectedToken.patient.age} yrs`
                          : "N/A"
                    }
                  />

                  <Separator />

                  <DetailRow
                    icon={<FaPhoneAlt />}
                    label="Phone"
                    value={
                      selectedToken.patient_phone ||
                      selectedToken.patient?.phone ||
                      "N/A"
                    }
                  />

                  <Separator />

                  <DetailRow
                    icon={<FaNotesMedical />}
                    label="Reason"
                    value={selectedToken.reason || "General"}
                  />

                  <Separator />

                  <DetailRow
                    icon={<FaCalendarAlt />}
                    label="Issued At"
                    value={
                      selectedToken.issued_at
                        ? new Date(selectedToken.issued_at).toLocaleString(
                            "en-IN",
                          )
                        : "N/A"
                    }
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailRow = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-medium">{value}</p>
      </div>
    </div>
  );
};

export default QueueDisplay;
