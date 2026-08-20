'use client';

import * as React from 'react';
import { Upload, X, Star, GripVertical, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { PropertyImage } from '@/lib/types';
import { mediaService } from '@/services/media.service';
import { toast } from 'sonner';

interface ImageUploaderProps {
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [dragActive, setDragActive] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles = Array.from(files).filter((f) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        toast.error(`${f.name} is not a valid image format (JPG, PNG, WebP only)`);
        return false;
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error(`${f.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setProgress(0);

    const uploaded: PropertyImage[] = [];
    const progressStep = 100 / validFiles.length;

    for (const file of validFiles) {
      try {
        const img = await mediaService.uploadImage(file);
        uploaded.push({ ...img, order: images.length + uploaded.length });
        setProgress((prev) => Math.min(100, prev + progressStep));
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    const newImages = [...images, ...uploaded];
    if (newImages.length > 0 && !newImages.some((i) => i.isCover)) {
      newImages[0].isCover = true;
    }
    onChange(newImages);
    setUploading(false);
    setProgress(0);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (id: string) => {
    const filtered = images.filter((i) => i.id !== id);
    if (filtered.length > 0 && !filtered.some((i) => i.isCover)) {
      filtered[0].isCover = true;
    }
    onChange(filtered);
  };

  const setCover = (id: string) => {
    onChange(images.map((i) => ({ ...i, isCover: i.id === id })));
  };

  const moveImage = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= images.length) return;
    const newImages = [...images];
    [newImages[idx], newImages[newIdx]] = [newImages[newIdx], newImages[idx]];
    newImages.forEach((img, i) => (img.order = i));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors',
          dragActive ? 'border-primary bg-secondary' : 'border-border hover:border-primary/50 hover:bg-secondary/50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          Drag &amp; drop or click to upload
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WebP up to 5MB each
        </p>
      </div>

      {uploading && (
        <div className="space-y-1">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">Uploading images...</p>
        </div>
      )}

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="Property" className="h-full w-full object-cover" />
              {img.isCover && (
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                  <Star className="h-3 w-3" /> Cover
                </div>
              )}
              {/* Controls */}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                {!img.isCover && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCover(img.id);
                    }}
                    title="Set as cover"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(idx, -1);
                  }}
                  disabled={idx === 0}
                  title="Move left"
                >
                  <GripVertical className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveImage(idx, 1);
                  }}
                  disabled={idx === images.length - 1}
                  title="Move right"
                >
                  <GripVertical className="h-4 w-4 rotate-180" />
                </Button>
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(img.id);
                  }}
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface VideoUploaderProps {
  videos: { id: string; url: string; thumbnailUrl: string }[];
  onChange: (videos: { id: string; url: string; thumbnailUrl: string }[]) => void;
}

export function VideoUploader({ videos, onChange }: VideoUploaderProps) {
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }
    setUploading(true);
    try {
      const result = await mediaService.uploadVideo(file);
      onChange([
        ...videos,
        { id: `vid-${Date.now()}`, url: result.url, thumbnailUrl: result.thumbnailUrl },
      ]);
      toast.success('Video uploaded');
    } catch {
      toast.error('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const removeVideo = (id: string) => {
    onChange(videos.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50"
      >
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <Film className="mb-2 h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          {uploading ? 'Uploading...' : 'Upload property video'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">MP4, MOV up to 50MB</p>
      </div>

      {videos.map((v) => (
        <div key={v.id} className="relative overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={v.thumbnailUrl} alt="Video thumbnail" className="h-32 w-full object-cover" />
          <Button
            size="icon"
            variant="destructive"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => removeVideo(v.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
