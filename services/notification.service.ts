import type { AppNotification } from '@/lib/types';
import { mockNotifications } from '@/lib/mock/notifications';

export interface NotificationService {
  getNotifications(): Promise<AppNotification[]>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  getUnreadCount(): Promise<number>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockNotificationService implements NotificationService {
  private notifications: AppNotification[] = [...mockNotifications];

  async getNotifications(): Promise<AppNotification[]> {
    await delay(300);
    return [...this.notifications];
  }

  async markAsRead(id: string): Promise<void> {
    await delay(200);
    const n = this.notifications.find((n) => n.id === id);
    if (n) n.read = true;
  }

  async markAllAsRead(): Promise<void> {
    await delay(300);
    this.notifications.forEach((n) => (n.read = true));
  }

  async getUnreadCount(): Promise<number> {
    await delay(100);
    return this.notifications.filter((n) => !n.read).length;
  }
}

export const notificationService: NotificationService = new MockNotificationService();
