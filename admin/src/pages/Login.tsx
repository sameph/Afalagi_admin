import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Visual / Branding Side (Left Graphic) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-primary p-12 overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] animate-float pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/20 rounded-full blur-[100px] animate-float pointer-events-none" style={{ animationDelay: "2s" }} />
        
        <div className="relative z-10 w-full max-w-lg space-y-8 text-primary-foreground">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg ring-1 ring-white/30">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Afalagi</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-5xl font-extrabold tracking-tight leading-[1.15]">
              Reuniting people with what matters.
            </h2>
            <p className="text-lg text-primary-foreground/90 font-medium">
              Manage the lost and found ecosystem securely and efficiently with our powerful administrative platform.
            </p>
          </div>
          
          <div className="pt-10 mt-10 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-black/20 flex justify-center items-center text-xs font-bold backdrop-blur-md ring-1 ring-white/20">AU</div>
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 flex justify-center items-center text-xs font-bold backdrop-blur-md text-primary ring-1 ring-white/20">SU</div>
                <div className="w-10 h-10 rounded-full border-2 border-primary bg-accent/20 flex justify-center items-center text-xs font-bold backdrop-blur-md ring-1 ring-white/20">+</div>
              </div>
              <p className="text-sm font-medium text-white/90">Trusted by dedicated administration teams.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Side (Right Auth) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
        {/* Subtle background effects for mobile */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 lg:hidden" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float pointer-events-none lg:hidden" />
        
        <div className="w-full max-w-[400px] relative z-10 flex flex-col justify-center min-h-[500px]">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group self-start mb-12">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <div className="mb-10 text-left">
            <h1 className="text-3xl font-bold tracking-tight mb-3">Welcome Back</h1>
            <p className="text-muted-foreground">Please sign in to your administrator account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline hover:text-primary/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-colors shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-glow hover:-translate-y-0.5 transition-all mt-4" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In to Dashboard"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 mt-12 pb-4">
            <Lock className="w-3.5 h-3.5" /> Secure & encrypted connection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
