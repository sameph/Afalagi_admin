import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PackageX, PackageCheck, GitMerge, CheckCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminPosts, type Post } from "@/lib/api";

type Activity = {
  id: string;
  user: string;
  action: string;
  time: string;
  icon: any;
  color: string;
};

function formatTime(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleString();
}

function postToActivity(p: Post): Activity {
  const typeMap: Record<string, { icon: any; color: string; verb: string }> = {
    lost_person: { icon: PackageX, color: "text-primary", verb: "reported missing person" },
    lost_item: { icon: PackageX, color: "text-primary", verb: "reported lost item" },
    found_person: { icon: PackageCheck, color: "text-chart-2", verb: "reported found person" },
    found_item: { icon: PackageCheck, color: "text-chart-2", verb: "reported found item" },
  };
  const meta = typeMap[p.type] || { icon: GitMerge, color: "text-muted-foreground", verb: "activity" };
  const user = typeof p.userId === "string" ? p.userId : (p.userId?.name || p.userId?.email || "User");
  let subject = p.title || p.personName || p.itemName || "";
  if (p.type === "found_person" && p.status === "resolved") {
    subject = `reunited: ${p.personName || p.title || "person"}`;
  }
  return {
    id: p._id,
    user,
    action: `${meta.verb}: ${subject}`,
    time: formatTime(p.createdAt),
    icon: p.status === "resolved" ? CheckCircle : meta.icon,
    color: p.status === "resolved" ? "text-chart-2" : meta.color,
  };
}

export function ActivityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    setIsLoading(true);
    fetchAdminPosts({ page: 1, limit: 4 })
      .then((res) => { if (!abort) { setPosts(res.posts); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load activity"); })
      .finally(() => { if (!abort) setIsLoading(false); });
    return () => { abort = true; };
  }, []);

  const activities: Activity[] = useMemo(() => posts.slice(0, 4).map(postToActivity), [posts]);

  return (
    <Card className="border-border bg-card/50 backdrop-blur-sm shadow-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Latest platform actions</p>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
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
