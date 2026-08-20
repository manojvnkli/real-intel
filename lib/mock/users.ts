import type { User, Profile } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  fullName: 'Manoj Sharma',
  email: 'demo@realestate.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  city: 'Hyderabad',
  agencyName: 'EstateHub Realty',
  bio: 'Independent real estate consultant helping families find their dream home in Hyderabad.',
  avatarUrl:
    'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
  createdAt: '2024-01-15T10:00:00Z',
};

export const mockProfile: Profile = {
  userId: 'user-1',
  fullName: 'Manoj Sharma',
  agencyName: 'EstateHub Realty',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  email: 'demo@realestate.com',
  city: 'Hyderabad',
  bio: 'Independent real estate consultant with over a decade of experience helping families find their dream home in Hyderabad. Specializing in residential properties across East and North Hyderabad.',
  avatarUrl:
    'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
  reraNumber: 'RE/PR/1234/2023',
  experienceYears: 12,
  specialization: ['Residential Sales', 'Luxury Villas', 'Investment Properties', 'Plot Transactions'],
  areasServed: ['Kapra', 'Sainikpuri', 'Kompally', 'Medchal', 'ECIL', 'Bongloor'],
  publicUsername: 'manoj',
  publicSiteUrl: 'estatehub.in/manoj',
};

export const demoCredentials = {
  email: 'demo@realestate.com',
  password: 'Demo@123',
};
