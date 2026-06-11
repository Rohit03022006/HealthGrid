import { useState, useEffect } from "react";
import {
  FaBolt,
  FaClock,
  FaHeartbeat,
  FaNotesMedical,
  FaPhoneVolume,
  FaSignal,
  FaUserInjured,
} from "react-icons/fa";

import { useWebSocket } from "@/hooks/useWebSocket";
import { useQueueStore } from "@/store/queueStore";
import {
  getQueueTodayAPI,
  updateTokenStatusAPI,
} from "@/services/tokenService";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const QueuePanel = ({ activeTokenId, onCallPatient }) => {
  useWebSocket();
  const queue = useQueueStore((state) => state.queue) ?? [];
  const setQueue = useQueueStore((state) => state.setQueue);
  const connected = useQueueStore((state) => state.connected);
  const [loading, setLoading] = useState(true);
  const [calling, setCalling] = useState(null);

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

  const handleCall = async (token) => {
    if (calling) return;

    setCalling(token.id);

    try {
      await updateTokenStatusAPI(token.id, "IN_PROGRESS");
      onCallPatient(token);
    } catch (err) {
      console.error("Failed to call patient:", err.message);
    } finally {
      setCalling(null);
    }
  };

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

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={connected ? "secondary" : "destructive"}
          className={
            connected
              ? "gap-2 border border-green-200 bg-green-50 text-green-700 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-400"
              : "gap-2 border border-red-200 bg-red-50 text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          }
        >
          <FaSignal />
          {connected ? "Live" : "Reconnecting..."}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="border-amber-200 bg-amber-50 shadow-none dark:border-amber-900/40 dark:bg-amber-950/30">
          <CardContent className="p-3 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <FaClock />
              Waiting
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-800 dark:text-amber-300">
              {waitingCount}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50 shadow-none dark:border-emerald-900/40 dark:bg-emerald-950/30">
          <CardContent className="p-3 text-center">
            <p className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-700 dark:text-emerald-400">
              <FaHeartbeat />
              Progress
            </p>
            <p className="mt-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
              {inProgressCount}
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card className="shadow-none">
          <CardContent className="flex min-h-40 items-center justify-center p-6">
            <div className="text-center">
              <FaHeartbeat className="mx-auto mb-3 h-9 w-9 animate-pulse text-primary" />
              <p className="text-sm text-muted-foreground">Loading queue...</p>
            </div>
          </CardContent>
        </Card>
      ) : queue.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-40 items-center justify-center p-6 text-center">
            <div>
              <FaUserInjured className="mx-auto mb-3 text-3xl text-muted-foreground" />
              <p className="font-medium">No patients waiting</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Queue will appear here.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 px-1 py-1">
          {queue.map((token) => {
            const isActive = activeTokenId === token.id;

            return (
              <Card
                key={token.id}
                onClick={() => {
                  if (token.status === "IN_PROGRESS") {
                    onCallPatient(token);
                  }
                }}
                className={
                  isActive
                    ? "border-primary/40 bg-primary/5 shadow-none"
                    : "border-border bg-card shadow-none transition hover:bg-muted/40"
                }
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Token</p>
                      <p className="wrap-break-word text-3xl font-black leading-tight tracking-wide text-primary">
                        {token.token_display}
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
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

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p className="flex min-w-0 items-center gap-2">
                      <FaUserInjured className="shrink-0 text-muted-foreground" />
                      <span className="min-w-0 truncate font-medium">
                        {token.patient_name || "N/A"}
                      </span>
                      {token.patient_age && (
                        <span className="shrink-0 text-muted-foreground">
                          {token.patient_age} yrs
                        </span>
                      )}
                    </p>

                    <p className="flex min-w-0 items-center gap-2 text-muted-foreground">
                      <FaNotesMedical className="shrink-0" />
                      <span className="min-w-0 truncate">
                        {token.reason || "General"}
                      </span>
                    </p>
                  </div>

                  {token.status === "WAITING" && (
                    <Button
                      onClick={() => handleCall(token)}
                      disabled={!!calling || !!activeTokenId}
                      className="h-11 w-full"
                    >
                      <FaPhoneVolume className="mr-2" />
                      {calling === token.id ? "Calling..." : "Call Patient"}
                    </Button>
                  )}

                  {token.status === "IN_PROGRESS" && (
                    <Button
                      type="button"
                      variant={
                        activeTokenId === token.id ? "default" : "outline"
                      }
                      onClick={() => onCallPatient(token)}
                      className="h-11 w-full gap-2"
                    >
                      <FaHeartbeat />
                      {activeTokenId === token.id
                        ? "Opened"
                        : "Open Consultation"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
