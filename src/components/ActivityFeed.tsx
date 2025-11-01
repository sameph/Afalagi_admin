import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PackageX, PackageCheck, GitMerge, CheckCircle } from "lucide-react";

const activities = [
  {
    id: 1,
    user: "Abebe Tadesse",
    action: "Reported missing person: Marta Girma, last seen in Bole",
    time: "2 minutes ago",
    icon: PackageX,
    color: "text-primary",
  },
  {
    id: 2,
    user: "Tigist Haile",
    action: "Found wallet with ID near Piazza",
    time: "15 minutes ago",
    icon: PackageCheck,
    color: "text-chart-2",
  },
  {
    id: 3,
    user: "Dawit Bekele",
    action: "Successfully reunited: Lost child found at Merkato",
    time: "1 hour ago",
    icon: GitMerge,
    color: "text-chart-2",
  },
  {
    id: 4,
    user: "Sara Ahmed",
    action: "Claimed mobile phone from CMC area",
    time: "2 hours ago",
    icon: CheckCircle,
    color: "text-chart-2",
  },
];

export function ActivityFeed() {
  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest platform actions</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                  {activity.user.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">{activity.user}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                  {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
