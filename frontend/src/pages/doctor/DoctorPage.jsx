import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaStethoscope,
  FaUsers,
  FaUserMd,
  FaFileMedical,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import QueuePanel from "@/components/doctor/QueuePanel";
import PrescriptionForm from "@/components/doctor/PrescriptionForm";
import PatientHistory from "@/components/doctor/PatientHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SyncStatusBadge from "@/components/common/SyncStatusBadge";

const DoctorPage = () => {
  const navigate = useNavigate();

  const [activeToken, setActiveToken] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleCallPatient = (token) => {
    setActiveToken(token);
    setCompleted(false);
  };

  const handlePrescriptionDone = () => {
    setActiveToken(null);
    setCompleted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FaUserMd className="text-primary" />
              </span>
              Doctor Dashboard
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground">
              Call patients, view history, write prescriptions, and generate
              PDF.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <SyncStatusBadge />

            <Button
              variant="outline"
              onClick={() => navigate("/doctor/templates")}
              className="h-11 gap-2"
            >
              <FaFileMedical />
              Manage Templates
            </Button>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="h-11 w-full gap-2 px-5 text-base sm:w-auto"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>

        {completed && (
          <Card className="border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="flex flex-col gap-2 p-4 text-sm text-primary sm:flex-row sm:items-center">
              <FaFileMedical className="shrink-0" />
              <span>
                Prescription saved successfully. Select next patient from queue.
              </span>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[390px_1fr]">
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <FaUsers className="text-primary" />
                <h2 className="font-semibold">Patient Queue</h2>
              </div>

              <QueuePanel
                activeTokenId={activeToken?.id}
                onCallPatient={handleCallPatient}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!activeToken && (
              <Card className="border-dashed shadow-none">
                <CardContent className="flex min-h-80 items-center justify-center p-6 sm:min-h-[420px]">
                  <div className="max-w-sm text-center">
                    <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                      <FaStethoscope className="text-2xl text-muted-foreground" />
                    </span>

                    <h2 className="text-xl font-semibold">
                      Select a patient from queue
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Call a waiting patient to view history and create
                      prescription.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeToken && (
              <>
                <PatientHistory
                  patientId={
                    activeToken.patient_id ||
                    activeToken.patientId ||
                    activeToken.patient?.id
                  }
                />

                <PrescriptionForm
                  token={activeToken}
                  onDone={handlePrescriptionDone}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DoctorPage;
