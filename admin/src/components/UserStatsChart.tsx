import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { fetchWeeklyStats } from "@/lib/api";

export function UserStatsChart() {
  const [data, setData] = useState<{ name: string; lost: number; found: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    setLoading(true);
    fetchWeeklyStats()
      .then((res) => { if (!abort) { setData(res.data); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load weekly stats"); })
      .finally(() => { if (!abort) setLoading(false); });
    return () => { abort = true; };
  }, []);

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-foreground">Weekly Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">Lost persons & items vs found this week</p>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
            />
            <Bar 
              dataKey="lost" 
              fill="hsl(217 91% 60%)" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="found" 
              fill="hsl(142 76% 36%)" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
