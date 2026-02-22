import {
    Deal as PrismaDeal,
    Destination as PrismaDestination,
    SearchLog as PrismaSearchLog,
    PriceAlert as PrismaPriceAlert,
    Itinerary as PrismaItinerary,
    Prisma
} from '@prisma/client';

// Helper to handle JSON plan typing
export type ItineraryPlan = {
    day: number;
    activities: {
        time: string;
        description: string;
        location?: string;
    }[];
}[];

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
    destDealCount: (PrismaDestination & {
        dealCount: number;
        avgPrice: number;
    })[];
}

export interface AnalyticsData {
    deals: (PrismaDeal & { destination: PrismaDestination | null })[];
    destinations: PrismaDestination[];
    searchLogs: PrismaSearchLog[];
    priceAlerts: PrismaPriceAlert[];
    stats: AnalyticsStats;
}

export type ItineraryWithDestination = PrismaItinerary & {
    destination: PrismaDestination | null;
};

export interface PredictionPoint {
    day: string;
    price: number;
}

export interface PricePrediction {
    points: PredictionPoint[];
    summary: string;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
}

