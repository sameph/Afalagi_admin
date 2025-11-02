import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Package, Users, MapPin, Calendar, AlertCircle } from "lucide-react";

const lostItems = [
  { id: 1, name: "Samsung Phone", type: "Electronics", location: "Bole", date: "2024-01-15", priority: "High" },
  { id: 2, name: "Car Keys", type: "Keys", location: "CMC", date: "2024-01-13", priority: "Medium" },
  { id: 3, name: "Laptop Bag", type: "Bags", location: "Meskel Square", date: "2024-01-10", priority: "High" },
];

const missingPersons = [
  { id: 1, name: "Marta Girma", age: "8 years", location: "Merkato", date: "2024-01-15", priority: "Critical" },
  { id: 2, name: "Samuel Kebede", age: "75 years", location: "Addis Ketema", date: "2024-01-14", priority: "High" },
];

const Lost = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Lost Reports</h1>
              <p className="text-muted-foreground">Active missing persons and lost items</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Lost Items
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Missing Persons
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search lost reports..." className="pl-10" />
            </div>
          </div>

          <TabsContent value="items" className="space-y-4">
            {lostItems.map((item) => (
              <Card key={item.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                        <Badge variant="destructive">Lost</Badge>
                        <Badge variant={item.priority === "High" ? "default" : "secondary"}>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        {item.type}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button>Investigate</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4">
            {missingPersons.map((person) => (
              <Card key={person.id} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-glow transition-all border-l-4 border-l-destructive">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                        <Badge variant="destructive">Missing</Badge>
                        <Badge className="bg-red-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {person.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Age: {person.age}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Last seen: {person.location}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(person.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="destructive">Urgent Action</Button>
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

export default Lost;
