'use server';

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

export const fetchFeedDeals = unstable_cache(
    async (page: number = 1, limit: number = 10) => {
        try {
            const deals = await prisma.deal.findMany({
                where: {
                    isFeatured: true,
                },
                take: limit,
                skip: (page - 1) * limit,
                include: {
                    destination: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return { success: true, data: deals };
        } catch (error) {
            console.error('Fetch Feed Deals Error:', error);
            return { success: false, error: 'Failed to fetch deals feed' };
        }
    },
    ['feed-deals'],
    { revalidate: 3600, tags: ['deals'] }
);

export async function fetchMonthDeals(month: string) {
    try {
        // month is "YYYY-MM"
        const startDate = new Date(`${month}-01T00:00:00Z`);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

        const deals = await prisma.deal.findMany({
            where: {
                startDate: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                price: true,
                startDate: true
            }
        });

        // Group by day for the heatmap
        const heatmap: Record<string, number> = {};
        deals.forEach(deal => {
            const day = deal.startDate.toISOString().split('T')[0];
            if (!heatmap[day] || deal.price < heatmap[day]) {
                heatmap[day] = deal.price; // Show cheapest on that day
            }
        });

        return { success: true, data: heatmap };
    } catch (error) {
        console.error('Fetch Month Deals Error:', error);
        return { success: false, error: 'Failed to fetch monthly deals matrix' };
    }
}
