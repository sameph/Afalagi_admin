import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUsers, type User } from "@/lib/api";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let abort = false;
    setIsLoading(true);
    fetchUsers({ q })
      .then((res) => {
        if (!abort) {
          setUsers(res.users);
          setError(null);
        }
      })
      .catch((e) => !abort && setError(e.message || "Failed to load users"))
      .finally(() => !abort && setIsLoading(false));
    return () => {
      abort = true;
    };
  }, [q]);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Users</h1>
              <p className="text-muted-foreground">Manage platform users</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading users...</p>
        )}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user._id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {(user.name || user.email).split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{user.name || user.email}</h3>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          N/A
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                        </div>
                      </div>
                      
                      {user.lastLogin && (
                        <p className="text-sm text-muted-foreground">
                          Last login: <span className="font-semibold text-foreground">{new Date(user.lastLogin).toLocaleString()}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-x-2">
                    <Button variant="outline">View Profile</Button>
                    <Button>Contact</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
