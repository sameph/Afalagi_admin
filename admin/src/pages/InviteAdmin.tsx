import { DashboardLayout } from "@/components/DashboardLayout";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MailPlus, Send, UserPlus, Clock3, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type InviteStatus = "Pending" | "Sent" | "Accepted" | "Expired";
type InviteRow = {
  id: string;
  email: string;
  message: string;
  sentAt: string; // ISO date
  status: InviteStatus;
};

const STORAGE_KEY = "afalagi_admin_invites";

function StatusBadge({ status }: { status: "Pending" | "Sent" | "Accepted" | "Expired" }) {
  if (status === "Accepted") return <Badge className="bg-green-600 hover:bg-green-600/90">Accepted</Badge>;
  if (status === "Sent") return <Badge className="bg-blue-600 hover:bg-blue-600/90">Sent</Badge>;
  if (status === "Pending") return <Badge variant="secondary" className="text-foreground">Pending</Badge>;
  return <Badge variant="destructive">Expired</Badge>;
}

export default function InviteAdmin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invites, setInvites] = useState<InviteRow[]>([]);

  // Load/save from localStorage to help track status without a backend
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setInvites(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
    } catch {}
  }, [invites]);

  const onSend = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return toast.error("Email is required");
    const isValid = /.+@.+\..+/.test(trimmedEmail);
    if (!isValid) return toast.error("Please enter a valid email");
    const now = new Date().toISOString();
    const newInvite: InviteRow = {
      id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      email: trimmedEmail,
      message: message.trim(),
      sentAt: now,
      status: "Pending",
    };
    setInvites((prev) => [newInvite, ...prev]);
    setEmail("");
    setMessage("");
    toast.success("Invitation created (UI only)");
  };

  const handleResend = (id: string) => {
    setInvites((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Sent", sentAt: new Date().toISOString() } : inv))
    );
    toast.success("Invitation resent (UI only)");
  };

  const handleCancel = (id: string) => {
    setInvites((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "Expired" } : inv)));
    toast.message("Invitation canceled (UI only)");
  };

  const handleMarkAccepted = (id: string) => {
    setInvites((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "Accepted" } : inv)));
    toast.success("Marked as accepted (UI only)");
  };

  const rowsAll = invites;
  const rowsPending = useMemo(() => invites.filter((r) => r.status === "Pending"), [invites]);
  const rowsSent = useMemo(() => invites.filter((r) => r.status === "Sent"), [invites]);
  const rowsAccepted = useMemo(() => invites.filter((r) => r.status === "Accepted"), [invites]);
  const rowsExpired = useMemo(() => invites.filter((r) => r.status === "Expired"), [invites]);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Invite Admin</h1>
              <p className="text-muted-foreground">Send admin invitations and track their status</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Invite form */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MailPlus className="h-5 w-5" />
              <CardTitle>New Invitation</CardTitle>
            </div>
            <CardDescription>Enter the admin's email and an optional message</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="message">Invitation Message</Label>
                <Textarea id="message" placeholder="Write a short invitation message..." rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button type="button" onClick={onSend}>
                <Send className="mr-2 h-4 w-4" />
                Send Invitation
              </Button>
              <Button variant="outline" disabled>
                <UserPlus className="mr-2 h-4 w-4" />
                Bulk Invite
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status list */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5" />
              <CardTitle>Invitation Status</CardTitle>
            </div>
            <CardDescription>Monitor pending, sent, accepted, and expired invites</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="accepted">Accepted</TabsTrigger>
                <TabsTrigger value="expired">Expired</TabsTrigger>
              </TabsList>

              {/* All */}
              <TabsContent value="all">
                <InvitesTable rows={rowsAll} onResend={handleResend} onCancel={handleCancel} onMarkAccepted={handleMarkAccepted} />
              </TabsContent>
              {/* Pending */}
              <TabsContent value="pending">
                <InvitesTable rows={rowsPending} onResend={handleResend} onCancel={handleCancel} onMarkAccepted={handleMarkAccepted} />
              </TabsContent>
              {/* Sent */}
              <TabsContent value="sent">
                <InvitesTable rows={rowsSent} onResend={handleResend} onCancel={handleCancel} onMarkAccepted={handleMarkAccepted} />
              </TabsContent>
              {/* Accepted */}
              <TabsContent value="accepted">
                <InvitesTable rows={rowsAccepted} onResend={handleResend} onCancel={handleCancel} onMarkAccepted={handleMarkAccepted} />
              </TabsContent>
              {/* Expired */}
              <TabsContent value="expired">
                <InvitesTable rows={rowsExpired} onResend={handleResend} onCancel={handleCancel} onMarkAccepted={handleMarkAccepted} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function InvitesTable({ rows, onResend, onCancel, onMarkAccepted }: { rows: InviteRow[]; onResend: (id: string) => void; onCancel: (id: string) => void; onMarkAccepted: (id: string) => void; }) {
  return (
    <div className="rounded-md border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="hidden md:table-cell">Message</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.email}</TableCell>
              <TableCell className="hidden md:table-cell max-w-[320px] truncate text-muted-foreground">{row.message}</TableCell>
              <TableCell>{new Date(row.sentAt).toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <StatusBadge status={row.status} />
                  {row.status === "Accepted" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                  {row.status === "Sent" && <Send className="h-4 w-4 text-blue-600" />}
                  {row.status === "Pending" && <Clock3 className="h-4 w-4 text-muted-foreground" />}
                  {row.status === "Expired" && <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button type="button" variant="outline" size="sm" onClick={() => onResend(row.id)} disabled={row.status === "Accepted"}>Resend</Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => onMarkAccepted(row.id)} disabled={row.status === "Accepted" || row.status === "Expired"}>Mark Accepted</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => onCancel(row.id)} disabled={row.status === "Accepted" || row.status === "Expired"}>Cancel</Button>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No invitations to display.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

