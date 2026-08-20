'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Search, Building2, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PropertyCard } from '@/components/listings/property-card';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ListingTableSkeleton } from '@/components/shared/loading-skeletons';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { propertyService } from '@/services/property.service';
import type { Property, PropertyStatus, PropertyType } from '@/lib/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/format';

const statusFilters: (PropertyStatus | 'All')[] = [
  'All',
  'Active',
  'Draft',
  'Sold',
  'Rented',
  'Archived',
];

const propertyTypes: PropertyType[] = [
  'Apartment',
  'Villa',
  'Independent House',
  'Plot',
  'Farm Land',
  'Commercial',
  'Office',
  'Shop',
  'Warehouse',
  'Other',
];

export default function ListingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [view, setView] = React.useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = React.useState<PropertyStatus | 'All'>('All');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [search, setSearch] = React.useState(searchParams.get('q') ?? '');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [archiveId, setArchiveId] = React.useState<string | null>(null);

  React.useEffect(() => {
    propertyService
      .getProperties()
      .then((props) => setProperties(props))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = properties.filter((p) => {
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (typeFilter !== 'all' && p.propertyType !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.area.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleShare = (property: Property) => {
    const url = `${window.location.origin}/property/${property.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleDuplicate = async (id: string) => {
    await propertyService.duplicateProperty(id);
    toast.success('Listing duplicated');
    const props = await propertyService.getProperties();
    setProperties(props);
  };

  const handleArchive = async () => {
    if (!archiveId) return;
    await propertyService.archiveProperty(archiveId);
    toast.success('Listing archived');
    setArchiveId(null);
    const props = await propertyService.getProperties();
    setProperties(props);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await propertyService.deleteProperty(deleteId);
    toast.success('Listing deleted');
    setDeleteId(null);
    const props = await propertyService.getProperties();
    setProperties(props);
  };

  if (loading) return <ListingTableSkeleton />;
  if (error) return <ErrorState onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} total
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/listings/create">
            <Plus className="h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(s)}
            >
              {s}
            </Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {propertyTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border border-border">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setView('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'table' ? 'default' : 'ghost'}
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() => setView('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" />}
          title="No listings yet"
          description="Create your first property listing and start sharing it with buyers."
          action={
            <Button asChild className="gap-2">
              <Link href="/listings/create">
                <Plus className="h-4 w-4" />
                Create Listing
              </Link>
            </Button>
          }
        />
      ) : view === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              onShare={handleShare}
              onDuplicate={handleDuplicate}
              onArchive={(id) => setArchiveId(id)}
              onDelete={(id) => setDeleteId(id)}
            />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Enquiries</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="cursor-pointer" onClick={() => router.push(`/listings/${p.id}`)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={(p.images.find((i) => i.isCover) ?? p.images[0])?.url}
                        alt={p.title}
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span className="font-medium text-foreground">{p.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.location.area}, {p.location.city}</TableCell>
                  <TableCell className="font-medium">{formatPrice(p.pricing.price, p.purpose ? p.purpose : undefined)}</TableCell>
                  <TableCell className="text-muted-foreground">{p.propertyType}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(p.status)} variant="outline">
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center text-muted-foreground">{p.analytics.views}</TableCell>
                  <TableCell className="text-center text-muted-foreground">{p.analytics.enquiries}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(p.updatedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete listing?"
        description="This action cannot be undone. The listing will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={!!archiveId}
        onOpenChange={(o) => !o && setArchiveId(null)}
        title="Archive listing?"
        description="The listing will be moved to archived status and won't appear in your active listings."
        confirmLabel="Archive"
        onConfirm={handleArchive}
      />
    </div>
  );
}
