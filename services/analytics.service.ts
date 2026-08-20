import type { DashboardStats, PerformancePoint } from '@/lib/types';

export interface AnalyticsService {
  getDashboardStats(): Promise<DashboardStats>;
  getPerformanceData(): Promise<PerformancePoint[]>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAnalyticsService implements AnalyticsService {
  async getDashboardStats(): Promise<DashboardStats> {
    await delay(400);
    return {
      activeListings: 5,
      draftListings: 1,
      totalViews: 5506,
      leads: 114,
      siteVisits: 42,
    };
  }

  async getPerformanceData(): Promise<PerformancePoint[]> {
    await delay(500);
    return [
      { date: 'Aug 1', views: 120, leads: 5, shares: 8 },
      { date: 'Aug 5', views: 180, leads: 8, shares: 12 },
      { date: 'Aug 10', views: 240, leads: 12, shares: 15 },
      { date: 'Aug 15', views: 310, leads: 15, shares: 20 },
      { date: 'Aug 20', views: 420, leads: 22, shares: 28 },
    ];
  }
}

export const analyticsService: AnalyticsService = new MockAnalyticsService();
