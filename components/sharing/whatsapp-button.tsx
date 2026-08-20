'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shareService } from '@/services/share.service';
import type { Property, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  property: Property;
  broker?: Profile | null;
  phoneNumber?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  label?: string;
}

export function WhatsAppButton({
  property,
  broker,
  phoneNumber,
  variant = 'default',
  size = 'default',
  className,
  label = 'WhatsApp',
}: WhatsAppButtonProps) {
  const handleClick = () => {
    const message = shareService.createWhatsAppMessage(property, broker);
    const url = shareService.createWhatsAppUrl(message, phoneNumber);
    window.open(url, '_blank');
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn('gap-2 bg-[#25D366] text-white hover:bg-[#1da851]', variant === 'outline' && 'border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10', className)}
    >
      <MessageCircle className="h-4 w-4" />
      {label}
    </Button>
  );
}
