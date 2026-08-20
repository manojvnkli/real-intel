import type { PropertyImage } from '@/lib/types';

export interface MediaService {
  uploadImage(file: File): Promise<PropertyImage>;
  uploadVideo(file: File): Promise<{ url: string; thumbnailUrl: string }>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const placeholderImages = [
  'https://images.pexels.com/photos/6980724/pexels-photo-6980724.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7546648/pexels-photo-7546648.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7166640/pexels-photo-7166640.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7195739/pexels-photo-7195739.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6903157/pexels-photo-6903157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

let imageCounter = 0;

export class MockMediaService implements MediaService {
  async uploadImage(file: File): Promise<PropertyImage> {
    await delay(800 + Math.random() * 600);
    const url =
      placeholderImages[imageCounter % placeholderImages.length] +
      `&mock=${Date.now()}`;
    imageCounter++;
    return {
      id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url,
      isCover: false,
      order: 0,
    };
  }

  async uploadVideo(file: File): Promise<{ url: string; thumbnailUrl: string }> {
    await delay(1200);
    return {
      url: `https://example.com/videos/${file.name}`,
      thumbnailUrl:
        'https://images.pexels.com/photos/11631278/pexels-photo-11631278.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    };
  }
}

export const mediaService: MediaService = new MockMediaService();
