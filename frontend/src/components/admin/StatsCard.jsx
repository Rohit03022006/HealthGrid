import { useEffect, useState } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiWatch,
  FiAlertCircle,
} from "react-icons/fi";

import { getDashboardStatsAPI } from "@/services/analyticsService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statItems = [
  {
    key: "totalPatients",
    label: "Total Patients",
    icon: FiUsers,
  },
  {
    key: "completed",
    label: "Completed",
    icon: FiCheckCircle,
  },
  {
    key: "waiting",
    label: "Waiting",
    icon: FiClock,
  },
  {
    key: "avgConsultation",
    label: "Avg Consultation",
    icon: FiWatch,
    suffix: " min",
  },
];

const StatsCard = ({ date }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const res = await getDashboardStatsAPI(date);
        setStats(res.data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [date]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="border-destructive/40">
        <CardContent className="flex items-center gap-2 p-4 text-destructive">
          <FiAlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">Failed to load stats</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key] ?? 0;

        return (
          <Card key={item.key} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {value}
                {item.suffix || ""}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCard;
