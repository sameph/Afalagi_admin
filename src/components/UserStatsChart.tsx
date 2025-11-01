import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Mon", reported: 42, found: 38 },
  { name: "Tue", reported: 51, found: 45 },
  { name: "Wed", reported: 48, found: 41 },
  { name: "Thu", reported: 61, found: 54 },
  { name: "Fri", reported: 73, found: 67 },
  { name: "Sat", reported: 58, found: 52 },
  { name: "Sun", reported: 39, found: 35 },
];

export function UserStatsChart() {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-foreground">Weekly Statistics</CardTitle>
        <p className="text-sm text-muted-foreground">Persons & items reported vs found this week</p>
      </CardHeader>
      <CardContent>
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
              dataKey="reported" 
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
