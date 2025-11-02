import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Users, ArrowRight, Sparkles } from "lucide-react";

const itemMatches = [
  { 
    id: 1, 
    lost: { name: "Samsung Phone", reporter: "Abebe T.", date: "2024-01-15" },
    found: { name: "Samsung Galaxy S23", finder: "Sara A.", date: "2024-01-16" },
    confidence: 95,
    status: "Pending Verification"
  },
  { 
    id: 2, 
    lost: { name: "Blue Wallet", reporter: "Tigist H.", date: "2024-01-10" },
    found: { name: "Blue Leather Wallet", finder: "Michael B.", date: "2024-01-14" },
    confidence: 88,
    status: "Confirmed Match"
  },
];

const personMatches = [
  { 
    id: 1, 
    missing: { name: "Marta Girma", age: "8 years", reporter: "Family", date: "2024-01-15" },
    found: { name: "Young girl found", finder: "Police Station", date: "2024-01-15" },
    confidence: 92,
    status: "Reunited"
  },
];

const Matches = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Matches</h1>
              <p className="text-muted-foreground">Potential matches found by our system</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

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
            {itemMatches.map((match) => (
              <Card key={match.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Match #{match.id}
                    </CardTitle>
                    <Badge variant={match.status === "Confirmed Match" ? "default" : "secondary"}>
                      {match.confidence}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Lost Report</p>
                      <p className="font-semibold text-foreground">{match.lost.name}</p>
                      <p className="text-sm text-muted-foreground">By: {match.lost.reporter}</p>
                      <p className="text-xs text-muted-foreground">{new Date(match.lost.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Found Report</p>
                      <p className="font-semibold text-foreground">{match.found.name}</p>
                      <p className="text-sm text-muted-foreground">By: {match.found.finder}</p>
                      <p className="text-xs text-muted-foreground">{new Date(match.found.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant="outline">{match.status}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline">Reject</Button>
                      <Button>Confirm Match</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4 mt-6">
            {personMatches.map((match) => (
              <Card key={match.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Person Match #{match.id}
                    </CardTitle>
                    <Badge className="bg-chart-2">
                      {match.confidence}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Missing Person</p>
                      <p className="font-semibold text-foreground">{match.missing.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {match.missing.age}</p>
                      <p className="text-sm text-muted-foreground">Reported by: {match.missing.reporter}</p>
                      <p className="text-xs text-muted-foreground">{new Date(match.missing.date).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <ArrowRight className="h-6 w-6 text-chart-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Found Report</p>
                      <p className="font-semibold text-foreground">{match.found.name}</p>
                      <p className="text-sm text-muted-foreground">By: {match.found.finder}</p>
                      <p className="text-xs text-muted-foreground">{new Date(match.found.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Badge className="bg-chart-2">{match.status}</Badge>
                    <div className="space-x-2">
                      <Button variant="outline">View Details</Button>
                      <Button className="bg-chart-2 hover:bg-chart-2/90">Contact Family</Button>
                    </div>
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

export default Matches;
