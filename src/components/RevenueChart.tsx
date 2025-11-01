import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { month: "Jan", lost: 145, found: 98 },
  { month: "Feb", lost: 168, found: 112 },
  { month: "Mar", lost: 152, found: 134 },
  { month: "Apr", lost: 189, found: 156 },
  { month: "May", lost: 203, found: 178 },
  { month: "Jun", lost: 227, found: 195 },
  { month: "Jul", lost: 234, found: 210 },
  { month: "Aug", lost: 218, found: 198 },
  { month: "Sep", lost: 256, found: 231 },
  { month: "Oct", lost: 267, found: 245 },
  { month: "Nov", lost: 289, found: 268 },
  { month: "Dec", lost: 312, found: 287 },
];

export function RevenueChart() {
  return (
    <Card className="col-span-2 border-border bg-card/50 backdrop-blur-sm shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-foreground">Reports Overview</CardTitle>
        <p className="text-sm text-muted-foreground">Lost persons & items vs found per month in 2024</p>
      </CardHeader>
      <CardContent>
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
