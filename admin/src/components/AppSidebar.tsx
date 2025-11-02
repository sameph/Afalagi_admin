import { 
  LayoutDashboard, 
  Users, 
  PackageSearch, 
  Settings, 
  Activity,
  PackageX,
  PackageCheck,
  GitMerge,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  UserCircle,
  Settings as SettingsIcon
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "All Items", url: "/items", icon: PackageSearch },
  { title: "Lost Reports", url: "/lost", icon: PackageX },
  { title: "Found Reports", url: "/found", icon: PackageCheck },
  { title: "Matches", url: "/matches", icon: GitMerge },
  { title: "Users", url: "/users", icon: Users },
  { title: "Activity", url: "/activity", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === "collapsed";

  const getNavClass = (isActive: boolean) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-primary font-medium"
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out.",
    });
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border flex flex-col">
      <SidebarHeader className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-sm font-semibold text-foreground">Afalagi Admin</h2>
              <p className="text-xs text-muted-foreground">Lost & Found Platform</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) => getNavClass(isActive)}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-border">
        <DropdownMenu onOpenChange={setIsUserMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between h-auto p-2 rounded-lg hover:bg-accent">
              <div className="flex items-center gap-2">
                <UserCircle className="h-8 w-8 text-muted-foreground" />
                {!isCollapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.role || 'Administrator'}</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (isUserMenuOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 ml-2 mb-2" align="start" side="top">
            <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
