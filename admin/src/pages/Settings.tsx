import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { createAdminInvite, listAdminInvites, resendAdminInvite, revokeAdminInvite, type AdminInvite } from "@/lib/api";
import { toast } from "sonner";

const Settings = () => {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState<AdminInvite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  const loadInvites = async () => {
    setLoadingInvites(true);
    try {
      const res = await listAdminInvites();
      setInvites(res.invites);
    } catch (e: any) {
      toast.error(e.message || "Failed to load invites");
    } finally {
      setLoadingInvites(false);
    }
  };

  useEffect(() => {
    loadInvites();
  }, []);
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
        </div>

        <div className="grid gap-6">
          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Admin Invitations</CardTitle>
              <CardDescription>Invite new admins by email and manage invitations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="invite-email">Email address</Label>
                  <Input id="invite-email" type="email" placeholder="name@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                </div>
                <Button
                  type="button"
                  onClick={async () => {
                    if (!inviteEmail) return;
                    try {
                      await createAdminInvite(inviteEmail);
                      toast.success("Invitation sent");
                      setInviteEmail("");
                      await loadInvites();
                    } catch (e: any) {
                      toast.error(e.message || "Failed to send invite");
                    }
                  }}
                >
                  Send Invite
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                {loadingInvites && <p className="text-sm text-muted-foreground">Loading invites...</p>}
                {invites.length === 0 && !loadingInvites && (
                  <p className="text-sm text-muted-foreground">No invites yet.</p>
                )}
                {invites.map((inv) => (
                  <div key={inv._id} className="flex items-center justify-between p-3 rounded-md border bg-card/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">{inv.email}</p>
                      <p className="text-xs text-muted-foreground">Status: {inv.status} • Expires: {new Date(inv.expiresAt).toLocaleString()}</p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={async () => {
                          try {
                            await resendAdminInvite(inv._id);
                            toast.success("Invite resent");
                            await loadInvites();
                          } catch (e: any) {
                            toast.error(e.message || "Failed to resend invite");
                          }
                        }}
                      >
                        Resend
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={async () => {
                          try {
                            await revokeAdminInvite(inv._id);
                            toast.success("Invite revoked");
                            await loadInvites();
                          } catch (e: any) {
                            toast.error(e.message || "Failed to revoke invite");
                          }
                        }}
                      >
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>Configure platform-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
