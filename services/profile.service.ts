import type { Profile, UpdateProfileInput } from '@/lib/types';
import { mockProfile } from '@/lib/mock/users';

export interface ProfileService {
  getProfile(): Promise<Profile>;
  updateProfile(data: UpdateProfileInput): Promise<Profile>;
  getProfileByUsername(username: string): Promise<Profile | null>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockProfileService implements ProfileService {
  private profile: Profile = { ...mockProfile };

  async getProfile(): Promise<Profile> {
    await delay(400);
    return { ...this.profile };
  }

  async updateProfile(data: UpdateProfileInput): Promise<Profile> {
    await delay(600);
    this.profile = {
      ...this.profile,
      ...data,
      publicSiteUrl: `estatehub.in/${data.publicUsername}`,
    };
    return { ...this.profile };
  }

  async getProfileByUsername(username: string): Promise<Profile | null> {
    await delay(400);
    if (this.profile.publicUsername === username) return { ...this.profile };
    return null;
  }
}

export const profileService: ProfileService = new MockProfileService();
