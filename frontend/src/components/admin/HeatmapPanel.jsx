import { useEffect, useMemo, useState } from "react";
import { FiGrid } from "react-icons/fi";

import { getHourlyHeatmapAPI } from "@/services/analyticsService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

const HeatmapPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);

      try {
        const res = await getHourlyHeatmapAPI();
        setData(res.data || []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, []);

  const maxCount = useMemo(() => {
    return Math.max(...data.map((d) => parseInt(d.patient_count, 10)), 1);
  }, [data]);

  const getCount = (day, hour) => {
    const found = data.find(
      (d) =>
        parseInt(d.day_of_week, 10) === day &&
        parseInt(d.hour, 10) === hour
    );

    return found ? parseInt(found.patient_count, 10) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <FiGrid className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Peak Hours</CardTitle>
              <CardDescription>Patient traffic heatmap for last 30 days</CardDescription>
            </div>
          </div>

          <Badge variant="secondary">8 AM - 7 PM</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[320px] w-full" />
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[760px] space-y-2">
              <div
                className="grid items-center gap-2 text-xs text-muted-foreground"
                style={{
                  gridTemplateColumns: `64px repeat(${HOURS.length}, minmax(44px, 1fr))`,
                }}
              >
                <span />
                {HOURS.map((hour) => (
                  <span key={hour} className="text-center">
                    {hour}:00
                  </span>
                ))}
              </div>

              {DAYS.map((day, dayIndex) => (
                <div
                  key={day}
                  className="grid items-center gap-2"
                  style={{
                    gridTemplateColumns: `64px repeat(${HOURS.length}, minmax(44px, 1fr))`,
                  }}
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {day}
                  </span>

                  {HOURS.map((hour) => {
                    const count = getCount(dayIndex, hour);
                    const opacity = count === 0 ? 0.08 : 0.18 + (count / maxCount) * 0.82;

                    return (
                      <div
                        key={`${day}-${hour}`}
                        title={`${count} patients`}
                        className="flex h-10 items-center justify-center rounded-md border text-xs font-medium text-primary"
                        style={{
                          backgroundColor: `oklch(0.488 0.243 264.376 / ${opacity})`,
                        }}
                      >
                        {count > 0 ? count : ""}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeatmapPanel;