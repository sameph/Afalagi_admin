import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";

const itemsData = [
  { month: "Jan", lost: 120, found: 98, matched: 85 },
  { month: "Feb", lost: 135, found: 110, matched: 95 },
  { month: "Mar", lost: 148, found: 125, matched: 108 },
];

const personsData = [
  { month: "Jan", missing: 12, found: 10, reunited: 9 },
  { month: "Feb", missing: 8, found: 7, reunited: 7 },
  { month: "Mar", missing: 15, found: 13, reunited: 11 },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">Detailed insights and trends</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items Analytics
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Persons Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Lost Items</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">403</div>
                  <p className="text-xs text-muted-foreground">+8.2% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Items Found</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">333</div>
                  <p className="text-xs text-muted-foreground">+12% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">82.6%</div>
                  <p className="text-xs text-muted-foreground">+5.1% from last quarter</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Items Trends (Last 3 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={itemsData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="lost" stroke="hsl(217 91% 60%)" strokeWidth={2} name="Lost" />
                    <Line type="monotone" dataKey="found" stroke="hsl(142 76% 36%)" strokeWidth={2} name="Found" />
                    <Line type="monotone" dataKey="matched" stroke="hsl(var(--primary))" strokeWidth={2} name="Matched" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="persons" className="space-y-6 mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Missing Persons</CardTitle>
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">35</div>
                  <p className="text-xs text-muted-foreground">-15% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Persons Found</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30</div>
                  <p className="text-xs text-muted-foreground">+10% from last quarter</p>
                </CardContent>
              </Card>
              
              <Card className="border-border bg-card/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Reunion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">85.7%</div>
                  <p className="text-xs text-muted-foreground">+3.5% from last quarter</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Persons Statistics (Last 3 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={personsData}>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="missing" fill="hsl(217 91% 60%)" radius={[8, 8, 0, 0]} name="Missing" />
                    <Bar dataKey="found" fill="hsl(142 76% 36%)" radius={[8, 8, 0, 0]} name="Found" />
                    <Bar dataKey="reunited" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="Reunited" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
