import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  FiAward,
  FiClock,
  FiPackage,
  FiTrendingUp,
} from "react-icons/fi";

import { getTopMedicinesAPI } from "@/services/analyticsService";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PERIOD_OPTIONS = [
  {
    label: "Last 7 days",
    value: 7,
  },
  {
    label: "Last 30 days",
    value: 30,
  },
  {
    label: "Last 90 days",
    value: 90,
  },
];

const formatMedicineName = (name = "") => {
  if (name.length <= 18) return name;
  return `${name.slice(0, 18)}...`;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const count = payload[0]?.value || 0;

  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm shadow-lg">
      <p className="mb-2 font-semibold text-foreground">{label}</p>

      <p className="flex items-center justify-between gap-6 text-muted-foreground">
        <span>Prescribed</span>
        <span className="font-semibold text-foreground">{count}</span>
      </p>
    </div>
  );
};

const TopMedicinesPanel = () => {
  const [data, setData] = useState([]);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const selectedPeriodLabel =
    PERIOD_OPTIONS.find((option) => option.value === days)?.label ||
    `Last ${days} days`;

  const chartData = useMemo(() => {
    return (data || [])
      .map((item) => ({
        medicine_name: item.medicine_name || "Unknown",
        prescribed_count: Number(item.prescribed_count || 0),
      }))
      .sort((a, b) => b.prescribed_count - a.prescribed_count)
      .slice(0, 10);
  }, [data]);

  const summary = useMemo(() => {
    const totalPrescribed = chartData.reduce(
      (sum, item) => sum + item.prescribed_count,
      0,
    );

    const topMedicine = chartData[0];

    return {
      totalPrescribed,
      totalMedicines: chartData.length,
      topMedicineName: topMedicine?.medicine_name || "-",
      topMedicineCount: topMedicine?.prescribed_count || 0,
    };
  }, [chartData]);

  useEffect(() => {
    let mounted = true;

    const fetchTopMedicines = async () => {
      setLoading(true);

      try {
        const res = await getTopMedicinesAPI(days);

        if (mounted) {
          setData(res.data || []);
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

    fetchTopMedicines();

    return () => {
      mounted = false;
    };
  }, [days]);

  return (
    <Card className="h-full overflow-hidden border-primary/10 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiPackage className="h-5 w-5" />
            </span>

            <div>
              <CardTitle>Top 10 Medicines</CardTitle>

              <CardDescription className="mt-1">
                Most prescribed medicines by selected period
              </CardDescription>
            </div>
          </div>

          <Select
            value={String(days)}
            onValueChange={(value) => setDays(Number(value))}
          >
            <SelectTrigger className="h-10 w-full rounded-full sm:w-[165px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>

            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiPackage className="text-primary" />
                Medicines
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.totalMedicines}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiTrendingUp className="text-primary" />
                Prescriptions
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.totalPrescribed}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiAward className="text-primary" />
                Top Count
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.topMedicineCount}
              </p>
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[320px] w-full rounded-2xl" />
        ) : chartData.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-muted/30">
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
                <FiPackage className="h-6 w-6 text-primary" />
              </motion.div>

              <p className="font-medium">No medicine data available</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Prescribed medicines will appear here once prescriptions are
                created.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Badge variant="secondary" className="w-fit rounded-full">
                {selectedPeriodLabel}
              </Badge>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiClock className="text-primary" />
                Top medicine:{" "}
                <span className="font-medium text-foreground">
                  {summary.topMedicineName}
                </span>
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  barSize={18}
                  margin={{
                    top: 8,
                    right: 16,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    dataKey="medicine_name"
                    type="category"
                    width={150}
                    tickFormatter={formatMedicineName}
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

                  <Bar
                    dataKey="prescribed_count"
                    radius={[0, 10, 10, 0]}
                    name="Prescribed"
                    isAnimationActive
                  >
                    {chartData.map((item, index) => {
                      const opacity = Math.max(0.35, 1 - index * 0.06);

                      return (
                        <Cell
                          key={item.medicine_name}
                          fill={`hsl(var(--primary) / ${opacity})`}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopMedicinesPanel;   