import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiActivity, FiLogOut } from "react-icons/fi";

import StatsCard from "@/components/admin/StatsCard";
import OPDChart from "@/components/admin/OPDChart";
import DoctorLoadChart from "@/components/admin/DoctorLoadChart";
import HeatmapPanel from "@/components/admin/HeatmapPanel";
import TopMedicinesPanel from "@/components/admin/TopMedicinesPanel";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <FiActivity className="text-primary" />
              </div>

              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hospital analytics, OPD load, medicines and peak hours.
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
            <Card className="w-full md:w-auto">
              <CardContent className="flex items-center gap-3 p-3">
                <FiCalendar className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full md:w-[180px]"
                />
                <Badge variant="secondary">Selected</Badge>
              </CardContent>
            </Card>

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

        <StatsCard date={date} />

        <div className="grid gap-6 lg:grid-cols-2">
          <OPDChart />
          <DoctorLoadChart date={date} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <HeatmapPanel />
          <TopMedicinesPanel />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
