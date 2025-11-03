import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { fetchMonthlyOverview } from "@/lib/api";

export function RevenueChart() {
  const [data, setData] = useState<{ month: string; lost: number; found: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    setLoading(true);
    fetchMonthlyOverview()
      .then((res) => { if (!abort) { setData(res.data); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load monthly stats"); })
      .finally(() => { if (!abort) setLoading(false); });
    return () => { abort = true; };
  }, []);

  return (
    <Card className="col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-foreground">Reports Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Lost persons & items vs found per month</p>
      </CardHeader>
      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(217 91% 60%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="month" 
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
            <Area
              type="monotone"
              dataKey="lost"
              stroke="hsl(217 91% 60%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorLost)"
            />
            <Area
              type="monotone"
              dataKey="found"
              stroke="hsl(142 76% 36%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorFound)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
