import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down";
}

export function MetricCard({ title, value, change, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-xl shadow-card hover:shadow-glow ring-1 ring-white/10 dark:ring-white/5 transition-all duration-500 hover:-translate-y-1 hover:scale-105 animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        <p className={`text-sm ${trend === "up" ? "text-primary" : "text-secondary"}`}>
          {change} from last month
        </p>
      </CardContent>
    </Card>
  );
}
