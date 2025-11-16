import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Items from "./pages/Items";
import Lost from "./pages/Lost";
import Found from "./pages/Found";
import Matches from "./pages/Matches";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import Activity from "./pages/Activity";
import Reports from "./pages/Reports";
import Performance from "./pages/Performance";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import AcceptAdmin from "./pages/AcceptAdmin";
import InviteAdmin from "./pages/InviteAdmin";
import NotFound from "./pages/NotFound";
// Protected route component using AuthContext
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

// Guest-only route (e.g., login)
const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } />
          <Route path="/items" element={
            <ProtectedRoute>
              <Items />
            </ProtectedRoute>
          } />
          <Route path="/lost" element={
            <ProtectedRoute>
              <Lost />
            </ProtectedRoute>
          } />
          <Route path="/found" element={
            <ProtectedRoute>
              <Found />
            </ProtectedRoute>
          } />
          <Route path="/matches" element={
            <ProtectedRoute>
              <Matches />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/activity" element={
            <ProtectedRoute>
              <Activity />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/performance" element={
            <ProtectedRoute>
              <Performance />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/login" element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } />
          <Route path="/invite-admin" element={
            <ProtectedRoute>
              <InviteAdmin />
            </ProtectedRoute>
          } />
          {/* Public route to accept admin invitations */}
          <Route path="/accept-admin" element={<AcceptAdmin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
