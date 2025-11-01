import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import { UserStatsChart } from "@/components/UserStatsChart";
import { PackageSearch, GitMerge, Package, TrendingUp, Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Reports"
            value="1,284"
            change="+18.2%"
            icon={PackageSearch}
            trend="up"
          />
          <MetricCard
            title="Missing Persons"
            value="23"
            change="-12.5%"
            icon={Users}
            trend="down"
          />
          <MetricCard
            title="Successful Reunions"
            value="847"
            change="+24.5%"
            icon={GitMerge}
            trend="up"
          />
          <MetricCard
            title="Success Rate"
            value="66%"
            change="+3.2%"
            icon={TrendingUp}
            trend="up"
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <RevenueChart />
          <ActivityFeed />
        </div>

        {/* User Stats */}
        <UserStatsChart />
      </div>
    </DashboardLayout>
  );
};

export default Index;
