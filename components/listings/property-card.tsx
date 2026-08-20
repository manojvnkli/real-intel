'use client';

import Link from 'next/link';
import { MoreVertical, Eye, Share2, Copy, Archive, Trash2, Pencil } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Property } from '@/lib/types';
import { formatPrice, formatDate, getStatusColor } from '@/lib/format';
import { shareService } from '@/services/share.service';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  onEdit?: (id: string) => void;
  onShare?: (property: Property) => void;
  onDuplicate?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function PropertyCard({
  property,
  onEdit,
  onShare,
  onDuplicate,
  onArchive,
  onDelete,
}: PropertyCardProps) {
  const coverImage = property.images.find((img) => img.isCover) ?? property.images[0];

  const handleCopyLink = () => {
    const url = shareService.createShareUrl(property.slug);
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.url}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge className={getStatusColor(property.status)} variant="outline">
            {property.status}
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 backdrop-blur">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/listings/${property.id}`}>
                  <Eye className="mr-2 h-4 w-4" /> View
                </Link>
              </DropdownMenuItem>
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(property.id)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              )}
              {onShare && (
                <DropdownMenuItem onClick={() => onShare(property)}>
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" /> Copy Link
              </DropdownMenuItem>
              {onDuplicate && (
                <DropdownMenuItem onClick={() => onDuplicate(property.id)}>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(property.id)}>
                  <Archive className="mr-2 h-4 w-4" /> Archive
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(property.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <CardContent className="p-4">
        <Link href={`/listings/${property.id}`} className="block">
          <h3 className="truncate font-display text-base font-semibold text-foreground hover:text-primary">
            {property.title}
          </h3>
        </Link>
        <p className="mt-1 truncate text-sm text-muted-foreground">
          {property.location.area}, {property.location.city}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">
            {formatPrice(property.pricing.price, property.purpose ? property.purpose : undefined)}
          </span>
          <span className="text-xs text-muted-foreground">{property.propertyType}</span>
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {property.analytics.views}
          </span>
          <span className="flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" /> {property.analytics.enquiries}
          </span>
          <span className="ml-auto">{formatDate(property.updatedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
