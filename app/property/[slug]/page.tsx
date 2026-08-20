'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Car,
  Compass,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  CalendarCheck,
  Check,
  Home,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ErrorState } from '@/components/shared/error-state';
import { WhatsAppButton } from '@/components/sharing/whatsapp-button';
import { propertyService } from '@/services/property.service';
import { profileService } from '@/services/profile.service';
import { shareService } from '@/services/share.service';
import type { Property, Profile } from '@/lib/types';
import { formatPrice, formatArea } from '@/lib/format';
import { toast } from 'sonner';

export default function PublicPropertyPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [property, setProperty] = React.useState<Property | null>(null);
  const [broker, setBroker] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);

  React.useEffect(() => {
    if (!slug) return;
    Promise.all([
      propertyService.getPropertyBySlug(slug),
      profileService.getProfile(),
    ])
      .then(([p, prof]) => {
        setProperty(p);
        setBroker(prof);
        const coverIdx = p.images.findIndex((i) => i.isCover);
        setSelectedImage(coverIdx >= 0 ? coverIdx : 0);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCopyLink = () => {
    if (!property) return;
    const url = shareService.createShareUrl(property.slug);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  const handleEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Enquiry sent! The broker will contact you soon.');
    (e.target as HTMLFormElement).reset();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <ErrorState title="Property not found" message="This listing may have been removed or is no longer available." onBack={() => window.history.back()} />
      </div>
    );
  }

  const coverImage = property.images[selectedImage] ?? property.images[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Estate<span className="text-primary">Hub</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {broker && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/public/${broker.publicUsername}`}>{broker.fullName}</Link>
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-1">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Gallery */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border">
          {coverImage && (
            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
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
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Title & price */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{property.propertyType}</Badge>
                <Badge variant="outline">{property.purpose}</Badge>
                {property.possession && <Badge variant="outline">{property.possession}</Badge>}
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold text-foreground">{property.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {property.location.address}, {property.location.area}, {property.location.city}, {property.location.state} - {property.location.pincode}
              </p>
              <p className="mt-4 font-display text-4xl font-bold text-primary">
                {formatPrice(property.pricing.price, property.purpose)}
              </p>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <SpecCard icon={BedDouble} label="BHK" value={property.specifications.bhk ? `${property.specifications.bhk} BHK` : '-'} />
              <SpecCard icon={Ruler} label="Area" value={property.specifications.carpetArea ? formatArea(property.specifications.carpetArea) : '-'} />
              <SpecCard icon={Compass} label="Facing" value={property.specifications.facing ?? '-'} />
              <SpecCard icon={Car} label="Parking" value={property.specifications.parking ? `${property.specifications.parking} Cars` : '-'} />
            </div>

            {/* Highlights */}
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Highlights</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {property.possession && <HighlightItem text={property.possession} />}
                {property.specifications.parking && <HighlightItem text={`${property.specifications.parking} Car Parking`} />}
                {property.amenities.includes('Gated Community') && <HighlightItem text="Gated Community" />}
                {property.specifications.furnishing && property.specifications.furnishing !== 'Unfurnished' && <HighlightItem text={property.specifications.furnishing} />}
                {property.specifications.balconies && <HighlightItem text={`${property.specifications.balconies} Balconies`} />}
                {property.pricing.negotiable && <HighlightItem text="Price Negotiable" />}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Overview</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((a) => (
                    <Badge key={a} variant="secondary" className="gap-1">
                      <Check className="h-3 w-3" /> {a}
                    </Badge>
                  ))}
                  {property.customAmenities.map((a) => (
                    <Badge key={a} variant="outline" className="gap-1">
                      <Check className="h-3 w-3" /> {a}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-foreground">Location</h2>
              <div className="rounded-lg border border-dashed border-border bg-secondary/30 p-6 text-center">
                <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{property.location.area}, {property.location.city}</p>
                <p className="text-xs text-muted-foreground">{property.location.address}</p>
                {property.location.landmark && <p className="mt-1 text-xs text-muted-foreground">Landmark: {property.location.landmark}</p>}
              </div>
            </div>

            {/* Broker info */}
            {broker && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Broker Information</h2>
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
                      <Building2 className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-lg font-bold text-foreground">{broker.fullName}</p>
                      <p className="text-sm text-muted-foreground">{broker.agencyName}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{broker.bio}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/public/${broker.publicUsername}`}>View Profile</Link>
                        </Button>
                        {broker.phone && (
                          <Button asChild variant="outline" size="sm" className="gap-1">
                            <a href={`tel:${broker.phone}`}><Phone className="h-4 w-4" /> Call</a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar: Enquiry form */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Interested? Enquire now</h3>
                  <form onSubmit={handleEnquiry} className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+91 98765 43210" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="I'm interested in this property..." className="min-h-[80px]" />
                    </div>
                    <Button type="submit" className="w-full">Send Enquiry</Button>
                  </form>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <WhatsAppButton property={property} broker={broker} className="w-full" />
                    {broker?.phone && (
                      <Button asChild variant="outline" className="w-full gap-2">
                        <a href={`tel:${broker.phone}`}><Phone className="h-4 w-4" /> Call Broker</a>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full gap-2" onClick={() => toast.success('Site visit request sent!')}>
                      <CalendarCheck className="h-4 w-4" /> Schedule Site Visit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex gap-2 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
        <WhatsAppButton property={property} broker={broker} className="flex-1" size="sm" />
        {broker?.phone && (
          <Button asChild variant="outline" size="sm" className="flex-1 gap-1">
            <a href={`tel:${broker.phone}`}><Phone className="h-4 w-4" /> Call</a>
          </Button>
        )}
        <Button size="sm" className="flex-1 gap-1" onClick={() => toast.success('Site visit requested!')}>
          <CalendarCheck className="h-4 w-4" /> Visit
        </Button>
      </div>
    </div>
  );
}

function SpecCard({ icon: Icon, label, value }: { icon: typeof BedDouble; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 text-center">
      <Icon className="mx-auto mb-1 h-5 w-5 text-primary" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function HighlightItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-foreground">
      <Check className="h-4 w-4 text-success" /> {text}
    </div>
  );
}
