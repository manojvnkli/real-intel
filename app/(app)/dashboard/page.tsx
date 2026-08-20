'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Plus,
  Building2,
  Eye,
  MessageSquare,
  CalendarCheck,
  FileEdit,
  Share2,
  FolderPlus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/stat-card';
import { PropertyCard } from '@/components/listings/property-card';
import { DashboardSkeleton } from '@/components/shared/loading-skeletons';
import { ErrorState } from '@/components/shared/error-state';
import { useAuth } from '@/components/providers/auth-provider';
import { analyticsService } from '@/services/analytics.service';
import { propertyService } from '@/services/property.service';
import { profileService } from '@/services/profile.service';
import type { DashboardStats, PerformancePoint, Property, Profile } from '@/lib/types';
import { getGreeting } from '@/lib/format';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [performance, setPerformance] = React.useState<PerformancePoint[]>([]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      analyticsService.getDashboardStats(),
      analyticsService.getPerformanceData(),
      propertyService.getProperties(),
      profileService.getProfile(),
    ])
      .then(([s, p, props, prof]) => {
        setStats(s);
        setPerformance(p);
        setProperties(props.slice(0, 4));
        setProfile(prof);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleShare = (property: Property) => {
    const url = `${window.location.origin}/property/${property.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleDuplicate = async (id: string) => {
    await propertyService.duplicateProperty(id);
    toast.success('Listing duplicated');
    const props = await propertyService.getProperties();
    setProperties(props.slice(0, 4));
  };

  const handleDelete = async (id: string) => {
    await propertyService.deleteProperty(id);
    toast.success('Listing deleted');
    const props = await propertyService.getProperties();
    setProperties(props.slice(0, 4));
  };

  if (loading) return <DashboardSkeleton />;
  if (error || !stats)
    return <ErrorState onRetry={() => window.location.reload()} />;

  const firstName = currentUser?.fullName?.split(' ')[0] ?? 'there';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your properties and leads.
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/listings/create">
            <Plus className="h-4 w-4" />
            Create New Listing
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Active Listings" value={stats.activeListings} icon={Building2} />
        <StatCard label="Draft Listings" value={stats.draftListings} icon={FileEdit} />
        <StatCard label="Total Views" value={stats.totalViews.toLocaleString('en-IN')} icon={Eye} trend="+12% this week" />
        <StatCard label="Leads" value={stats.leads} icon={MessageSquare} trend="+8% this week" />
        <StatCard label="Site Visits" value={stats.siteVisits} icon={CalendarCheck} />
      </div>

      {/* Recent Listings + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Listings</h2>
            <Link href="/listings" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onShare={handleShare}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Quick Actions</h2>
          <Card>
            <CardContent className="space-y-2 p-4">
              <QuickActionLink href="/listings/create" icon={Plus} label="Create Listing" />
              <QuickActionLink href="/public/manoj" icon={Eye} label="View Public Profile" />
              <QuickActionLink href="/profile" icon={Share2} label="Share Profile" />
              <QuickActionLink href="/collections" icon={FolderPlus} label="Create Collection" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Chart */}
      <div>
        <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Performance</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Listing Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performance}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorShares" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="views" name="Views" stroke="hsl(var(--chart-1))" fill="url(#colorViews)" strokeWidth={2} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="hsl(var(--chart-2))" fill="url(#colorLeads)" strokeWidth={2} />
                <Area type="monotone" dataKey="shares" name="Shares" stroke="hsl(var(--chart-3))" fill="url(#colorShares)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickActionLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Plus;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
        <Icon className="h-5 w-5" />
      </div>
      {label}
    </Link>
  );
}
