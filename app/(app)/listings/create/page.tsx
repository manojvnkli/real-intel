'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StepIndicator } from '@/components/listings/step-indicator';
import { ImageUploader, VideoUploader } from '@/components/listings/image-uploader';
import { AIExtractionPanel } from '@/components/listings/ai-extraction-panel';
import { PropertyForm } from '@/components/listings/property-form';
import { AIListingPreviewComponent } from '@/components/listings/ai-listing-preview';
import { WhatsAppButton } from '@/components/sharing/whatsapp-button';
import { propertyService } from '@/services/property.service';
import { aiService, type ExtractedDetails } from '@/services/ai.service';
import type {
  PropertyImage,
  PropertyVideo,
  AmenityKey,
  AIListingPreview,
  Property,
  CreatePropertyInput,
} from '@/lib/types';
import { formatPrice } from '@/lib/format';

const steps = ['Photos', 'Details', 'Publish'];

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1);
  const [images, setImages] = React.useState<PropertyImage[]>([]);
  const [videos, setVideos] = React.useState<PropertyVideo[]>([]);
  const [extracted, setExtracted] = React.useState<ExtractedDetails | null>(null);
  const [rawDescription, setRawDescription] = React.useState('');
  const [formData, setFormData] = React.useState<Record<string, unknown> | null>(null);
  const [aiPreview, setAiPreview] = React.useState<AIListingPreview | null>(null);
  const [showAiPreview, setShowAiPreview] = React.useState(false);
  const [createdProperty, setCreatedProperty] = React.useState<Property | null>(null);
  const [publishing, setPublishing] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleExtracted = (details: ExtractedDetails, rawText: string) => {
    setExtracted(details);
    setRawDescription(rawText);
    toast.success('AI extracted property details! Review and continue.');
  };

  const handleFormSubmit = (data: Record<string, unknown> & { amenities: AmenityKey[]; customAmenities: string[] }) => {
    setFormData(data);
    setShowAiPreview(true);
  };

  const handleAcceptPreview = (preview: AIListingPreview) => {
    setAiPreview(preview);
    setShowAiPreview(false);
    setStep(3);
    toast.success('Preview accepted. Ready to publish!');
  };

  const handlePublish = async () => {
    if (!formData) return;
    setPublishing(true);
    try {
      const input: CreatePropertyInput = {
        title: formData.title as string,
        description: formData.description as string,
        propertyType: formData.propertyType as Property['propertyType'],
        purpose: formData.purpose as Property['purpose'],
        location: {
          address: formData.address as string,
          area: formData.area as string,
          locality: (formData.locality as string) ?? '',
          city: formData.city as string,
          state: formData.state as string,
          pincode: formData.pincode as string,
          landmark: (formData.landmark as string) ?? '',
        },
        specifications: {
          bhk: formData.bhk as number | undefined,
          bathrooms: formData.bathrooms as number | undefined,
          balconies: formData.balconies as number | undefined,
          carpetArea: formData.carpetArea as number | undefined,
          builtUpArea: formData.builtUpArea as number | undefined,
          plotArea: formData.plotArea as number | undefined,
          floor: formData.floor as number | undefined,
          totalFloors: formData.totalFloors as number | undefined,
          facing: formData.facing as Property['specifications']['facing'],
          ageOfProperty: formData.ageOfProperty as number | undefined,
          furnishing: formData.furnishing as Property['specifications']['furnishing'],
          parking: formData.parking as number | undefined,
        },
        pricing: {
          price: formData.price as number,
          maintenance: formData.maintenance as number | undefined,
          negotiable: formData.negotiable as boolean,
          deposit: formData.deposit as number | undefined,
        },
        amenities: formData.amenities,
        customAmenities: formData.customAmenities,
        images,
        videos,
        possession: (formData.possession as string) ?? '',
        reraNumber: (formData.reraNumber as string) ?? '',
        ownership: formData.ownership as Property['ownership'],
        availability: formData.availability as Property['availability'],
        brokerage: (formData.brokerage as string) ?? '',
        notes: (formData.notes as string) ?? '',
        aiPreview: aiPreview ?? undefined,
      };

      const created = await propertyService.createProperty(input);
      const published = await propertyService.publishProperty(created.id);
      setCreatedProperty(published);
      toast.success('Listing published!');
      router.push(`/listings/success?id=${published.id}`);
    } catch {
      toast.error('Failed to publish listing');
    } finally {
      setPublishing(false);
    }
  };

  const canProceedStep1 = images.length > 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Create New Listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload photos, describe your property, and let AI handle the rest.
        </p>
      </div>

      <StepIndicator currentStep={step} steps={steps} />

      {/* Step 1: Photos + AI */}
      {step === 1 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader images={images} onChange={setImages} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Videos (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoUploader videos={videos} onChange={setVideos} />
            </CardContent>
          </Card>

          <Card className="border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                AI Property Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIExtractionPanel onExtracted={handleExtracted} />
            </CardContent>
          </Card>

          {extracted && (
            <div className="rounded-lg border border-success/30 bg-success/5 p-4">
              <p className="text-sm font-medium text-success">
                AI extracted details! Click continue to review and edit them.
              </p>
            </div>
          )}

          <WizardNav
            onBack={() => router.push('/listings')}
            onNext={() => setStep(2)}
            nextLabel="Continue to Details"
            nextDisabled={!canProceedStep1}
          />
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-6">
          <PropertyForm
            initialData={extracted}
            images={images}
            onSubmit={handleFormSubmit}
          />

          {showAiPreview && extracted && (
            <AIListingPreviewComponent details={extracted} onAccept={handleAcceptPreview} />
          )}

          <WizardNav
            onBack={() => setStep(1)}
            onNext={() => {
              document.getElementById('property-form-submit')?.click();
              if (!showAiPreview) {
                toast.info('Please fill in the form and submit to continue');
              }
            }}
            nextLabel={showAiPreview ? 'Review AI Preview' : 'Save & Continue'}
          />
        </div>
      )}

      {/* Step 3: Publish */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Property Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Property Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {images.slice(0, 4).map((img) => (
                    <div key={img.id} className="aspect-video overflow-hidden rounded-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="Property" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              <h3 className="font-display text-xl font-bold text-foreground">
                {(formData?.title as string) ?? 'Untitled Property'}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {formData?.area}, {formData?.city}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-primary">
                {formData?.price ? formatPrice(formData.price as number, formData.purpose as string) : ''}
              </p>
            </CardContent>
          </Card>

          {/* Listing Details Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <Detail label="Property Type" value={formData?.propertyType as string} />
                <Detail label="Purpose" value={formData?.purpose as string} />
                <Detail label="BHK" value={formData?.bhk ? `${formData.bhk} BHK` : '-'} />
                <Detail label="Area" value={formData?.carpetArea ? `${formData.carpetArea} sq.ft.` : '-'} />
                <Detail label="Facing" value={formData?.facing as string} />
                <Detail label="Furnishing" value={formData?.furnishing as string} />
                <Detail label="Ownership" value={formData?.ownership as string} />
                <Detail label="Availability" value={formData?.availability as string} />
                <Detail label="RERA" value={formData?.reraNumber as string} />
              </dl>
            </CardContent>
          </Card>

          {/* Public URL */}
          <Card>
            <CardHeader>
              <CardTitle>Public URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground">
                  estatehub.in/property/{(formData?.title as string ?? 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `estatehub.in/property/${(formData?.title as string ?? 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
                    );
                    toast.success('Link copied');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <WhatsAppButton
                  property={createdProperty ?? {
                    id: 'preview',
                    slug: (formData?.title as string ?? 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                    title: formData?.title as string,
                    description: formData?.description as string,
                    propertyType: formData?.propertyType as Property['propertyType'],
                    purpose: formData?.purpose as Property['purpose'],
                    status: 'Draft',
                    location: {
                      address: formData?.address as string,
                      area: formData?.area as string,
                      locality: '',
                      city: formData?.city as string,
                      state: formData?.state as string,
                      pincode: formData?.pincode as string,
                    },
                    specifications: {},
                    pricing: { price: formData?.price as number, negotiable: true },
                    amenities: [],
                    customAmenities: [],
                    images,
                    videos,
                    analytics: { views: 0, shares: 0, enquiries: 0, siteVisits: 0 },
                    brokerId: 'user-1',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  }}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `estatehub.in/property/${(formData?.title as string ?? 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
                    );
                    toast.success('Link copied');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Publish */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-1">
              <ArrowLeft className="h-4 w-4" /> Back to Details
            </Button>
            <Button onClick={handlePublish} disabled={publishing} className="flex-1 gap-2">
              <Check className="h-4 w-4" />
              {publishing ? 'Publishing...' : 'Publish Listing'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function WizardNav({
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-border bg-background/80 p-4 backdrop-blur lg:rounded-lg lg:border lg:p-4">
      <Button variant="outline" onClick={onBack} className="gap-1">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Button onClick={onNext} disabled={nextDisabled} className="gap-1">
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value || '-'}</dd>
    </div>
  );
}
