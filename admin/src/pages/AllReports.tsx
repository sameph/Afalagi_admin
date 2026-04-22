import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Package, Users, MapPin, Calendar, CheckCircle, Filter, Phone, Mail, Info, Plus, AlertCircle, Database } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { fetchAdminPosts, type Post } from "@/lib/api";
import { AddPostDialog } from "@/components/AddPostDialog";

const AllReports = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadPosts = useCallback(() => {
    let abort = false;
    setIsLoading(true);
    fetchAdminPosts({ q: searchQuery })
      .then((res) => { if (!abort) { setPosts(res.posts); setError(null); } })
      .catch((e) => { if (!abort) setError(e.message || "Failed to load reports"); })
      .finally(() => { if (!abort) setIsLoading(false); });
    return () => { abort = true; };
  }, [searchQuery]);

  useEffect(() => {
    return loadPosts();
  }, [loadPosts]);

  // Filtering Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Status Filter
      if (statusFilter === 'pending' && post.status === 'resolved') return false;
      if (statusFilter === 'resolved' && post.status !== 'resolved') return false;
      
      // Type Filter
      if (typeFilter === 'lost_item' && post.type !== 'lost_item') return false;
      if (typeFilter === 'found_item' && post.type !== 'found_item') return false;
      if (typeFilter === 'lost_person' && post.type !== 'lost_person') return false;
      if (typeFilter === 'found_person' && post.type !== 'found_person') return false;

      return true;
    });
  }, [posts, statusFilter, typeFilter]);

  const itemsData = useMemo(() => filteredPosts.filter(p => p.type === 'lost_item' || p.type === 'found_item'), [filteredPosts]);
  const personsData = useMemo(() => filteredPosts.filter(p => p.type === 'lost_person' || p.type === 'found_person'), [filteredPosts]);

  const renderBadge = (type: string) => {
    if (type === 'lost_item' || type === 'lost_person') {
      return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 shadow-none border-red-500/20">Lost/Missing</Badge>;
    }
    return <Badge className="bg-chart-2/10 text-chart-2 hover:bg-chart-2/20 shadow-none border-chart-2/20 shrink-0">Found</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text">Central Reports</h1>
              <p className="text-muted-foreground mt-1 font-medium">Manage and monitor all items and persons</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={() => setIsAddOpen(true)} className="gap-2 shadow-glow w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Report
            </Button>
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-border/30 bg-card/60 backdrop-blur-xl shadow-card transition-all hover:shadow-glow hover:-translate-y-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Total Reports</CardTitle>
              <Database className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter">{posts.length}</div>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/60 backdrop-blur-xl shadow-card transition-all hover:shadow-glow hover:-translate-y-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Open Cases</CardTitle>
              <AlertCircle className="h-4 w-4 text-chart-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter text-chart-4">
                {posts.filter(p => p.status !== 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/60 backdrop-blur-xl shadow-card transition-all hover:shadow-glow hover:-translate-y-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-chart-2" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter text-chart-2">
                {posts.filter(p => p.status === 'resolved').length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/30 bg-card/60 backdrop-blur-xl shadow-card transition-all hover:shadow-glow hover:-translate-y-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-semibold text-muted-foreground">New This Week</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tighter text-primary">
                {posts.filter(p => new Date(p.createdAt || Date.now()) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <TabsList className="grid w-full max-w-sm grid-cols-2 bg-muted/40 p-1 mb-2 lg:mb-0">
              <TabsTrigger value="items" className="flex items-center gap-2 rounded-md font-medium">
                <Package className="h-4 w-4" />
                Items ({itemsData.length})
              </TabsTrigger>
              <TabsTrigger value="persons" className="flex items-center gap-2 rounded-md font-medium">
                <Users className="h-4 w-4" />
                Persons ({personsData.length})
              </TabsTrigger>
            </TabsList>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search reports..." 
                  className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary/40 backdrop-blur-sm" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border/50 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px] bg-background/50 border-border/50 backdrop-blur-sm">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="lost_item">Lost Items</SelectItem>
                  <SelectItem value="found_item">Found Items</SelectItem>
                  <SelectItem value="lost_person">Missing Persons</SelectItem>
                  <SelectItem value="found_person">Found Persons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">{error}</div>}

          <TabsContent value="items" className="space-y-4 focus-visible:outline-none">
            {itemsData.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">No items match your criteria.</div>
            )}
            {itemsData.map((item) => (
              <Card key={item._id} className="border-border/30 bg-card/40 backdrop-blur-xl shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-500 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-5 p-5">
                    <div className="relative w-full sm:w-[140px] h-[140px] rounded-xl overflow-hidden bg-muted/30 flex-shrink-0 border border-border/50 group-hover:border-primary/20 transition-colors">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={(item.images && item.images[0]?.url) || undefined} alt={item.itemName || item.title} className="object-cover" />
                        <AvatarFallback className="rounded-none bg-transparent text-primary/40">
                          <Package className="h-10 w-10 shrink-0" />
                        </AvatarFallback>
                      </Avatar>
                      {item.status === 'resolved' && (
                        <div className="absolute top-2 right-2 bg-chart-2/90 backdrop-blur text-white p-1.5 rounded-full shadow-sm">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="text-xl font-bold text-foreground leading-tight">{item.itemName || item.title}</h3>
                            {renderBadge(item.type)}
                            {item.status === 'resolved' && <Badge variant="outline" className="text-chart-2 border-chart-2/30 bg-chart-2/5">Resolved</Badge>}
                          </div>
                          <div className="flex gap-2">
                            {item.category && <Badge variant="secondary" className="text-xs bg-secondary/60 hover:bg-secondary/80">{item.category}</Badge>}
                            {item.brand && <Badge variant="secondary" className="text-xs bg-secondary/60 hover:bg-secondary/80">{item.brand}</Badge>}
                          </div>
                        </div>
                        <div className="hidden lg:flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4"/></Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 max-w-3xl">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                          {item.location?.address || item.location?.city || 'Location unspecified'}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                          {new Date(item.lastSeenDate || item.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        {item.contactPhone && (
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                            {item.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4 focus-visible:outline-none">
            {personsData.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">No persons match your criteria.</div>
            )}
            {personsData.map((person) => (
              <Card key={person._id} className="border-border/30 bg-card/40 backdrop-blur-xl shadow-card hover:shadow-glow hover:border-primary/30 transition-all duration-500 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row gap-5 p-5">
                    <div className="relative w-full sm:w-[140px] h-[140px] rounded-xl overflow-hidden bg-muted/30 flex-shrink-0 border border-border/50 group-hover:border-primary/20 transition-colors">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage src={(person.images && person.images[0]?.url) || undefined} alt={person.personName || person.title} className="object-cover" />
                        <AvatarFallback className="rounded-none bg-transparent text-primary/60 text-3xl font-light">
                          {(person.personName || person.title || 'P').charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {person.status === 'resolved' && (
                        <div className="absolute top-2 right-2 bg-chart-2/90 backdrop-blur text-white p-1.5 rounded-full shadow-sm">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 py-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <h3 className="text-xl font-bold text-foreground leading-tight">{person.personName || person.title}</h3>
                            {renderBadge(person.type)}
                            {person.priority === 'high' && <Badge className="bg-orange-500 text-white hover:bg-orange-600 shadow-none">Urgent</Badge>}
                          </div>
                          <div className="flex gap-2">
                            {person.age && <Badge variant="secondary" className="text-xs bg-secondary/60 hover:bg-secondary/80">Age: {person.age}</Badge>}
                            {person.gender && <Badge variant="secondary" className="text-xs bg-secondary/60 hover:bg-secondary/80 capitalize">{person.gender}</Badge>}
                          </div>
                        </div>
                        <div className="hidden lg:flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Phone className="h-4 w-4"/></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary"><Mail className="h-4 w-4"/></Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 max-w-3xl">
                        {person.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <MapPin className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                          {person.location?.address || person.location?.city || 'Location unspecified'}
                        </span>
                        <span className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                          {new Date(person.lastSeenDate || person.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                        {person.contactPhone && (
                          <span className="flex items-center gap-1.5 whitespace-nowrap">
                            <Phone className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                            Contact: {person.contactPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <AddPostDialog open={isAddOpen} onOpenChange={setIsAddOpen} onSuccess={() => loadPosts()} defaultType="lost_item" />
    </DashboardLayout>
  );
};

export default AllReports;
