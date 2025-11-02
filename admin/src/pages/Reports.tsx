import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar } from "lucide-react";

const reports = [
  { id: 1, name: "Monthly Summary - January 2024", type: "Monthly", date: "2024-01-31", size: "2.4 MB" },
  { id: 2, name: "Lost Items Report - Q4 2023", type: "Quarterly", date: "2023-12-31", size: "5.1 MB" },
  { id: 3, name: "Missing Persons Annual Report 2023", type: "Annual", date: "2023-12-31", size: "8.7 MB" },
  { id: 4, name: "Success Rate Analysis - 2023", type: "Annual", date: "2023-12-31", size: "3.2 MB" },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Reports</h1>
              <p className="text-muted-foreground">Generate and download reports</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button>Generate New Report</Button>
            <ThemeToggle />
          </div>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{report.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {report.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(report.date).toLocaleDateString()}
                        </span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
