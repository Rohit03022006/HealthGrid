import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  FiClock,
  FiGrid,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import { getHourlyHeatmapAPI } from "@/services/analyticsService";

import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

const formatHour = (hour) => {
  const displayHour = hour % 12 || 12;
  const suffix = hour >= 12 ? "PM" : "AM";

  return `${displayHour} ${suffix}`;
};

const HeatmapPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedData = useMemo(() => {
    return (data || []).map((item) => ({
      day_of_week: Number(item.day_of_week || 0),
      hour: Number(item.hour || 0),
      patient_count: Number(item.patient_count || 0),
    }));
  }, [data]);

  const heatmapLookup = useMemo(() => {
    const map = new Map();

    formattedData.forEach((item) => {
      map.set(`${item.day_of_week}-${item.hour}`, item.patient_count);
    });

    return map;
  }, [formattedData]);

  const summary = useMemo(() => {
    const totalPatients = formattedData.reduce(
      (sum, item) => sum + item.patient_count,
      0,
    );

    const maxCell = formattedData.reduce(
      (best, item) =>
        item.patient_count > best.patient_count ? item : best,
      {
        day_of_week: 0,
        hour: 0,
        patient_count: 0,
      },
    );

    const maxCount = Math.max(
      ...formattedData.map((item) => item.patient_count),
      1,
    );

    return {
      totalPatients,
      maxCount,
      busiestDay: maxCell.patient_count > 0 ? DAYS[maxCell.day_of_week] : "-",
      busiestHour: maxCell.patient_count > 0 ? formatHour(maxCell.hour) : "-",
      busiestCount: maxCell.patient_count,
    };
  }, [formattedData]);

  useEffect(() => {
    let mounted = true;

    const fetchHeatmap = async () => {
      setLoading(true);

      try {
        const res = await getHourlyHeatmapAPI();

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

    fetchHeatmap();

    return () => {
      mounted = false;
    };
  }, []);

  const getCount = (day, hour) => {
    return heatmapLookup.get(`${day}-${hour}`) || 0;
  };

  const getCellStyle = (count) => {
    if (count === 0) {
      return {
        backgroundColor: "hsl(var(--muted) / 0.35)",
        borderColor: "hsl(var(--border))",
        color: "hsl(var(--muted-foreground))",
      };
    }

    const intensity = 0.18 + (count / summary.maxCount) * 0.72;
    const isHigh = count / summary.maxCount > 0.58;

    return {
      backgroundColor: `hsl(var(--primary) / ${intensity})`,
      borderColor: `hsl(var(--primary) / ${Math.min(intensity + 0.15, 1)})`,
      color: isHigh
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--primary))",
    };
  };

  return (
    <Card className="h-full overflow-hidden border-primary/10 bg-background/80 shadow-sm backdrop-blur">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FiGrid className="h-5 w-5" />
            </span>

            <div>
              <CardTitle>Peak Hours</CardTitle>

              <CardDescription className="mt-1">
                Patient traffic heatmap for last 30 days
              </CardDescription>
            </div>
          </div>

          <Badge variant="secondary" className="w-fit rounded-full">
            8 AM - 7 PM
          </Badge>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : formattedData.length > 0 ? (
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
                <FiClock className="text-primary" />
                Busiest Slot
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.busiestHour}
              </p>
            </div>

            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FiTrendingUp className="text-primary" />
                Peak Day
              </div>

              <p className="mt-1 text-xl font-bold">
                {summary.busiestDay}
              </p>
            </div>
          </div>
        ) : null}
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[340px] w-full rounded-2xl" />
        ) : formattedData.length === 0 ? (
          <div className="flex h-[340px] items-center justify-center rounded-2xl border border-dashed border-primary/20 bg-muted/30">
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
                <FiGrid className="h-6 w-6 text-primary" />
              </motion.div>

              <p className="font-medium">No heatmap data</p>

              <p className="mt-1 text-sm text-muted-foreground">
                No patient traffic found for last 30 days.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-primary/10 bg-muted/20 p-4">
            <div className="min-w-[820px] space-y-2">
              <div
                className="grid items-center gap-2 text-xs text-muted-foreground"
                style={{
                  gridTemplateColumns: `64px repeat(${HOURS.length}, minmax(48px, 1fr))`,
                }}
              >
                <span />

                {HOURS.map((hour) => (
                  <span key={hour} className="text-center font-medium">
                    {formatHour(hour)}
                  </span>
                ))}
              </div>

              {DAYS.map((day, dayIndex) => (
                <div
                  key={day}
                  className="grid items-center gap-2"
                  style={{
                    gridTemplateColumns: `64px repeat(${HOURS.length}, minmax(48px, 1fr))`,
                  }}
                >
                  <span className="text-sm font-semibold text-muted-foreground">
                    {day}
                  </span>

                  {HOURS.map((hour) => {
                    const count = getCount(dayIndex, hour);

                    return (
                      <div
                        key={`${day}-${hour}`}
                        title={`${day} ${formatHour(hour)} - ${count} patients`}
                        className="flex h-11 items-center justify-center rounded-xl border text-xs font-semibold transition hover:-translate-y-0.5 hover:shadow-sm"
                        style={getCellStyle(count)}
                      >
                        {count > 0 ? count : ""}
                      </div>
                    );
                  })}
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
                <span>Low traffic</span>

                <div className="flex items-center gap-1">
                  {[0.15, 0.3, 0.45, 0.6, 0.85].map((opacity) => (
                    <span
                      key={opacity}
                      className="h-3 w-8 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--primary) / ${opacity})`,
                      }}
                    />
                  ))}
                </div>

                <span>High traffic</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatmapPanel;