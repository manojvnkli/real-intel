'use client';

import * as React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { aiService, type ExtractedDetails } from '@/services/ai.service';
import { cn } from '@/lib/utils';

interface AIExtractionPanelProps {
  onExtracted: (details: ExtractedDetails, rawText: string) => void;
}

const processingSteps = [
  'Analyzing property information...',
  'Extracting location...',
  'Extracting price...',
  'Extracting configuration...',
  'Extracting amenities...',
];

export function AIExtractionPanel({ onExtracted }: AIExtractionPanelProps) {
  const [text, setText] = React.useState('');
  const [processing, setProcessing] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(processingSteps.length - 1, prev + 1));
    }, 500);

    try {
      const details = await aiService.extractPropertyDetails(text);
      clearInterval(stepInterval);
      onExtracted(details, text);
    } catch {
      clearInterval(stepInterval);
    } finally {
      setProcessing(false);
      setCurrentStep(0);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Describe your property
        </label>
        <Textarea
          placeholder="3BHK flat in Kapra, 1650 sqft, east facing, ₹78 lakhs, ready to move, 2 car parking, near Sainikpuri main road..."
          className="min-h-[140px] resize-y"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={processing}
        />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-accent" />
        <span>AI will organize these details automatically</span>
      </div>

      {processing && (
        <div className="space-y-2 rounded-lg border border-border bg-secondary/50 p-4">
          {processingSteps.map((step, idx) => (
            <div
              key={step}
              className={cn(
                'flex items-center gap-2 text-sm transition-opacity',
                idx <= currentStep ? 'opacity-100' : 'opacity-30'
              )}
            >
              {idx < currentStep ? (
                <span className="text-success">✓</span>
              ) : idx === currentStep ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              ) : (
                <span className="h-3.5 w-3.5" />
              )}
              {step}
            </div>
          ))}
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={processing || !text.trim()}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        {processing ? 'Generating...' : 'Generate Property Details'}
      </Button>
    </div>
  );
}
