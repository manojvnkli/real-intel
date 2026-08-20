'use client';

import * as React from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, Trash2, Pencil, Share2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { collectionService } from '@/services/collection.service';
import { propertyService } from '@/services/property.service';
import { shareService } from '@/services/share.service';
import type { Collection, Property } from '@/lib/types';

export default function CollectionsPage() {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [renameId, setRenameId] = React.useState<string | null>(null);
  const [renameValue, setRenameValue] = React.useState('');
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [addPropId, setAddPropId] = React.useState<string | null>(null);
  const [selectedProp, setSelectedProp] = React.useState('');
  const [newCollection, setNewCollection] = React.useState({ name: '', description: '' });

  const loadData = React.useCallback(async () => {
    try {
      const [cols, props] = await Promise.all([
        collectionService.getCollections(),
        propertyService.getProperties(),
      ]);
      setCollections(cols);
      setProperties(props);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async () => {
    if (!newCollection.name.trim()) return;
    await collectionService.createCollection({
      name: newCollection.name,
      description: newCollection.description,
      propertyIds: [],
    });
    toast.success('Collection created');
    setCreateOpen(false);
    setNewCollection({ name: '', description: '' });
    loadData();
  };

  const handleRename = async () => {
    if (!renameId || !renameValue.trim()) return;
    await collectionService.renameCollection(renameId, renameValue);
    toast.success('Collection renamed');
    setRenameId(null);
    setRenameValue('');
    loadData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await collectionService.deleteCollection(deleteId);
    toast.success('Collection deleted');
    setDeleteId(null);
    loadData();
  };

  const handleAddProperty = async () => {
    if (!addPropId || !selectedProp) return;
    await collectionService.addListing(addPropId, selectedProp);
    toast.success('Property added to collection');
    setAddPropId(null);
    setSelectedProp('');
    loadData();
  };

  const handleRemoveProperty = async (collectionId: string, propertyId: string) => {
    await collectionService.removeListing(collectionId, propertyId);
    toast.success('Property removed');
    loadData();
  };

  const handleShare = (collection: Collection) => {
    const url = `${window.location.origin}/collection/${collection.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Collection link copied');
  };

  if (loading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  if (error) return <ErrorState onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Collections</h1>
          <p className="mt-1 text-sm text-muted-foreground">Organize your properties into curated groups</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Create Collection</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="col-name">Collection name</Label>
                <Input
                  id="col-name"
                  placeholder="Hyderabad Villas"
                  value={newCollection.name}
                  onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="col-desc">Description</Label>
                <Textarea
                  id="col-desc"
                  placeholder="Premium villa listings across Hyderabad"
                  value={newCollection.description}
                  onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="h-8 w-8" />}
          title="No collections yet"
          description="Create collections to organize your properties by location, type, or budget."
          action={<Button className="gap-2" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Create Collection</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Card key={col.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{col.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">{col.propertyIds.length} {col.propertyIds.length === 1 ? 'property' : 'properties'}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setRenameId(col.id); setRenameValue(col.name); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleShare(col)}>
                    <Share2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setDeleteId(col.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-muted-foreground">{col.description}</p>
                <div className="space-y-2">
                  {col.propertyIds.map((pid) => {
                    const prop = properties.find((p) => p.id === pid);
                    if (!prop) return null;
                    return (
                      <div key={pid} className="flex items-center gap-2 rounded-md border border-border p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={(prop.images.find((i) => i.isCover) ?? prop.images[0])?.url} alt="" className="h-10 w-14 rounded object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">{prop.title}</p>
                          <p className="truncate text-xs text-muted-foreground">{prop.location.area}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveProperty(col.id, pid)}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                  {col.propertyIds.length === 0 && (
                    <p className="text-xs text-muted-foreground">No properties in this collection yet.</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full gap-1" onClick={() => setAddPropId(col.id)}>
                  <Plus className="h-3.5 w-3.5" /> Add Property
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rename dialog */}
      <Dialog open={!!renameId} onOpenChange={(o) => !o && setRenameId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rename">New name</Label>
            <Input id="rename" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameId(null)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add property dialog */}
      <Dialog open={!!addPropId} onOpenChange={(o) => !o && setAddPropId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Property to Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Select a property</Label>
            <Select value={selectedProp} onValueChange={setSelectedProp}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPropId(null)}>Cancel</Button>
            <Button onClick={handleAddProperty}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete collection?"
        description="The collection will be removed. Properties will not be affected."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
