import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { FiActivity, FiCalendar, FiLogOut } from "react-icons/fi";

import StatsCard from "@/components/admin/StatsCard";
import OPDChart from "@/components/admin/OPDChart";
import DoctorLoadChart from "@/components/admin/DoctorLoadChart";
import HeatmapPanel from "@/components/admin/HeatmapPanel";
import TopMedicinesPanel from "@/components/admin/TopMedicinesPanel";

import SyncStatusBadge from "@/components/common/SyncStatusBadge";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const AdminPage = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

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
                <FiActivity className="text-primary" />
              </span>
              Admin Dashboard
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Hospital analytics, OPD load, medicines and peak hours.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SyncStatusBadge />

            <Card className="border-primary/10 bg-background/80 shadow-sm backdrop-blur">
              <CardContent className="flex items-center gap-3 p-2">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <FiCalendar className="h-4 w-4 text-primary" />
                </span>

                <Input
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-9 w-[165px]"
                />

                <Badge variant="secondary" className="rounded-full">
                  Selected
                </Badge>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              onClick={handleLogout}
              className="h-11 gap-2 px-5"
            >
              <FiLogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUpAnimation}>
          <StatsCard date={date} />
        </motion.div>

        {/* Charts */}
        <motion.div
          variants={fadeUpAnimation}
          className="grid gap-6 lg:grid-cols-2"
        >
          <motion.div
            whileHover={{
              y: -3,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <OPDChart />
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <DoctorLoadChart date={date} />
          </motion.div>
        </motion.div>

        {/* Insights */}
        <motion.div
          variants={fadeUpAnimation}
          className="grid gap-6 xl:grid-cols-2"
        >
          <motion.div
            whileHover={{
              y: -3,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <HeatmapPanel />
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 22,
            }}
          >
            <TopMedicinesPanel />
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
};

export default AdminPage;
