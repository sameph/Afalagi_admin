import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Users, MapPin, Calendar } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchAdminPosts, type Post } from "@/lib/api";

const Items = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let abort = false;
    setIsLoading(true);
    fetchAdminPosts({ q })
      .then((res) => { if (!abort) { setPosts(res.posts); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load reports"); })
      .finally(() => { if (!abort) setIsLoading(false); });
    return () => { abort = true; };
  }, [q]);

  const itemsData = useMemo(() => posts.filter(p => p.type === 'lost_item' || p.type === 'found_item'), [posts]);
  const personsData = useMemo(() => posts.filter(p => p.type === 'lost_person' || p.type === 'found_person'), [posts]);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">All Reports</h1>
              <p className="text-muted-foreground">Browse all items and persons</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Items
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Persons
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {error && <p className="text-sm text-destructive">{error}</p>}

          <TabsContent value="items" className="space-y-4">
            {itemsData.map((item) => (
              <Card key={item._id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{item.itemName || item.title}</h3>
                        <Badge variant={item.type === 'lost_item' ? "destructive" : "default"}>
                          {item.type === 'lost_item' ? 'Lost' : 'Found'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {item.category || 'Item'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {item.location?.address || item.location?.city || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.lastSeenDate || item.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <Button>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4">
            {personsData.map((person) => (
              <Card key={person._id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{person.personName || person.title}</h3>
                        <Badge variant={person.type === 'lost_person' ? "destructive" : "default"}>
                          {person.type === 'lost_person' ? 'Missing' : 'Found'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Age: {person.age ?? 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Last seen: {person.location?.address || person.location?.city || 'Unknown'}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(person.lastSeenDate || person.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <Button>View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Items;
