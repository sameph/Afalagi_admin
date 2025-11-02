import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivityFeed } from "@/components/ActivityFeed";
import { UserStatsChart } from "@/components/UserStatsChart";
import { PackageSearch, GitMerge, Package, TrendingUp, Users, PackageX, PackageCheck, UserPlus, Settings } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || 'Admin'}</p>
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

        {/* Quick Actions */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="justify-start gap-2">
                <Link to="/lost">
                  <PackageX className="h-4 w-4" />
                  New Lost Report
                </Link>
              </Button>
              <Button asChild className="justify-start gap-2">
                <Link to="/found">
                  <PackageCheck className="h-4 w-4" />
                  New Found Report
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link to="/users">
                  <UserPlus className="h-4 w-4" />
                  Invite User
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2">
                <Link to="/settings">
                  <Settings className="h-4 w-4" />
                  Open Settings
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

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
