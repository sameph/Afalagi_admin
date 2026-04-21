import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Users, Sparkles, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchMatches, type AdminMatch } from "@/lib/api";

const Matches = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let abort = false;
    setIsLoading(true);
    const params: any = { q: searchQuery };
    if (statusFilter !== "all") params.status = statusFilter;
    if (typeFilter !== "all") params.type = typeFilter;
    fetchMatches(params)
      .then((res) => { if (!abort) { setMatches(res.matches); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load matches"); })
      .finally(() => { if (!abort) setIsLoading(false); });
    return () => { abort = true; };
  }, [searchQuery, statusFilter, typeFilter]);

  const itemMatches = useMemo(() => matches.filter(m => m.postType.includes("item")), [matches]);
  const personMatches = useMemo(() => matches.filter(m => m.postType.includes("person")), [matches]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Matches</h1>
              <p className="text-muted-foreground">Claims from users saying "This is mine" or "I found this"</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Filters */}
        <div className="mt-2 mb-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by post title or claimant..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="owner">Owner ("This is mine")</SelectItem>
              <SelectItem value="finder">Finder ("I found this")</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Item Matches
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Person Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="space-y-4 mt-6">
            {itemMatches.map((m) => (
              <Card key={`${m.postId}-${m.matchId}`} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {m.postTitle}
                    </CardTitle>
                    <Badge variant="secondary">{new Date(m.createdAt).toLocaleString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Post</p>
                      <p className="font-semibold text-foreground">{m.postTitle}</p>
                      <p className="text-xs text-muted-foreground">Type: {m.postType.replace("_", " ")}</p>
                      <Badge variant="outline" className="mt-1">{m.postStatus}</Badge>
                    </div>
                    <div />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Claim</p>
                      <p className="font-semibold text-foreground">{m.claimantName || m.claimantEmail || m.claimantPhone || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">Type: {m.matchType === 'owner' ? 'Owner (This is mine)' : 'Finder (I found this)'}</p>
                      {m.message && <p className="text-sm text-muted-foreground">“{m.message}”</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant={m.matchStatus === 'approved' ? 'default' : 'outline'}>{m.matchStatus}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline">Reject</Button>
                      <Button>Approve</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!isLoading && !error && itemMatches.length === 0 && (
              <p className="text-sm text-muted-foreground">No item matches found.</p>
            )}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4 mt-6">
            {personMatches.map((m) => (
              <Card key={`${m.postId}-${m.matchId}`} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      {m.postTitle}
                    </CardTitle>
                    <Badge className="bg-chart-2">{new Date(m.createdAt).toLocaleString()}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Post</p>
                      <p className="font-semibold text-foreground">{m.postTitle}</p>
                      <p className="text-xs text-muted-foreground">Type: {m.postType.replace("_", " ")}</p>
                      <Badge variant="outline" className="mt-1">{m.postStatus}</Badge>
                    </div>
                    <div />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Claim</p>
                      <p className="font-semibold text-foreground">{m.claimantName || m.claimantEmail || m.claimantPhone || "Anonymous"}</p>
                      <p className="text-xs text-muted-foreground">Type: {m.matchType === 'owner' ? 'Owner (This is mine)' : 'Finder (I found this)'}</p>
                      {m.message && <p className="text-sm text-muted-foreground">“{m.message}”</p>}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className={m.matchStatus === 'approved' ? 'bg-chart-2' : ''}>{m.matchStatus}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline">Reject</Button>
                      <Button className="bg-chart-2 hover:bg-chart-2/90">Approve</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {!isLoading && !error && personMatches.length === 0 && (
              <p className="text-sm text-muted-foreground">No person matches found.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Matches;
