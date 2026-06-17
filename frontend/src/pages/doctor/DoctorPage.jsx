import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import {
  FaCheckCircle,
  FaFileMedical,
  FaStethoscope,
  FaUserMd,
  FaUsers,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

import QueuePanel from "@/components/doctor/QueuePanel";
import PrescriptionForm from "@/components/doctor/PrescriptionForm";

import SyncStatusBadge from "@/components/common/SyncStatusBadge";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
                <FaUserMd className="text-primary" />
              </span>
              Doctor Dashboard
            </h1>

            <p className="mt-1 text-muted-foreground">
              Call patients, view history, write prescriptions, and generate
              PDF.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SyncStatusBadge />

            <Button
              variant="outline"
              className="h-11 gap-2"
              onClick={() => navigate("/doctor/templates")}
            >
              <FaFileMedical className="h-4 w-4" />
              Manage Templates
            </Button>

            <Button
              variant="destructive"
              className="h-11 gap-2"
              onClick={handleLogout}
            >
              <FiLogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {completed && (
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -12,
                scale: 0.98,
              }}
              transition={{
                duration: 0.25,
              }}
            >
              <Card className="border-primary/20 bg-primary/5 shadow-none">
                <CardContent className="flex flex-col gap-3 p-4 text-sm text-primary sm:flex-row sm:items-center">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <FaCheckCircle />
                  </span>

                  <span>
                    Prescription saved successfully. Select next patient from
                    queue.
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Layout */}
        <motion.div
          variants={fadeUpAnimation}
          className="grid gap-6 lg:grid-cols-[390px_1fr]"
        >
          {/* Queue */}
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
            <Card className="border-primary/10 bg-background/80 shadow-sm backdrop-blur">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <FaUsers className="text-primary" />
                    </span>

                    <div>
                      <h2 className="font-semibold">Patient Queue</h2>
                      <p className="text-xs text-muted-foreground">
                        Waiting and active patients
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Live
                  </span>
                </div>

                <QueuePanel
                  activeTokenId={activeToken?.id}
                  onCallPatient={handleCallPatient}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {!activeToken ? (
                <motion.div
                  key="empty-state"
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Card className="border-dashed border-primary/20 bg-background/80 shadow-none backdrop-blur">
                    <CardContent className="flex min-h-80 items-center justify-center p-6 sm:min-h-[420px]">
                      <div className="max-w-sm text-center">
                        <motion.span
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            duration: 2.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted"
                        >
                          <FaStethoscope className="text-2xl text-muted-foreground" />
                        </motion.span>

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
                </motion.div>
              ) : (
                <motion.div
                  key={activeToken.id}
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: -18,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <PrescriptionForm
                    token={activeToken}
                    onDone={handlePrescriptionDone}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default DoctorPage;
