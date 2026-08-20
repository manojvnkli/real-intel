'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Building2, Phone, MapPin, MessageCircle, Star, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ErrorState } from '@/components/shared/error-state';
import { profileService } from '@/services/profile.service';
import { propertyService } from '@/services/property.service';
import { shareService } from '@/services/share.service';
import type { Profile, Property } from '@/lib/types';
import { formatPrice } from '@/lib/format';

export default function PublicBrokerPage() {
  const params = useParams();
  const username = params.username as string;
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!username) return;
    Promise.all([
      profileService.getProfileByUsername(username),
      propertyService.getProperties(),
    ])
      .then(([prof, props]) => {
        if (!prof) {
          setError(true);
          return;
        }
        setProfile(prof);
        setProperties(props.filter((p) => p.status === 'Active'));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <ErrorState title="Broker not found" message="This broker profile doesn't exist or has been removed." onBack={() => window.history.back()} />
      </div>
    );
  }

  const handleWhatsApp = () => {
    const msg = `Hi ${profile.fullName}, I found your profile on EstateHub and I'm interested in your properties.`;
    const url = shareService.createWhatsAppUrl(msg, profile.whatsapp || profile.phone);
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">
              Estate<span className="text-primary">Hub</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            <a href="#properties" className="text-sm font-medium text-muted-foreground hover:text-foreground">Properties</a>
            <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground">About</a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground">Contact</a>
          </nav>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${profile.phone}`}><Phone className="h-4 w-4" /> Call</a>
            </Button>
            <Button size="sm" className="gap-1 bg-[#25D366] text-white hover:bg-[#1da851]" onClick={handleWhatsApp}>
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Building2 className="h-12 w-12" />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-4xl font-bold text-foreground">{profile.fullName}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{profile.agencyName}</p>
              <p className="mt-3 max-w-xl text-sm text-muted-foreground">{profile.bio}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {profile.city}</span>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {profile.experienceYears} years experience</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 text-accent" /> RERA: {profile.reraNumber}</span>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button className="gap-1 bg-[#25D366] text-white hover:bg-[#1da851]" onClick={handleWhatsApp}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
                <Button variant="outline" className="gap-1" asChild>
                  <a href={`tel:${profile.phone}`}><Phone className="h-4 w-4" /> Call</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Featured Properties</h2>
        {properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active listings at the moment.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <Link key={p.id} href={`/property/${p.slug}`}>
                <Card className="group h-full overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={(p.images.find((i) => i.isCover) ?? p.images[0])?.url}
                      alt={p.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="truncate font-display text-base font-semibold text-foreground group-hover:text-primary">{p.title}</h3>
                    <p className="mt-1 truncate text-sm text-muted-foreground">{p.location.area}, {p.location.city}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-display text-lg font-bold text-primary">{formatPrice(p.pricing.price, p.purpose)}</span>
                      <Badge variant="secondary">{p.propertyType}</Badge>
                    </div>
                    {p.specifications.bhk && (
                      <p className="mt-1 text-xs text-muted-foreground">{p.specifications.bhk} BHK</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-6 font-display text-2xl font-bold text-foreground">About</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Specialization</h3>
              <div className="flex flex-wrap gap-2">
                {profile.specialization.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-display text-lg font-semibold text-foreground">Areas Served</h3>
              <div className="flex flex-wrap gap-2">
                {profile.areasServed.map((a) => (
                  <Badge key={a} variant="outline">{a}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-foreground">Contact</h2>
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="text-sm font-medium text-foreground">{profile.whatsapp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">City</p>
                  <p className="text-sm font-medium text-foreground">{profile.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Agency</p>
                  <p className="text-sm font-medium text-foreground">{profile.agencyName}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="gap-1 bg-[#25D366] text-white hover:bg-[#1da851]" onClick={handleWhatsApp}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </Button>
              <Button variant="outline" className="gap-1" asChild>
                <a href={`tel:${profile.phone}`}><Phone className="h-4 w-4" /> Call</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile.fullName} — Powered by EstateHub
        </div>
      </footer>
    </div>
  );
}
