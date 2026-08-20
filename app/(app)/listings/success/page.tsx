'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, Home, MessageCircle, Copy, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { propertyService } from '@/services/property.service';
import { shareService } from '@/services/share.service';
import { WhatsAppButton } from '@/components/sharing/whatsapp-button';
import type { Property } from '@/lib/types';
import { toast } from 'sonner';

export default function ListingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    propertyService
      .getProperty(id)
      .then((p) => setProperty(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleCopyLink = () => {
    if (!property) return;
    const url = shareService.createShareUrl(property.slug);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg py-12 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <CheckCircle2 className="h-10 w-10 text-success" />
      </div>
      <h1 className="font-display text-3xl font-bold text-foreground">
        Your property is live!
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {property
          ? `"${property.title}" is now published and ready to share with buyers.`
          : 'Your listing has been published and is ready to share with buyers.'}
      </p>

      <div className="mt-8 space-y-3">
        {property && (
          <Button asChild className="w-full gap-2">
            <Link href={`/property/${property.slug}`}>
              <Eye className="h-4 w-4" /> View Property
            </Link>
          </Button>
        )}
        {property && (
          <WhatsAppButton property={property} className="w-full" label="Share on WhatsApp" />
        )}
        <Button variant="outline" className="w-full gap-2" onClick={handleCopyLink}>
          <Copy className="h-4 w-4" /> Copy Link
        </Button>
        <Button variant="ghost" className="w-full gap-2" onClick={() => router.push('/dashboard')}>
          <Home className="h-4 w-4" /> Go to Dashboard
        </Button>
      </div>
    </div>
  );
}
