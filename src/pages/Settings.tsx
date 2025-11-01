import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your platform settings</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid gap-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Configure platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="Afalagi - Lost & Found" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input id="contact-email" type="email" defaultValue="admin@afalagi.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-phone">Support Phone</Label>
                <Input id="support-phone" defaultValue="+251 91 234 5678" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Reports</Label>
                  <p className="text-sm text-muted-foreground">Get notified when new reports are submitted</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Matches Found</Label>
                  <p className="text-sm text-muted-foreground">Get notified when potential matches are found</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Critical Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about missing persons</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Item & Person Categories</CardTitle>
              <CardDescription>Manage report categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-categorization</Label>
                  <p className="text-sm text-muted-foreground">Automatically categorize reports using AI</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Smart Matching</Label>
                  <p className="text-sm text-muted-foreground">Use AI to suggest potential matches</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
