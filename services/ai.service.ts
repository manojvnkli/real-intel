import type {
  AIListingPreview,
  PropertyType,
  ListingPurpose,
  FacingDirection,
  FurnishingType,
  AmenityKey,
  PropertySpecifications,
  PropertyPricing,
  PropertyLocation,
} from '@/lib/types';

export interface ExtractedDetails {
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  specifications: PropertySpecifications;
  pricing: PropertyPricing;
  location: Partial<PropertyLocation>;
  amenities: AmenityKey[];
  possession?: string;
}

export interface AIService {
  extractPropertyDetails(rawText: string): Promise<ExtractedDetails>;
  generateListingPreview(details: ExtractedDetails): Promise<AIListingPreview>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAIService implements AIService {
  async extractPropertyDetails(rawText: string): Promise<ExtractedDetails> {
    await delay(2500);

    const text = rawText.toLowerCase();

    let bhk: number | undefined;
    const bhkMatch = text.match(/(\d)\s*bhk/);
    if (bhkMatch) bhk = parseInt(bhkMatch[1], 10);

    let price: number | undefined;
    const lakhMatch = text.match(/₹?\s*([\d.]+)\s*lakh/);
    const croreMatch = text.match(/₹?\s*([\d.]+)\s*crore/);
    if (lakhMatch) price = parseFloat(lakhMatch[1]) * 100000;
    else if (croreMatch) price = parseFloat(croreMatch[1]) * 10000000;

    let area: number | undefined;
    const areaMatch = text.match(/([\d,]+)\s*sq/);
    if (areaMatch) area = parseInt(areaMatch[1].replace(/,/g, ''), 10);

    let parking: number | undefined;
    const parkingMatch = text.match(/(\d)\s*car\s*parking/);
    if (parkingMatch) parking = parseInt(parkingMatch[1], 10);

    let facing: FacingDirection | undefined;
    const facingMap: Record<string, FacingDirection> = {
      'east facing': 'East',
      'west facing': 'West',
      'north facing': 'North',
      'south facing': 'South',
      'north-east facing': 'North-East',
      'north-west facing': 'North-West',
      'south-east facing': 'South-East',
      'south-west facing': 'South-West',
    };
    for (const [key, val] of Object.entries(facingMap)) {
      if (text.includes(key)) {
        facing = val;
        break;
      }
    }

    let propertyType: PropertyType = 'Apartment';
    if (text.includes('villa')) propertyType = 'Villa';
    else if (text.includes('independent house') || text.includes('house'))
      propertyType = 'Independent House';
    else if (text.includes('plot')) propertyType = 'Plot';
    else if (text.includes('farm')) propertyType = 'Farm Land';
    else if (text.includes('office')) propertyType = 'Office';
    else if (text.includes('shop')) propertyType = 'Shop';
    else if (text.includes('warehouse')) propertyType = 'Warehouse';
    else if (text.includes('commercial')) propertyType = 'Commercial';

    let purpose: ListingPurpose = 'For Sale';
    if (text.includes('rent')) purpose = 'For Rent';
    else if (text.includes('lease')) purpose = 'Lease';

    const areas = [
      'Kapra', 'Sainikpuri', 'Kompally', 'Medchal', 'ECIL', 'Bongloor',
      'Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills',
    ];
    let areaName: string | undefined;
    for (const a of areas) {
      if (text.includes(a.toLowerCase())) {
        areaName = a;
        break;
      }
    }

    const amenities: AmenityKey[] = [];
    if (text.includes('gated')) amenities.push('Gated Community');
    if (text.includes('parking')) amenities.push('Parking');
    if (text.includes('lift') || text.includes('elevator')) amenities.push('Lift');
    if (text.includes('gym')) amenities.push('Gym');
    if (text.includes('pool') || text.includes('swimming')) amenities.push('Swimming Pool');
    if (text.includes('security')) amenities.push('Security');
    if (text.includes('cctv')) amenities.push('CCTV');
    if (text.includes('power backup') || text.includes('backup')) amenities.push('Power Backup');
    if (text.includes('garden')) amenities.push('Garden');
    if (text.includes('clubhouse')) amenities.push('Clubhouse');
    if (text.includes('solar')) amenities.push('Solar');
    if (text.includes('ev')) amenities.push('EV Charging');

    const isReady = text.includes('ready to move') || text.includes('ready');
    const furnishing: FurnishingType = text.includes('furnished')
      ? text.includes('semi')
        ? 'Semi-Furnished'
        : 'Fully Furnished'
      : 'Unfurnished';

    const title = bhk
      ? `${bhk} BHK ${propertyType} for ${purpose === 'For Sale' ? 'Sale' : purpose === 'For Rent' ? 'Rent' : 'Lease'}${areaName ? ` in ${areaName}` : ''}`
      : `${propertyType} for ${purpose === 'For Sale' ? 'Sale' : purpose === 'For Rent' ? 'Rent' : 'Lease'}${areaName ? ` in ${areaName}` : ''}`;

    const specifications: PropertySpecifications = {
      bhk,
      bathrooms: bhk ? bhk : undefined,
      carpetArea: area,
      builtUpArea: area ? Math.round(area * 1.1) : undefined,
      facing,
      furnishing,
      parking,
    };

    const pricing: PropertyPricing = {
      price: price ?? 0,
      negotiable: true,
    };

    if (area && price) {
      pricing.pricePerSqft = Math.round(price / area);
    }

    return {
      title,
      description: rawText.trim(),
      propertyType,
      purpose,
      specifications,
      pricing,
      location: areaName
        ? { area: areaName, city: 'Hyderabad', state: 'Telangana' }
        : { city: 'Hyderabad', state: 'Telangana' },
      amenities,
      possession: isReady ? 'Ready to Move' : undefined,
    };
  }

  async generateListingPreview(details: ExtractedDetails): Promise<AIListingPreview> {
    await delay(1500);

    const { title, pricing, specifications, location, amenities } = details;
    const priceStr = pricing.price
      ? pricing.price >= 10000000
        ? `₹${(pricing.price / 10000000).toFixed(2)} Crores`
        : `₹${(pricing.price / 100000).toFixed(0)} Lakhs`
      : 'Price on request';

    const bhkStr = specifications.bhk ? `${specifications.bhk} BHK ` : '';
    const areaStr = specifications.carpetArea
      ? `${specifications.carpetArea.toLocaleString()} Sq.Ft.`
      : '';
    const facingStr = specifications.facing ? `${specifications.facing} Facing` : '';
    const locStr = location.area ? `${location.area}, Hyderabad` : 'Hyderabad';

    const highlights: string[] = [];
    if (details.possession) highlights.push(details.possession);
    if (specifications.parking) highlights.push(`${specifications.parking} Car Parking`);
    if (amenities.includes('Gated Community')) highlights.push('Gated Community');
    if (specifications.furnishing && specifications.furnishing !== 'Unfurnished')
      highlights.push(specifications.furnishing);
    if (specifications.balconies) highlights.push(`${specifications.balconies} Balconies`);

    const locHighlights = [
      `Prime location in ${location.area ?? 'Hyderabad'}`,
      'Well-connected to major roads',
      'Close to schools and hospitals',
      'Easy access to public transport',
    ];

    return {
      optimizedTitle: title,
      shortDescription: `${bhkStr}${details.propertyType} for ${details.purpose === 'For Sale' ? 'Sale' : details.purpose === 'For Rent' ? 'Rent' : 'Lease'} in ${location.area ?? 'Hyderabad'}. ${areaStr} ${facingStr} property at ${priceStr}.`,
      longDescription: `Premium ${bhkStr}${details.propertyType} spread across ${areaStr || 'a spacious layout'} in a well-connected residential location${location.area ? ` near ${location.area}` : ''}. ${details.possession ?? 'Available for immediate possession'} with ${specifications.parking ?? 'ample'} car parking${amenities.includes('Gated Community') ? ', in a secure gated community' : ''}. ${facingStr ? `The property is ${facingStr.toLowerCase()}, ensuring excellent natural light and ventilation. ` : ''}An excellent opportunity for homebuyers and investors alike.`,
      keyHighlights: highlights,
      locationHighlights: locHighlights,
      whatsappMessage: `${title}\n\n${priceStr}\n${areaStr ? `📐 ${areaStr}\n` : ''}${facingStr ? `🧭 ${facingStr}\n` : ''}${specifications.parking ? `🚗 ${specifications.parking} Car Parking\n` : ''}\n📍 ${locStr}\n\nView Property:\nhttps://estatehub.in/property/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`,
    };
  }
}

export const aiService: AIService = new MockAIService();
