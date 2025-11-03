import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { acceptAdminInvite } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function AcceptAdmin() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Missing invitation token");
    }
  }, [token]);

  const onAccept = async () => {
    if (!token) return;
    setLoading(true);
    try {
      await acceptAdminInvite({ token, name: name || undefined, password: password || undefined });
      toast.success("Invitation accepted. Welcome!");
      await checkAuth();
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Failed to accept invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-sm shadow-card">
        <CardHeader>
          <CardTitle>Accept Admin Invitation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token && (
            <p className="text-sm text-destructive">No token provided. Please use the link from your email.</p>
          )}
          <div className="space-y-2">
            <Label>Full Name (optional)</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
          <div className="space-y-2">
            <Label>Password (optional)</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set a password" />
            <p className="text-xs text-muted-foreground">Name and password are only required if you're creating a new account.</p>
          </div>
          <Button className="w-full" onClick={onAccept} disabled={!token || loading}>
            {loading ? "Accepting..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
