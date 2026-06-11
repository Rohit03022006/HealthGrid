import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { FiTrendingUp } from "react-icons/fi";

import { getDashboardStatsAPI } from "@/services/analyticsService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OPDChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLast7Days = async () => {
      setLoading(true);

      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      }).reverse();

      try {
        const results = await Promise.all(
          dates.map((date) => getDashboardStatsAPI(date))
        );

        const chartData = results.map((res, i) => ({
          date: dates[i].slice(5),
          patients: res.data.totalPatients || 0,
          completed: res.data.completed || 0,
        }));

        setData(chartData);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLast7Days();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <FiTrendingUp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Last 7 Days OPD Count</CardTitle>
            <CardDescription>Total and completed patient visits</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full" />
        ) : data.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No chart data available
          </p>
        ) : (
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--foreground)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Total"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--muted-foreground)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OPDChart;