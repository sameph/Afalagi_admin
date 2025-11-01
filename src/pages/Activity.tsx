import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Activity = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Activity Feed</h1>
              <p className="text-muted-foreground">Real-time platform activity</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Today's Reports</span>
                <span className="font-semibold text-foreground">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Items Found</span>
                <span className="font-semibold text-chart-2">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Persons Reunited</span>
                <span className="font-semibold text-chart-2">2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Users</span>
                <span className="font-semibold text-foreground">156</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Activity;
