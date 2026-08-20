'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({
  className,
  showText = true,
  size = 'default',
}: {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'default' | 'lg';
}) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <Link href="/dashboard" className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex items-center justify-center rounded-lg bg-primary text-primary-foreground', iconSize)}>
        <Building2 className={cn(size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5')} />
      </div>
      {showText && (
        <span className={cn('font-display font-bold tracking-tight text-foreground', textSize)}>
          Estate<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}

export function BrandLogoStatic({ className, showText = true }: { className?: string; showText?: boolean }) {
  const pathname = usePathname();
  const isPublic = pathname?.startsWith('/property/') || pathname?.startsWith('/public/') || pathname?.startsWith('/collection/');
  const href = isPublic ? '/' : '/dashboard';

  return (
    <Link href={href} className={cn('flex items-center gap-2', className)}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Building2 className="h-5 w-5" />
      </div>
      {showText && (
        <span className="font-display text-lg font-bold tracking-tight text-foreground">
          Estate<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}
