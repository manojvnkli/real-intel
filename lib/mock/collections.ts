import type { Collection } from '@/lib/types';

export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    slug: 'hyderabad-villas',
    name: 'Hyderabad Villas',
    description: 'Premium villa listings across Hyderabad neighborhoods.',
    propertyIds: ['prop-2', 'prop-3'],
    brokerId: 'user-1',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'col-2',
    slug: 'kapra-properties',
    name: 'Kapra Properties',
    description: 'All active listings in and around Kapra.',
    propertyIds: ['prop-1'],
    brokerId: 'user-1',
    createdAt: '2024-06-05T10:00:00Z',
  },
  {
    id: 'col-3',
    slug: 'budget-flats',
    name: 'Budget Flats',
    description: 'Affordable apartments under 1 crore for first-time buyers.',
    propertyIds: ['prop-4'],
    brokerId: 'user-1',
    createdAt: '2024-07-01T10:00:00Z',
  },
];
