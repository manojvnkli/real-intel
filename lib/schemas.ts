import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .regex(/^[+]?[\d\s-]+$/, 'Please enter a valid phone number'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
    city: z.string().min(2, 'City is required'),
    agencyName: z.string().min(2, 'Agency name is required'),
    agreeTerms: z
      .boolean()
      .refine((v) => v === true, 'You must agree to the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  propertyType: z.string().min(1, 'Property type is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  area: z.string().min(2, 'Area is required'),
  locality: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Pincode must be 6 digits'),
  landmark: z.string().optional(),
  bhk: z.coerce.number().optional(),
  bathrooms: z.coerce.number().optional(),
  balconies: z.coerce.number().optional(),
  carpetArea: z.coerce.number().optional(),
  builtUpArea: z.coerce.number().optional(),
  plotArea: z.coerce.number().optional(),
  floor: z.coerce.number().optional(),
  totalFloors: z.coerce.number().optional(),
  facing: z.string().optional(),
  ageOfProperty: z.coerce.number().optional(),
  furnishing: z.string().optional(),
  parking: z.coerce.number().optional(),
  price: z.coerce.number().min(1, 'Price is required'),
  maintenance: z.coerce.number().optional(),
  negotiable: z.boolean().optional(),
  deposit: z.coerce.number().optional(),
  possession: z.string().optional(),
  reraNumber: z.string().optional(),
  ownership: z.string().optional(),
  availability: z.string().optional(),
  brokerage: z.string().optional(),
  notes: z.string().optional(),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  agencyName: z.string().min(2, 'Agency name is required'),
  phone: z.string().min(10, 'Valid phone required'),
  whatsapp: z.string().min(10, 'Valid WhatsApp number required'),
  email: z.string().email('Valid email required'),
  city: z.string().min(2, 'City is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  reraNumber: z.string().min(1, 'RERA number is required'),
  experienceYears: z.coerce.number().min(0, 'Must be 0 or more'),
  specialization: z.array(z.string()),
  areasServed: z.array(z.string()),
  publicUsername: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens'),
});

export const agencySchema = z.object({
  name: z.string().min(2, 'Agency name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  phone: z.string().min(10, 'Valid phone required'),
  email: z.string().email('Valid email required'),
  website: z.string().optional(),
  city: z.string().min(2, 'City is required'),
});

export const collectionSchema = z.object({
  name: z.string().min(2, 'Collection name is required'),
  description: z.string().min(5, 'Description is required'),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type PropertyValues = z.infer<typeof propertySchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
export type AgencyValues = z.infer<typeof agencySchema>;
export type CollectionValues = z.infer<typeof collectionSchema>;
