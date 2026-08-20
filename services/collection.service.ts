import type { Collection, CreateCollectionInput } from '@/lib/types';
import { mockCollections } from '@/lib/mock/collections';

export interface CollectionService {
  getCollections(): Promise<Collection[]>;
  getCollection(id: string): Promise<Collection>;
  createCollection(data: CreateCollectionInput): Promise<Collection>;
  renameCollection(id: string, name: string): Promise<Collection>;
  deleteCollection(id: string): Promise<void>;
  addListing(collectionId: string, propertyId: string): Promise<Collection>;
  removeListing(collectionId: string, propertyId: string): Promise<Collection>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export class MockCollectionService implements CollectionService {
  private collections: Collection[] = [...mockCollections];

  async getCollections(): Promise<Collection[]> {
    await delay(400);
    return [...this.collections];
  }

  async getCollection(id: string): Promise<Collection> {
    await delay(300);
    const col = this.collections.find((c) => c.id === id);
    if (!col) throw new Error('Collection not found');
    return { ...col };
  }

  async createCollection(data: CreateCollectionInput): Promise<Collection> {
    await delay(500);
    const col: Collection = {
      id: `col-${Date.now()}`,
      slug: slugify(data.name),
      name: data.name,
      description: data.description,
      propertyIds: data.propertyIds,
      brokerId: 'user-1',
      createdAt: new Date().toISOString(),
    };
    this.collections.unshift(col);
    return { ...col };
  }

  async renameCollection(id: string, name: string): Promise<Collection> {
    await delay(400);
    const idx = this.collections.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Collection not found');
    this.collections[idx] = {
      ...this.collections[idx],
      name,
      slug: slugify(name),
    };
    return { ...this.collections[idx] };
  }

  async deleteCollection(id: string): Promise<void> {
    await delay(400);
    this.collections = this.collections.filter((c) => c.id !== id);
  }

  async addListing(collectionId: string, propertyId: string): Promise<Collection> {
    await delay(300);
    const idx = this.collections.findIndex((c) => c.id === collectionId);
    if (idx === -1) throw new Error('Collection not found');
    if (!this.collections[idx].propertyIds.includes(propertyId)) {
      this.collections[idx].propertyIds.push(propertyId);
    }
    return { ...this.collections[idx] };
  }

  async removeListing(collectionId: string, propertyId: string): Promise<Collection> {
    await delay(300);
    const idx = this.collections.findIndex((c) => c.id === collectionId);
    if (idx === -1) throw new Error('Collection not found');
    this.collections[idx].propertyIds = this.collections[idx].propertyIds.filter(
      (p) => p !== propertyId
    );
    return { ...this.collections[idx] };
  }
}

export const collectionService: CollectionService = new MockCollectionService();
