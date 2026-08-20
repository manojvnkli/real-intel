'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { propertySchema, type PropertyValues } from '@/lib/schemas';
import type {
  PropertyType,
  ListingPurpose,
  FacingDirection,
  FurnishingType,
  AmenityKey,
  OwnershipType,
  AvailabilityType,
  ExtractedDetails,
  PropertyImage,
} from '@/lib/types';
import { cn } from '@/lib/utils';

const propertyTypes: PropertyType[] = [
  'Apartment', 'Villa', 'Independent House', 'Plot', 'Farm Land',
  'Commercial', 'Office', 'Shop', 'Warehouse', 'Other',
];

const purposes: ListingPurpose[] = ['For Sale', 'For Rent', 'Lease'];

const facingDirections: FacingDirection[] = [
  'East', 'West', 'North', 'South',
  'North-East', 'North-West', 'South-East', 'South-West',
];

const furnishingTypes: FurnishingType[] = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];

const ownershipTypes: OwnershipType[] = [
  'Freehold', 'Leasehold', 'Co-operative Society', 'Power of Attorney',
];

const availabilityTypes: AvailabilityType[] = [
  'Ready to Move', 'Under Construction', 'Possession in 3 months', 'Possession in 6 months',
];

const allAmenities: AmenityKey[] = [
  'Lift', 'Power Backup', 'Security', 'CCTV', 'Swimming Pool',
  'Gym', 'Clubhouse', 'Children Play Area', 'Parking', 'EV Charging',
  'Solar', 'Home Theatre', 'Gated Community', 'Garden', 'Visitor Parking',
];

interface PropertyFormProps {
  initialData?: ExtractedDetails | null;
  images: PropertyImage[];
  onSubmit: (data: PropertyValues & { amenities: AmenityKey[]; customAmenities: string[] }) => void;
}

export function PropertyForm({ initialData, images, onSubmit }: PropertyFormProps) {
  const [selectedAmenities, setSelectedAmenities] = React.useState<AmenityKey[]>(initialData?.amenities ?? []);
  const [customAmenities, setCustomAmenities] = React.useState<string[]>([]);
  const [customAmenityInput, setCustomAmenityInput] = React.useState('');

  const form = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title ?? '',
      propertyType: initialData?.propertyType ?? 'Apartment',
      purpose: initialData?.purpose ?? 'For Sale',
      description: initialData?.description ?? '',
      address: '',
      area: initialData?.location?.area ?? '',
      locality: initialData?.location?.locality ?? '',
      city: initialData?.location?.city ?? 'Hyderabad',
      state: initialData?.location?.state ?? 'Telangana',
      pincode: '',
      landmark: '',
      bhk: initialData?.specifications?.bhk,
      bathrooms: initialData?.specifications?.bathrooms,
      balconies: initialData?.specifications?.balconies,
      carpetArea: initialData?.specifications?.carpetArea,
      builtUpArea: initialData?.specifications?.builtUpArea,
      plotArea: initialData?.specifications?.plotArea,
      floor: initialData?.specifications?.floor,
      totalFloors: initialData?.specifications?.totalFloors,
      facing: initialData?.specifications?.facing,
      ageOfProperty: initialData?.specifications?.ageOfProperty,
      furnishing: initialData?.specifications?.furnishing ?? 'Unfurnished',
      parking: initialData?.specifications?.parking,
      price: initialData?.pricing?.price,
      maintenance: undefined,
      negotiable: initialData?.pricing?.negotiable ?? true,
      deposit: initialData?.pricing?.deposit,
      possession: initialData?.possession,
      reraNumber: '',
      ownership: 'Freehold',
      availability: 'Ready to Move',
      brokerage: '2%',
      notes: '',
    },
  });

  const toggleAmenity = (amenity: AmenityKey) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenityInput.trim();
    if (trimmed && !customAmenities.includes(trimmed)) {
      setCustomAmenities((prev) => [...prev, trimmed]);
      setCustomAmenityInput('');
    }
  };

  const handleSubmit = (data: PropertyValues) => {
    onSubmit({ ...data, amenities: selectedAmenities, customAmenities });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Basic Information */}
        <FormSection title="Basic Information">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Listing title</FormLabel>
                <FormControl>
                  <Input placeholder="3 BHK Apartment for Sale in Kapra" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {propertyTypes.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Listing purpose</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {purposes.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Location */}
        <FormSection title="Location">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Plot 12, Sainikpuri Road" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area</FormLabel>
                  <FormControl>
                    <Input placeholder="Kapra" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="locality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Locality</FormLabel>
                  <FormControl>
                    <Input placeholder="Sainikpuri Main Road" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Hyderabad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="Telangana" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input placeholder="500062" maxLength={6} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="landmark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Landmark</FormLabel>
                  <FormControl>
                    <Input placeholder="Near Kapra Bus Stop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Map placeholder */}
          <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30">
            <div className="text-center text-muted-foreground">
              <MapPin className="mx-auto mb-2 h-8 w-8" />
              <p className="text-sm">Map preview will appear here</p>
              <p className="text-xs">Connect Google Maps, Mapbox, or OpenStreetMap later</p>
            </div>
          </div>
        </FormSection>

        {/* Property Specifications */}
        <FormSection title="Property Specifications">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="bhk"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BHK</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balconies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balconies</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carpetArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carpet Area (sq.ft.)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1650" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="builtUpArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Built-up Area (sq.ft.)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="1820" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plotArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plot Area (sq.ft.)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2400" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalFloors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Floors</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="12" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facing</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {facingDirections.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ageOfProperty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age (years)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="furnishing"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnishing</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {furnishingTypes.map((f) => (
                        <SelectItem key={f} value={f}>{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormSection>

        {/* Pricing */}
        <FormSection title="Pricing">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="7800000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maintenance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance (₹/mo)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="3500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deposit (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="70000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="negotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal text-muted-foreground">
                  Price is negotiable
                </FormLabel>
              </FormItem>
            )}
          />
        </FormSection>

        {/* Amenities */}
        <FormSection title="Amenities">
          <div className="flex flex-wrap gap-2">
            {allAmenities.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                  selectedAmenities.includes(amenity)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                )}
              >
                {amenity}
              </button>
            ))}
          </div>
          {/* Custom amenities */}
          <div className="flex gap-2">
            <Input
              placeholder="Add custom amenity..."
              value={customAmenityInput}
              onChange={(e) => setCustomAmenityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomAmenity();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addCustomAmenity} className="gap-1">
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>
          {customAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customAmenities.map((a) => (
                <span
                  key={a}
                  className="flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm text-accent-foreground"
                >
                  {a}
                  <button type="button" onClick={() => setCustomAmenities((prev) => prev.filter((x) => x !== a))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </FormSection>

        {/* Additional Information */}
        <FormSection title="Additional Information">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Detailed property description..." className="min-h-[120px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="possession"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Possession</FormLabel>
                  <Input placeholder="Ready to Move" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reraNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RERA number</FormLabel>
                  <Input placeholder="P00324/2023" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ownership"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ownership</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ownershipTypes.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availabilityTypes.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="brokerage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brokerage</FormLabel>
                  <Input placeholder="2%" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Internal notes about this property..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        {/* Hidden submit */}
        <button type="submit" className="hidden" id="property-form-submit" />
      </form>
    </Form>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
