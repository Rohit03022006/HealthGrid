import { useState } from "react";
import { FaHospitalUser, FaListOl  } from "react-icons/fa";

import PatientSearchBar from "@/components/receptionist/PatientSearchBar";
import PatientRegForm from "@/components/receptionist/PatientRegForm";
import QueueDisplay from "@/components/receptionist/QueueDisplay";
import TokenSlip from "@/components/receptionist/TokenSlip";
import AssignTokenSection from "@/components/receptionist/AssignTokenSection";
import SyncStatusBadge from "@/components/common/SyncStatusBadge";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiLogOut } from "react-icons/fi";

const ReceptionistPage = () => {
  const { logout } = useAuth();

  const [foundPatient, setFoundPatient] = useState(null);
  const [newPatient, setNewPatient] = useState(null);
  const [assignedToken, setAssignedToken] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handlePatientFound = (patient) => {
    setFoundPatient(patient);
    setNewPatient(null);
    setShowForm(false);
  };

  const handlePatientRegistered = (patient) => {
    setNewPatient(patient);
    setFoundPatient(null);
    setShowForm(false);
  };

  const handleTokenAssigned = (token) => {
    setAssignedToken(token);
    setFoundPatient(null);
    setNewPatient(null);
    setShowForm(false);
  };

  const handleSlipClose = () => {
    setAssignedToken(null);
  };

  const activePatient = foundPatient || newPatient;

  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FaHospitalUser className="text-primary" />
              </span>
              Receptionist Desk
            </h1>

            <p className="max-w-2xl text-sm text-muted-foreground">
              Search patients, register new patients, assign OPD tokens, and
              view today&apos;s queue.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <SyncStatusBadge />

            <Button
              type="button"
              variant="destructive"
              onClick={logout}
              className="h-11 w-full gap-2 px-5 text-base font-semibold sm:w-auto"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          {/* Left Patient Management */}
          <Card className="min-w-0 shadow-sm">
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Search existing patient or register a new one.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <PatientSearchBar
                onPatientFound={handlePatientFound}
                onNotFound={() => {
                  setFoundPatient(null);
                  setNewPatient(null);
                  setShowForm(true);
                }}
              />

              {showForm && (
                <PatientRegForm
                  onRegistered={handlePatientRegistered}
                  onCancel={() => setShowForm(false)}
                />
              )}

              {activePatient && (
                <AssignTokenSection
                  patient={activePatient}
                  onTokenAssigned={handleTokenAssigned}
                />
              )}
            </CardContent>
          </Card>

          {/* Right Queue */}
          <Card className="h-fit min-w-0 shadow-sm lg:sticky lg:top-20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaListOl className="text-primary" />
                Today&apos;s Queue
              </CardTitle>
              <CardDescription>Live OPD queue and sync status.</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="max-h-[calc(100vh-190px)] overflow-y-auto pr-2">
                <QueueDisplay />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {assignedToken && (
        <TokenSlip token={assignedToken} onClose={handleSlipClose} />
      )}
    </main>
  );
};

export default ReceptionistPage;