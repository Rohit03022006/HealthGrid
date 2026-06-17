import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FiClock,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";

import { getDoctorLoadAPI } from "@/services/analyticsService";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const formatDoctorName = (name = "") => {
  if (name.length <= 12) return name;
  return `${name.slice(0, 12)}...`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const patients = payload.find((item) => item.dataKey === "total_patients");
  const avgMinutes = payload.find((item) => item.dataKey === "avg_minutes");

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{label}</p>

      <div className="space-y-1.5">
        <p className="flex items-center justify-between gap-6 text-muted-foreground">
          <span>Patients</span>
          <span className="font-semibold text-foreground">
            {patients?.value || 0}
          </span>
        </p>

        <p className="flex items-center justify-between gap-6 text-muted-foreground">
          <span>Avg Minutes</span>
          <span className="font-semibold text-foreground">
            {avgMinutes?.value || 0} min
          </span>
        </p>
      </div>
    </div>
  );
};

const DoctorLoadChart = ({ date }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const summary = useMemo(() => {
    const totalPatients = data.reduce(
      (sum, item) => sum + Number(item.total_patients || 0),
      0,
    );

    const avgMinutes =
      data.length > 0
        ? Math.round(
            data.reduce((sum, item) => sum + Number(item.avg_minutes || 0), 0) /
              data.length,
          )
        : 0;

    return {
      totalDoctors: data.length,
      totalPatients,
      avgMinutes,
    };
  }, [data]);

  useEffect(() => {
    let mounted = true;

    const fetchDoctorLoad = async () => {
      setLoading(true);

      try {
        const res = await getDoctorLoadAPI(date);

        const formattedData = (res.data || [])
          .map((item) => ({
            doctor_name: item.doctor_name || "Unknown",
            total_patients: Number(item.total_patients || 0),
            avg_minutes: Number(item.avg_minutes || 0),
          }))
          .sort((a, b) => b.total_patients - a.total_patients);

        if (mounted) {
          setData(formattedData);
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

    fetchDoctorLoad();

    return () => {
      mounted = false;
    };
  }, [date]);

  return (
    <Card className="h-full overflow-hidden border-primary/10 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiUserCheck className="h-5 w-5" />
            </span>

            <div>
              <CardTitle>Doctor Load</CardTitle>

              <CardDescription className="mt-1">
                Patient count and average consultation time
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary" className="w-fit rounded-full">
            {date}
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
                Doctors
              </div>

              <p className="mt-1 text-xl font-bold">{summary.totalDoctors}</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiTrendingUp className="text-primary" />
                Patients
              </div>

              <p className="mt-1 text-xl font-bold">{summary.totalPatients}</p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiClock className="text-primary" />
                Avg Time
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.avgMinutes} min
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
                <FiUserCheck className="h-6 w-6 text-primary" />
              </motion.div>

              <p className="font-medium">No doctor load data</p>

              <p className="mt-1 text-sm text-muted-foreground">
                No consultations found for this date.
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barGap={8}
                margin={{
                  top: 10,
                  right: 10,
                  left: -18,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />

                <XAxis
                  dataKey="doctor_name"
                  tickFormatter={formatDoctorName}
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
                    fill: "hsl(var(--muted))",
                    opacity: 0.35,
                  }}
                />

                <Legend
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: 12,
                    color: "hsl(var(--muted-foreground))",
                  }}
                />

                <Bar
                  dataKey="total_patients"
                  fill="hsl(var(--primary))"
                  radius={[10, 10, 0, 0]}
                  name="Patients"
                  isAnimationActive
                />

                <Bar
                  dataKey="avg_minutes"
                  fill="hsl(var(--muted-foreground))"
                  radius={[10, 10, 0, 0]}
                  name="Avg Min"
                  isAnimationActive
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorLoadChart;