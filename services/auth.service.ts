import type { User } from '@/lib/types';
import { mockUser, demoCredentials } from '@/lib/mock/users';

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  register(data: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
}

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  city: string;
  agencyName: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAuthService implements AuthService {
  async login(email: string, password: string): Promise<User> {
    await delay(800);
    if (
      email.toLowerCase() !== demoCredentials.email ||
      password !== demoCredentials.password
    ) {
      throw new Error('Invalid email or password. Try demo@realestate.com / Demo@123');
    }
    return mockUser;
  }

  async register(data: RegisterInput): Promise<User> {
    await delay(1000);
    return {
      ...mockUser,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      agencyName: data.agencyName,
    };
  }

  async logout(): Promise<void> {
    await delay(200);
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(100);
    return mockUser;
  }

  async requestPasswordReset(email: string): Promise<void> {
    await delay(800);
    if (!email.includes('@')) throw new Error('Please enter a valid email address.');
  }

  async resetPassword(_token: string, _newPassword: string): Promise<void> {
    await delay(800);
  }
}

export const authService: AuthService = new MockAuthService();
