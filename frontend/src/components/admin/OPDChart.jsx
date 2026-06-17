import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FiCheckCircle,
  FiPercent,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { getDashboardStatsAPI } from "@/services/analyticsService";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index);

    return date.toISOString().split("T")[0];
  }).reverse();
};

const formatChartDate = (date) => {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const total = payload.find((item) => item.dataKey === "patients");
  const completed = payload.find((item) => item.dataKey === "completed");

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{label}</p>

      <div className="space-y-1.5">
        <p className="flex items-center justify-between gap-6 text-muted-foreground">
          <span>Total Patients</span>
          <span className="font-semibold text-foreground">
            {total?.value || 0}
          </span>
        </p>

        <p className="flex items-center justify-between gap-6 text-muted-foreground">
          <span>Completed</span>
          <span className="font-semibold text-foreground">
            {completed?.value || 0}
          </span>
        </p>
      </div>
    </div>
  );
};

const OPDChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const summary = useMemo(() => {
    const totalPatients = data.reduce(
      (sum, item) => sum + Number(item.patients || 0),
      0,
    );

    const completedPatients = data.reduce(
      (sum, item) => sum + Number(item.completed || 0),
      0,
    );

    const completionRate =
      totalPatients > 0
        ? Math.round((completedPatients / totalPatients) * 100)
        : 0;

    return {
      totalPatients,
      completedPatients,
      completionRate,
    };
  }, [data]);

  useEffect(() => {
    let mounted = true;

    const fetchLast7Days = async () => {
      setLoading(true);

      const dates = getLast7Days();

      try {
        const results = await Promise.all(
          dates.map((date) => getDashboardStatsAPI(date)),
        );

        const chartData = results.map((res, index) => ({
          rawDate: dates[index],
          date: formatChartDate(dates[index]),
          patients: Number(res.data?.totalPatients || 0),
          completed: Number(res.data?.completed || 0),
        }));

        if (mounted) {
          setData(chartData);
        }
      } catch {
        if (mounted) {
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLast7Days();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card className="h-full overflow-hidden border-primary/10 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiTrendingUp className="h-5 w-5" />
            </span>

            <div>
              <CardTitle>Last 7 Days OPD Count</CardTitle>

              <CardDescription className="mt-1">
                Total and completed patient visits
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary" className="w-fit rounded-full">
            Last 7 Days
          </Badge>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiUsers className="text-primary" />
                Total Patients
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.totalPatients}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiCheckCircle className="text-primary" />
                Completed
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.completedPatients}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiPercent className="text-primary" />
                Completion
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.completionRate}%
              </p>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[280px] w-full rounded-2xl" />
        ) : data.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-muted/30">
            <div className="text-center">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
              >
                <FiTrendingUp className="h-6 w-6 text-primary" />
              </motion.div>

              <p className="font-medium">No chart data available</p>

              <p className="mt-1 text-sm text-muted-foreground">
                OPD activity will appear here once visits are recorded.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: -18,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="patientsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="completedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--muted-foreground))"
                      stopOpacity={0.2}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--muted-foreground))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fill: "hsl(var(--muted-foreground))",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />

                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    color: "hsl(var(--muted-foreground))",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="hsl(var(--primary))"
                  fill="url(#patientsGradient)"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "hsl(var(--background))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  name="Total"
                  isAnimationActive
                />

                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="hsl(var(--muted-foreground))"
                  fill="url(#completedGradient)"
                  strokeWidth={3}
                  dot={{
                    r: 4,
                    strokeWidth: 2,
                    fill: "hsl(var(--background))",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                  name="Completed"
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OPDChart;