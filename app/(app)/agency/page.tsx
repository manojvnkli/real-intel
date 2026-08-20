'use client';

import * as React from 'react';
import { Plus, Trash2, Briefcase, Mail, Phone, Globe, MapPin, UserPlus, Crown } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { agencyService } from '@/services/agency.service';
import type { Agency, AgencyRole, CreateAgencyInput } from '@/lib/types';

const roleColors: Record<AgencyRole, string> = {
  Owner: 'bg-primary/10 text-primary border-primary/20',
  Admin: 'bg-accent/10 text-accent-foreground border-accent/20',
  Agent: 'bg-success/10 text-success border-success/20',
  Viewer: 'bg-muted text-muted-foreground border-border',
};

export default function AgencyPage() {
  const [agency, setAgency] = React.useState<Agency | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteRole, setInviteRole] = React.useState<AgencyRole>('Agent');
  const [removeMemberId, setRemoveMemberId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<CreateAgencyInput>({
    name: '', description: '', phone: '', email: '', website: '', city: '',
  });

  const loadAgency = React.useCallback(async () => {
    try {
      const a = await agencyService.getAgency();
      setAgency(a);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAgency();
  }, [loadAgency]);

  const handleCreate = async () => {
    if (!formData.name.trim()) return;
    const created = await agencyService.createAgency(formData);
    setAgency(created);
    toast.success('Agency created');
    setShowCreate(false);
  };

  const handleInvite = async () => {
    if (!agency || !inviteEmail.trim()) return;
    await agencyService.inviteMember(agency.id, inviteEmail, inviteRole);
    toast.success(`Invitation sent to ${inviteEmail}`);
    setInviteOpen(false);
    setInviteEmail('');
    setInviteRole('Agent');
    loadAgency();
  };

  const handleRemoveMember = async () => {
    if (!agency || !removeMemberId) return;
    await agencyService.removeMember(agency.id, removeMemberId);
    toast.success('Member removed');
    setRemoveMemberId(null);
    loadAgency();
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <ErrorState onRetry={loadAgency} />;

  if (!agency) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Agency</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your agency and team</p>
        </div>
        <EmptyState
          icon={<Briefcase className="h-8 w-8" />}
          title="No agency yet"
          description="Create an agency to manage your team and collaborate on listings."
          action={
            <div className="flex gap-2">
              <Button className="gap-2" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Create Agency
              </Button>
              <Button variant="outline" onClick={() => toast.info('Join agency flow coming soon')}>
                Join Agency
              </Button>
            </div>
          }
        />
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Your Agency</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agency-name">Agency name</Label>
                <Input id="agency-name" placeholder="EstateHub Realty" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agency-desc">Description</Label>
                <Textarea id="agency-desc" placeholder="A premier real estate agency..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agency-phone">Phone</Label>
                  <Input id="agency-phone" placeholder="+91 40 1234 5678" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency-email">Email</Label>
                  <Input id="agency-email" type="email" placeholder="contact@agency.in" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="agency-website">Website</Label>
                  <Input id="agency-website" placeholder="agency.in" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agency-city">City</Label>
                  <Input id="agency-city" placeholder="Hyderabad" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Agency</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Agency</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your agency and team</p>
      </div>

      {/* Agency info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Briefcase className="h-5 w-5 text-primary" /> {agency.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">{agency.description}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoItem icon={Phone} label="Phone" value={agency.phone} />
            <InfoItem icon={Mail} label="Email" value={agency.email} />
            <InfoItem icon={Globe} label="Website" value={agency.website} />
            <InfoItem icon={MapPin} label="City" value={agency.city} />
          </div>
        </CardContent>
      </Card>

      {/* Team management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Team Members ({agency.members.length})</CardTitle>
          <Button size="sm" className="gap-1" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-4 w-4" /> Invite Member
          </Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {agency.members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-primary">
                  {m.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{m.fullName}</p>
                  {m.role === 'Owner' && <Crown className="h-3.5 w-3.5 text-accent" />}
                </div>
                <p className="truncate text-xs text-muted-foreground">{m.email}</p>
              </div>
              <Badge className={roleColors[m.role]} variant="outline">{m.role}</Badge>
              {m.role !== 'Owner' && (
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setRemoveMemberId(m.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email address</Label>
              <Input id="invite-email" type="email" placeholder="colleague@agency.in" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as AgencyRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!removeMemberId}
        onOpenChange={(o) => !o && setRemoveMemberId(null)}
        title="Remove member?"
        description="This member will lose access to the agency and its listings."
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemoveMember}
      />
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value || '-'}</p>
      </div>
    </div>
  );
}
