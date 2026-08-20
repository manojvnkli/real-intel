'use client';

import * as React from 'react';
import { Sparkles, RefreshCw, Check, Pencil, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { aiService, type ExtractedDetails } from '@/services/ai.service';
import type { AIListingPreview } from '@/lib/types';

interface AIListingPreviewProps {
  details: ExtractedDetails;
  onAccept: (preview: AIListingPreview) => void;
}

export function AIListingPreviewComponent({ details, onAccept }: AIListingPreviewProps) {
  const [preview, setPreview] = React.useState<AIListingPreview | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editedPreview, setEditedPreview] = React.useState<AIListingPreview | null>(null);

  const generate = React.useCallback(async () => {
    setLoading(true);
    try {
      const p = await aiService.generateListingPreview(details);
      setPreview(p);
      setEditedPreview(p);
    } finally {
      setLoading(false);
    }
  }, [details]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const handleSave = () => {
    if (editedPreview) {
      setPreview(editedPreview);
      setEditing(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating AI preview...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!preview || !editedPreview) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Listing Preview
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={generate} className="gap-1">
          <RefreshCw className="h-4 w-4" />
          Regenerate
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Optimized Title</label>
          {editing ? (
            <input
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editedPreview.optimizedTitle}
              onChange={(e) => setEditedPreview({ ...editedPreview, optimizedTitle: e.target.value })}
            />
          ) : (
            <p className="mt-1 font-display text-lg font-bold text-foreground">{preview.optimizedTitle}</p>
          )}
        </div>

        {/* Short description */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Short Description</label>
          {editing ? (
            <textarea
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={editedPreview.shortDescription}
              onChange={(e) => setEditedPreview({ ...editedPreview, shortDescription: e.target.value })}
            />
          ) : (
            <p className="mt-1 text-sm text-foreground">{preview.shortDescription}</p>
          )}
        </div>

        {/* Long description */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Long Description</label>
          {editing ? (
            <textarea
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
              value={editedPreview.longDescription}
              onChange={(e) => setEditedPreview({ ...editedPreview, longDescription: e.target.value })}
            />
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">{preview.longDescription}</p>
          )}
        </div>

        {/* Key highlights */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Key Highlights</label>
          <div className="mt-1 flex flex-wrap gap-2">
            {preview.keyHighlights.map((h, i) => (
              <Badge key={i} variant="secondary">{h}</Badge>
            ))}
          </div>
        </div>

        {/* Location highlights */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">Location Highlights</label>
          <ul className="mt-1 space-y-1">
            {preview.locationHighlights.map((h, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span> {h}
              </li>
            ))}
          </ul>
        </div>

        {/* WhatsApp message preview */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">WhatsApp Message</label>
          <pre className="mt-1 whitespace-pre-wrap rounded-md border border-border bg-secondary/50 p-3 text-xs text-foreground">
            {preview.whatsappMessage}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {editing ? (
            <Button onClick={handleSave} className="gap-1">
              <Check className="h-4 w-4" /> Save Changes
            </Button>
          ) : (
            <Button onClick={() => setEditing(true)} variant="outline" className="gap-1">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          )}
          <Button onClick={() => onAccept(preview)} className="gap-1">
            <Check className="h-4 w-4" /> Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
