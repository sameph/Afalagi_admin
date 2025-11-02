import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, MapPin } from "lucide-react";

const users = [
  { id: 1, name: "Abebe Tadesse", email: "abebe@example.com", phone: "+251 91 234 5678", location: "Addis Ababa", reports: 12, status: "Active" },
  { id: 2, name: "Tigist Haile", email: "tigist@example.com", phone: "+251 91 345 6789", location: "Addis Ababa", reports: 8, status: "Active" },
  { id: 3, name: "Dawit Bekele", email: "dawit@example.com", phone: "+251 91 456 7890", location: "Addis Ababa", reports: 15, status: "Active" },
  { id: 4, name: "Sara Ahmed", email: "sara@example.com", phone: "+251 91 567 8901", location: "Addis Ababa", reports: 5, status: "Inactive" },
];

const Users = () => {
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
          <Input placeholder="Search users..." className="pl-10" />
        </div>

        <div className="grid gap-4">
          {users.map((user) => (
            <Card key={user.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                        <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {user.location}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        Total Reports: <span className="font-semibold text-foreground">{user.reports}</span>
                      </p>
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
