import { Deal, Destination, SearchLog, PriceAlert } from '@prisma/client';

export interface AnalyticsStats {
    totalSavings: number;
    avgDiscount: number;
    hotDeals: number;
    completedSearches: number;
    successRate: number;
    searchByStatus: {
        COMPLETED: number;
        PENDING: number;
        FAILED: number;
    };
    destDealCount: (Destination & {
        dealCount: number;
        avgPrice: number;
    })[];
}

export interface AnalyticsData {
    deals: (Deal & { destination: Destination | null })[];
    destinations: Destination[];
    searchLogs: SearchLog[];
    priceAlerts: PriceAlert[];
    stats: AnalyticsStats;
}

export interface PredictionPoint {
    day: string;
    price: number;
}

export interface PricePrediction {
    points: PredictionPoint[];
    summary: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
}
