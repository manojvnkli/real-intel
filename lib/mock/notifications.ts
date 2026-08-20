import type { AppNotification } from '@/lib/types';

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'enquiry',
    title: 'New enquiry received',
    message: 'A buyer is interested in 3 BHK Apartment in Kapra.',
    read: false,
    createdAt: '2024-08-19T14:30:00Z',
    link: '/listings/prop-1',
  },
  {
    id: 'notif-2',
    type: 'views',
    title: 'Your listing received 25 views',
    message: '4 BHK Villa in Kompally is trending this week.',
    read: false,
    createdAt: '2024-08-19T10:15:00Z',
    link: '/listings/prop-2',
  },
  {
    id: 'notif-3',
    type: 'site_visit',
    title: 'Site visit requested',
    message: 'A buyer wants to visit Villa in Bongloor on Saturday.',
    read: false,
    createdAt: '2024-08-18T16:00:00Z',
    link: '/listings/prop-3',
  },
  {
    id: 'notif-4',
    type: 'listing_published',
    title: 'Listing published successfully',
    message: 'Your property "2 BHK Apartment in Sainikpuri" is now live.',
    read: true,
    createdAt: '2024-08-18T11:20:00Z',
    link: '/listings/prop-4',
  },
  {
    id: 'notif-5',
    type: 'enquiry',
    title: 'New enquiry received',
    message: 'Someone enquired about the Office Space in Hitech City.',
    read: true,
    createdAt: '2024-08-17T09:00:00Z',
    link: '/listings/prop-7',
  },
];
