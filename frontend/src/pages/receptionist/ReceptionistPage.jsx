import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaHospitalUser,
  FaListOl,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import PatientSearchBar from "@/components/receptionist/PatientSearchBar";
import PatientRegForm from "@/components/receptionist/PatientRegForm";
import QueueDisplay from "@/components/receptionist/QueueDisplay";
import TokenSlip from "@/components/receptionist/TokenSlip";
import AssignTokenSection from "@/components/receptionist/AssignTokenSection";
import SyncStatusBadge from "@/components/common/SyncStatusBadge";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const containerAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUpAnimation = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerAnimation}
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Header */}
        <motion.div
          variants={fadeUpAnimation}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FaHospitalUser className="text-primary" />
              </span>
              Receptionist Desk
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Search patients, register new patients, assign OPD tokens, and
              view today&apos;s queue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SyncStatusBadge />

            <Button
              type="button"
              variant="destructive"
              onClick={logout}
              className="h-11 gap-2 px-5 font-semibold"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Main Layout */}
        <motion.div
          variants={fadeUpAnimation}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]"
        >
          {/* Left Patient Management */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <Card className="min-w-0 border-primary/10 bg-background/80 shadow-sm backdrop-blur">
              <CardHeader>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FaSearch className="text-primary" />
                      Patient Management
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Search existing patient or register a new one.
                    </CardDescription>
                  </div>

                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full px-3 py-1"
                  >
                    Front Desk
                  </Badge>
                </div>
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

                <AnimatePresence mode="wait">
                  {showForm && (
                    <motion.div
                      key="patient-form"
                      initial={{
                        opacity: 0,
                        y: 16,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -12,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >
                      <PatientRegForm
                        onRegistered={handlePatientRegistered}
                        onCancel={() => setShowForm(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {activePatient && (
                    <motion.div
                      key={activePatient.id || activePatient.patient_code}
                      initial={{
                        opacity: 0,
                        y: 16,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -12,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                    >
                      <AssignTokenSection
                        patient={activePatient}
                        onTokenAssigned={handleTokenAssigned}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Queue */}
          <motion.div
            whileHover={{
              y: -2,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <Card className="h-fit min-w-0 border-primary/10 bg-background/80 shadow-sm backdrop-blur lg:sticky lg:top-20">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FaListOl className="text-primary" />
                      Today&apos;s Queue
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Live OPD queue and sync status.
                    </CardDescription>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Live
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="max-h-[calc(100vh-190px)] overflow-y-auto pr-2">
                  <QueueDisplay />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Help Card */}
        <motion.div variants={fadeUpAnimation}>
          <Card className="border-primary/10 bg-primary/5 shadow-none">
            <CardContent className="flex flex-col gap-3 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <FaUserPlus className="text-primary" />
              </span>

              <p>
                Search a patient first. If not found, register a new patient and
                then assign an OPD token.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {assignedToken && (
        <TokenSlip token={assignedToken} onClose={handleSlipClose} />
      )}
    </main>
  );
};

export default ReceptionistPage;