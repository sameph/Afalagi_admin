import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast({ title: "Logged out successfully", description: "You have been logged out." });
    navigate("/login");
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Manage your account information</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="bg-card rounded-lg border p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">Update your personal information.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" defaultValue={user?.role || "admin"} disabled />
            </div>
            <div className="space-y-2">
              <Label>Last Login</Label>
              <div className="text-sm text-muted-foreground p-2 border rounded-md bg-muted/50">
                {user?.lastLogin || "-"}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
