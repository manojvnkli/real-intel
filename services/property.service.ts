import type {
  Property,
  CreatePropertyInput,
  UpdatePropertyInput,
  PropertyStatus,
} from '@/lib/types';
import { mockProperties } from '@/lib/mock/properties';

export interface PropertyService {
  getProperties(): Promise<Property[]>;
  getProperty(id: string): Promise<Property>;
  getPropertyBySlug(slug: string): Promise<Property>;
  createProperty(data: CreatePropertyInput): Promise<Property>;
  updateProperty(id: string, data: UpdatePropertyInput): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  publishProperty(id: string): Promise<Property>;
  duplicateProperty(id: string): Promise<Property>;
  archiveProperty(id: string): Promise<Property>;
  updateStatus(id: string, status: PropertyStatus): Promise<Property>;
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

export class MockPropertyService implements PropertyService {
  private properties: Property[] = [...mockProperties];

  async getProperties(): Promise<Property[]> {
    await delay(500);
    return [...this.properties];
  }

  async getProperty(id: string): Promise<Property> {
    await delay(300);
    const prop = this.properties.find((p) => p.id === id);
    if (!prop) throw new Error('Property not found');
    return { ...prop };
  }

  async getPropertyBySlug(slug: string): Promise<Property> {
    await delay(300);
    const prop = this.properties.find((p) => p.slug === slug);
    if (!prop) throw new Error('Property not found');
    return { ...prop };
  }

  async createProperty(data: CreatePropertyInput): Promise<Property> {
    await delay(600);
    const now = new Date().toISOString();
    const id = `prop-${Date.now()}`;
    const prop: Property = {
      ...data,
      id,
      slug: slugify(data.title) || `property-${id}`,
      status: 'Draft',
      analytics: { views: 0, shares: 0, enquiries: 0, siteVisits: 0 },
      brokerId: 'user-1',
      createdAt: now,
      updatedAt: now,
    };
    this.properties.unshift(prop);
    return { ...prop };
  }

  async updateProperty(id: string, data: UpdatePropertyInput): Promise<Property> {
    await delay(500);
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    this.properties[idx] = {
      ...this.properties[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.properties[idx] };
  }

  async deleteProperty(id: string): Promise<void> {
    await delay(400);
    this.properties = this.properties.filter((p) => p.id !== id);
  }

  async publishProperty(id: string): Promise<Property> {
    return this.updateStatus(id, 'Active');
  }

  async duplicateProperty(id: string): Promise<Property> {
    await delay(500);
    const original = this.properties.find((p) => p.id === id);
    if (!original) throw new Error('Property not found');
    const now = new Date().toISOString();
    const dup: Property = {
      ...original,
      id: `prop-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy`,
      status: 'Draft',
      analytics: { views: 0, shares: 0, enquiries: 0, siteVisits: 0 },
      createdAt: now,
      updatedAt: now,
    };
    this.properties.unshift(dup);
    return { ...dup };
  }

  async archiveProperty(id: string): Promise<Property> {
    return this.updateStatus(id, 'Archived');
  }

  async updateStatus(id: string, status: PropertyStatus): Promise<Property> {
    await delay(400);
    const idx = this.properties.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Property not found');
    this.properties[idx] = {
      ...this.properties[idx],
      status,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.properties[idx] };
  }
}

export const propertyService: PropertyService = new MockPropertyService();
