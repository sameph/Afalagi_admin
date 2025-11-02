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
import { Search, Package, Users, MapPin, Calendar, CheckCircle, Filter, Clock, Phone, Mail, Info } from "lucide-react";
import { useState } from "react";

const foundItems = [
  { 
    id: 1, 
    name: "Blue Leather Wallet", 
    type: "Personal Items", 
    location: "Piazza Shopping Center", 
    date: "2024-01-14", 
    time: "14:30",
    claimed: false,
    description: "Contains ID cards and credit cards",
    finder: "Security Guard",
    contact: "+251-911-234567",
    image: "/placeholder.svg"
  },
  { 
    id: 2, 
    name: "Gold Watch", 
    type: "Jewelry", 
    location: "Bole Road, Atlas Hotel", 
    date: "2024-01-12",
    time: "09:15",
    claimed: false,
    description: "Rolex style gold watch with brown leather strap",
    finder: "Hotel Staff",
    contact: "+251-911-345678",
    image: "/placeholder.svg"
  },
  { 
    id: 3, 
    name: "House Keys", 
    type: "Keys", 
    location: "Megenagna Bus Station", 
    date: "2024-01-11",
    time: "18:45",
    claimed: true,
    description: "Set of 4 keys with blue keychain",
    finder: "Bus Driver",
    contact: "+251-911-456789",
    image: "/placeholder.svg"
  },
];

const foundPersons = [
  { 
    id: 1, 
    name: "Yonas Tesfaye", 
    age: "65 years", 
    gender: "Male",
    location: "Arat Kilo, Near Post Office", 
    date: "2024-01-12",
    time: "16:20",
    reunited: true,
    description: "Elderly man, wearing blue jacket, seemed disoriented",
    finder: "Community Police",
    contact: "+251-911-567890",
    image: "/placeholder.svg",
    familyContact: "+251-911-111222"
  },
  { 
    id: 2, 
    name: "Helen Assefa", 
    age: "10 years",
    gender: "Female", 
    location: "Stadium Area, Near Main Gate", 
    date: "2024-01-13",
    time: "11:30",
    reunited: false,
    description: "Young girl, wearing school uniform, unable to find parents",
    finder: "Stadium Security",
    contact: "+251-911-678901",
    image: "/placeholder.svg",
    familyContact: "Not available"
  },
];

const Found = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Found Reports</h1>
              <p className="text-muted-foreground">Items found and persons reunited</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{foundItems.length + foundPersons.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Items & Persons</p>
            </CardContent>
          </Card>
          <Card className="border-chart-2/20 bg-gradient-to-br from-chart-2/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Claimed/Reunited</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-2">
                {foundItems.filter(i => i.claimed).length + foundPersons.filter(p => p.reunited).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Successfully matched</p>
            </CardContent>
          </Card>
          <Card className="border-chart-3/20 bg-gradient-to-br from-chart-3/5 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-chart-3">
                {foundItems.filter(i => !i.claimed).length + foundPersons.filter(p => !p.reunited).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting match</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="items" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Found Items
            </TabsTrigger>
            <TabsTrigger value="persons" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Found Persons
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className="mt-6 mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, location, or description..." 
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
                <SelectItem value="matched">Claimed/Reunited</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="personal">Personal Items</SelectItem>
                <SelectItem value="jewelry">Jewelry</SelectItem>
                <SelectItem value="keys">Keys</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="items" className="space-y-4">
            {foundItems.map((item) => (
              <Card key={item.id} className="border-border bg-card hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4 p-6">
                    {/* Image */}
                    <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarImage src={item.image} alt={item.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                          <Package className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      {item.claimed && (
                        <div className="absolute top-2 right-2 bg-chart-2 text-white p-1.5 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-foreground">{item.name}</h3>
                            <Badge variant="outline" className="border-chart-2 text-chart-2 bg-chart-2/10">
                              Found
                            </Badge>
                            {item.claimed && (
                              <Badge className="bg-chart-2 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Claimed
                              </Badge>
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{item.description}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{new Date(item.date).toLocaleDateString()} at {item.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>Found by: {item.finder}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{item.contact}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant={item.claimed ? "outline" : "default"}
                          className="flex-1 sm:flex-none"
                        >
                          {item.claimed ? "View Details" : "Match with Owner"}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="persons" className="space-y-4">
            {foundPersons.map((person) => (
              <Card key={person.id} className="border-l-4 border-l-primary bg-card hover:border-l-chart-2 transition-all duration-300 overflow-hidden group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row gap-4 p-6">
                    {/* Image */}
                    <div className="relative w-full md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <Avatar className="w-full h-full rounded-lg">
                        <AvatarImage src={person.image} alt={person.name} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-2xl">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {person.reunited && (
                        <div className="absolute top-2 right-2 bg-chart-2 text-white p-1.5 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-xl font-bold text-foreground">{person.name}</h3>
                            <Badge variant="outline" className="border-primary text-primary bg-primary/10">
                              Found Person
                            </Badge>
                            {person.reunited && (
                              <Badge className="bg-chart-2 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Reunited
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {person.age}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {person.gender}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{person.description}</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="truncate">{person.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{new Date(person.date).toLocaleDateString()} at {person.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>Found by: {person.finder}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>Finder: {person.contact}</span>
                        </div>
                      </div>

                      {person.familyContact !== "Not available" && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                          <p className="text-sm font-medium text-foreground flex items-center gap-2">
                            <Phone className="h-4 w-4 text-primary" />
                            Family Contact: {person.familyContact}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button 
                          className={person.reunited ? "bg-chart-2 hover:bg-chart-2/90" : ""}
                          variant={person.reunited ? "default" : "default"}
                        >
                          {person.reunited ? "View Reunion Details" : "Initiate Contact"}
                        </Button>
                        <Button variant="outline" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
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

export default Found;
