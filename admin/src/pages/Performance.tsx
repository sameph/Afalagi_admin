import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, CheckCircle, Users } from "lucide-react";

const Performance = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance</h1>
              <p className="text-muted-foreground">Platform performance metrics</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4h</div>
              <p className="text-xs text-muted-foreground">Average response time</p>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82.6%</div>
              <p className="text-xs text-muted-foreground">Cases resolved</p>
              <Progress value={82.6} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
              <TrendingUp className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">Average rating</p>
              <Progress value={96} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
              <Progress value={45} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Items Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Match Accuracy</span>
                  <span className="text-sm font-semibold">89%</span>
                </div>
                <Progress value={89} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Recovery Rate</span>
                  <span className="text-sm font-semibold">76%</span>
                </div>
                <Progress value={76} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Processing Speed</span>
                  <span className="text-sm font-semibold">92%</span>
                </div>
                <Progress value={92} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Persons Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Reunion Rate</span>
                  <span className="text-sm font-semibold">85%</span>
                </div>
                <Progress value={85} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Response Time</span>
                  <span className="text-sm font-semibold">94%</span>
                </div>
                <Progress value={94} />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-semibold">88%</span>
                </div>
                <Progress value={88} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
