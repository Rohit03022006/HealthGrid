
import { useState } from "react";
import {
  FaClipboardList,
  FaExclamationTriangle,
  FaPhoneAlt,
  FaTicketAlt,
  FaUser,
  FaWifi,
  FaIdCard,
} from "react-icons/fa";

import { assignTokenAPI } from "@/services/tokenService";
import { useOfflineSync } from "@/hooks/useOfflineSync";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AssignTokenSection = ({ patient, onTokenAssigned }) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { isOnline, saveOffline } = useOfflineSync();

  const handleAssign = async () => {
    setLoading(true);
    setError("");

    const payload = {
      patientId: patient.id,
      reason: reason.trim() || "General",
    };

    try {
      if (isOnline) {
        const res = await assignTokenAPI(payload);
        onTokenAssigned(res.data);
      } else {
        const offlineToken = {
          ...payload,
          id: crypto.randomUUID(),
          token_display: "PENDING",
          status: "WAITING",
          issued_at: new Date().toISOString(),
          patient,
        };

        await saveOffline("TOKEN", payload);
        onTokenAssigned(offlineToken);
      }
    } catch (err) {
      setError(err?.message || "Failed to assign token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 shadow-none">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <FaTicketAlt className="text-primary" />
          </span>
          Assign Token
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Patient Info */}
        <div className="grid gap-3 rounded-xl border bg-background p-4 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <FaUser className="text-primary" />
            </span>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Patient</p>
              <p className="truncate font-medium">{patient.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
              <FaIdCard className="text-muted-foreground" />
            </span>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Patient Code</p>
              <p className="truncate font-medium">
                {patient.patient_code || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
              <FaPhoneAlt className="text-muted-foreground" />
            </span>

            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="truncate font-medium">{patient.phone || "N/A"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Reason Input */}
        <div className="space-y-2">
          <Label htmlFor="reason" className="flex items-center gap-2">
            <FaClipboardList className="text-primary" />
            Reason for Visit
          </Label>

          <div className="relative">
            <FaClipboardList className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="reason"
              type="text"
              placeholder="Reason for visit, e.g. fever, checkup"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="h-11 bg-background pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <FaExclamationTriangle className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {!isOnline && (
          <Badge
            variant="secondary"
            className="flex w-fit items-center gap-2 whitespace-normal rounded-lg px-3 py-2 text-left text-xs font-normal text-muted-foreground"
          >
            <FaWifi className="shrink-0 text-primary" />
            <span>Offline — token will sync when internet returns</span>
          </Badge>
        )}

        <Button
          onClick={handleAssign}
          disabled={loading}
          className="h-11 w-full text-base font-semibold"
        >
          <FaTicketAlt className="mr-2 text-lg" />
          {loading ? "Assigning..." : "Assign Token"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssignTokenSection;
