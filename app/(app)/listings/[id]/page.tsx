'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  Share2,
  Copy,
  Archive,
  Trash2,
  Pencil,
  ExternalLink,
  Building2,
  MapPin,
  IndianRupee,
  Ruler,
  BedDouble,
  Bath,
  Car,
  Calendar,
  TrendingUp,
  MessageSquare,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { WhatsAppButton } from '@/components/sharing/whatsapp-button';
import { propertyService } from '@/services/property.service';
import { shareService } from '@/services/share.service';
import type { Property } from '@/lib/types';
import { formatPrice, formatArea, formatDate, getStatusColor } from '@/lib/format';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [showDelete, setShowDelete] = React.useState(false);
  const [showArchive, setShowArchive] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    propertyService
      .getProperty(id)
      .then((p) => {
        setProperty(p);
        const coverIdx = p.images.findIndex((i) => i.isCover);
        setSelectedImage(coverIdx >= 0 ? coverIdx : 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    if (!property) return;
    const url = shareService.createShareUrl(property.slug);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleDuplicate = async () => {
    if (!property) return;
    await propertyService.duplicateProperty(property.id);
    toast.success('Listing duplicated');
    router.push('/listings');
  };

  const handleArchive = async () => {
    if (!property) return;
    await propertyService.archiveProperty(property.id);
    toast.success('Listing archived');
    setShowArchive(false);
    router.push('/listings');
  };

  const handleDelete = async () => {
    if (!property) return;
    await propertyService.deleteProperty(property.id);
    toast.success('Listing deleted');
    setShowDelete(false);
    router.push('/listings');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !property) {
    return <ErrorState title="Property not found" message="This listing may have been deleted." onBack={() => router.push('/listings')} />;
  }

  const coverImage = property.images[selectedImage] ?? property.images[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/listings')} className="mb-2 gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Listings
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground">{property.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Badge className={getStatusColor(property.status)} variant="outline">{property.status}</Badge>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" /> {property.location.area}, {property.location.city}
            </span>
            <span className="text-sm text-muted-foreground">Updated {formatDate(property.updatedAt)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm" className="gap-1">
            <Link href={`/property/${property.slug}`}><ExternalLink className="h-4 w-4" /> View Public Page</Link>
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleCopyLink}>
            <Share2 className="h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={handleDuplicate}>
            <Copy className="h-4 w-4" /> Duplicate
          </Button>
          <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowArchive(true)}>
            <Archive className="h-4 w-4" /> Archive
          </Button>
          <Button variant="destructive" size="sm" className="gap-1" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <Card>
        <CardContent className="p-0">
          {coverImage && (
            <div className="aspect-video overflow-hidden rounded-t-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage.url} alt={property.title} className="h-full w-full object-cover" />
            </div>
          )}
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3 scrollbar-thin">
              {property.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                    idx === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Price & Key Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <p className="text-xs text-muted-foreground">Price</p>
                  <p className="font-display text-3xl font-bold text-primary">
                    {formatPrice(property.pricing.price, property.purpose)}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden h-12 sm:block" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <KeyInfo icon={BedDouble} label="BHK" value={property.specifications.bhk ? `${property.specifications.bhk} BHK` : '-'} />
                  <KeyInfo icon={Ruler} label="Area" value={property.specifications.carpetArea ? formatArea(property.specifications.carpetArea) : '-'} />
                  <KeyInfo icon={Building2} label="Type" value={property.propertyType} />
                  <KeyInfo icon={Calendar} label="Possession" value={property.possession ?? '-'} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader><CardTitle className="text-base">Specifications</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Spec label="BHK" value={property.specifications.bhk} />
                <Spec label="Bathrooms" value={property.specifications.bathrooms} />
                <Spec label="Balconies" value={property.specifications.balconies} />
                <Spec label="Carpet Area" value={property.specifications.carpetArea ? `${property.specifications.carpetArea} sq.ft.` : undefined} />
                <Spec label="Built-up Area" value={property.specifications.builtUpArea ? `${property.specifications.builtUpArea} sq.ft.` : undefined} />
                <Spec label="Plot Area" value={property.specifications.plotArea ? `${property.specifications.plotArea} sq.ft.` : undefined} />
                <Spec label="Floor" value={property.specifications.floor} />
                <Spec label="Total Floors" value={property.specifications.totalFloors} />
                <Spec label="Facing" value={property.specifications.facing} />
                <Spec label="Age" value={property.specifications.ageOfProperty ? `${property.specifications.ageOfProperty} years` : undefined} />
                <Spec label="Furnishing" value={property.specifications.furnishing} />
                <Spec label="Parking" value={property.specifications.parking} />
              </dl>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader><CardTitle className="text-base">Amenities</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <Badge key={a} variant="secondary">{a}</Badge>
                ))}
                {property.customAmenities.map((a) => (
                  <Badge key={a} variant="outline">{a}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader><CardTitle className="text-base">Additional Information</CardTitle></CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Spec label="RERA Number" value={property.reraNumber} />
                <Spec label="Ownership" value={property.ownership} />
                <Spec label="Availability" value={property.availability} />
                <Spec label="Brokerage" value={property.brokerage} />
                <Spec label="Maintenance" value={property.pricing.maintenance ? `₹${property.pricing.maintenance}/mo` : undefined} />
                <Spec label="Negotiable" value={property.pricing.negotiable ? 'Yes' : 'No'} />
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analytics + Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Analytics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <AnalyticsRow icon={Eye} label="Views" value={property.analytics.views} />
              <AnalyticsRow icon={Share2} label="Shares" value={property.analytics.shares} />
              <AnalyticsRow icon={MessageSquare} label="Enquiries" value={property.analytics.enquiries} />
              <AnalyticsRow icon={Users} label="Site Visits" value={property.analytics.siteVisits} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start gap-2">
                <Link href={`/property/${property.slug}`}><ExternalLink className="h-4 w-4" /> View Public Page</Link>
              </Button>
              <WhatsAppButton property={property} variant="outline" className="w-full justify-start" />
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" /> Copy Link
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={handleDuplicate}>
                <Copy className="h-4 w-4" /> Duplicate Listing
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete listing?"
        description="This action cannot be undone. The listing will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={showArchive}
        onOpenChange={setShowArchive}
        title="Archive listing?"
        description="The listing will be moved to archived status and won't appear in active listings."
        confirmLabel="Archive"
        onConfirm={handleArchive}
      />
    </div>
  );
}

function KeyInfo({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string | number | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value || '-'}</dd>
    </div>
  );
}

function AnalyticsRow({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" /> {label}
      </div>
      <span className="font-display text-lg font-bold text-foreground">{value.toLocaleString('en-IN')}</span>
    </div>
  );
}
