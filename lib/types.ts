export type PropertyType =
  | 'Apartment'
  | 'Villa'
  | 'Independent House'
  | 'Plot'
  | 'Farm Land'
  | 'Commercial'
  | 'Office'
  | 'Shop'
  | 'Warehouse'
  | 'Other';

export type ListingPurpose = 'For Sale' | 'For Rent' | 'Lease';

export type PropertyStatus =
  | 'Active'
  | 'Draft'
  | 'Sold'
  | 'Rented'
  | 'Archived';

export type FacingDirection =
  | 'East'
  | 'West'
  | 'North'
  | 'South'
  | 'North-East'
  | 'North-West'
  | 'South-East'
  | 'South-West';

export type FurnishingType =
  | 'Unfurnished'
  | 'Semi-Furnished'
  | 'Fully Furnished';

export type AvailabilityType =
  | 'Ready to Move'
  | 'Under Construction'
  | 'Possession in 3 months'
  | 'Possession in 6 months';

export type OwnershipType =
  | 'Freehold'
  | 'Leasehold'
  | 'Co-operative Society'
  | 'Power of Attorney';

export type AmenityKey =
  | 'Lift'
  | 'Power Backup'
  | 'Security'
  | 'CCTV'
  | 'Swimming Pool'
  | 'Gym'
  | 'Clubhouse'
  | 'Children Play Area'
  | 'Parking'
  | 'EV Charging'
  | 'Solar'
  | 'Home Theatre'
  | 'Gated Community'
  | 'Garden'
  | 'Visitor Parking';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  city: string;
  agencyName?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  fullName: string;
  agencyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  bio: string;
  avatarUrl?: string;
  reraNumber: string;
  experienceYears: number;
  specialization: string[];
  areasServed: string[];
  publicUsername: string;
  publicSiteUrl: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  isCover: boolean;
  order: number;
}

export interface PropertyVideo {
  id: string;
  url: string;
  thumbnailUrl: string;
}

export interface PropertyLocation {
  address: string;
  area: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface PropertySpecifications {
  bhk?: number;
  bathrooms?: number;
  balconies?: number;
  carpetArea?: number;
  builtUpArea?: number;
  plotArea?: number;
  floor?: number;
  totalFloors?: number;
  facing?: FacingDirection;
  ageOfProperty?: number;
  furnishing?: FurnishingType;
  parking?: number;
}

export interface PropertyPricing {
  price: number;
  pricePerSqft?: number;
  maintenance?: number;
  negotiable: boolean;
  deposit?: number;
  emiEstimate?: number;
}

export interface PropertyAnalytics {
  views: number;
  shares: number;
  enquiries: number;
  siteVisits: number;
}

export interface AIListingPreview {
  optimizedTitle: string;
  shortDescription: string;
  longDescription: string;
  keyHighlights: string[];
  locationHighlights: string[];
  whatsappMessage: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  status: PropertyStatus;
  location: PropertyLocation;
  specifications: PropertySpecifications;
  pricing: PropertyPricing;
  amenities: AmenityKey[];
  customAmenities: string[];
  images: PropertyImage[];
  videos: PropertyVideo[];
  possession?: string;
  reraNumber?: string;
  ownership?: OwnershipType;
  availability?: AvailabilityType;
  brokerage?: string;
  notes?: string;
  aiPreview?: AIListingPreview;
  analytics: PropertyAnalytics;
  brokerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  propertyIds: string[];
  brokerId: string;
  createdAt: string;
}

export type AgencyRole = 'Owner' | 'Admin' | 'Agent' | 'Viewer';

export interface AgencyMember {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: AgencyRole;
  avatarUrl?: string;
  joinedAt: string;
}

export interface Agency {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  city: string;
  ownerId: string;
  members: AgencyMember[];
  createdAt: string;
}

export type NotificationType =
  | 'enquiry'
  | 'views'
  | 'site_visit'
  | 'listing_published'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface Lead {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  createdAt: string;
}

export interface SiteVisit {
  id: string;
  propertyId: string;
  name: string;
  phone: string;
  preferredDate: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  activeListings: number;
  draftListings: number;
  totalViews: number;
  leads: number;
  siteVisits: number;
}

export interface PerformancePoint {
  date: string;
  views: number;
  leads: number;
  shares: number;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  purpose: ListingPurpose;
  location: PropertyLocation;
  specifications: PropertySpecifications;
  pricing: PropertyPricing;
  amenities: AmenityKey[];
  customAmenities: string[];
  images: PropertyImage[];
  videos: PropertyVideo[];
  possession?: string;
  reraNumber?: string;
  ownership?: OwnershipType;
  availability?: AvailabilityType;
  brokerage?: string;
  notes?: string;
  aiPreview?: AIListingPreview;
}

export type UpdatePropertyInput = Partial<CreatePropertyInput> & {
  status?: PropertyStatus;
};

export interface CreateCollectionInput {
  name: string;
  description: string;
  propertyIds: string[];
}

export interface UpdateProfileInput {
  fullName: string;
  agencyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  bio: string;
  reraNumber: string;
  experienceYears: number;
  specialization: string[];
  areasServed: string[];
  publicUsername: string;
}

export interface CreateAgencyInput {
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  city: string;
}
