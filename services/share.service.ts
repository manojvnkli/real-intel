import type { Property, Profile } from '@/lib/types';

export interface ShareService {
  createWhatsAppMessage(property: Property, broker?: Profile | null): string;
  createWhatsAppUrl(message: string, phoneNumber?: string): string;
  createShareUrl(slug: string): string;
}

export class MockShareService implements ShareService {
  createWhatsAppMessage(property: Property, broker?: Profile | null): string {
    const priceStr = property.pricing.price >= 10000000
      ? `₹${(property.pricing.price / 10000000).toFixed(2)} Crores`
      : `₹${(property.pricing.price / 100000).toFixed(0)} Lakhs`;

    const areaStr = property.specifications.carpetArea
      ? `${property.specifications.carpetArea.toLocaleString()} Sq.Ft.`
      : '';

    const facingStr = property.specifications.facing
      ? `${property.specifications.facing} Facing`
      : '';

    const parkingStr = property.specifications.parking
      ? `${property.specifications.parking} Car Parking`
      : '';

    const locStr = `${property.location.area}, ${property.location.city}`;

    let msg = `${property.title}\n\n`;
    msg += `${priceStr}\n`;
    if (areaStr) msg += `📐 ${areaStr}\n`;
    if (facingStr) msg += `🧭 ${facingStr}\n`;
    if (parkingStr) msg += `🚗 ${parkingStr}\n`;
    msg += `\n📍 ${locStr}\n`;
    msg += `\nView Property:\n${this.createShareUrl(property.slug)}`;

    if (broker) {
      msg += `\n\nContact: ${broker.fullName}`;
      if (broker.phone) msg += ` | ${broker.phone}`;
    }

    return msg;
  }

  createWhatsAppUrl(message: string, phoneNumber?: string): string {
    const encoded = encodeURIComponent(message);
    if (phoneNumber) {
      const clean = phoneNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${clean}?text=${encoded}`;
    }
    return `https://wa.me/?text=${encoded}`;
  }

  createShareUrl(slug: string): string {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://estatehub.in';
    return `${base}/property/${slug}`;
  }
}

export const shareService: ShareService = new MockShareService();
