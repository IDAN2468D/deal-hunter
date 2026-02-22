import { prisma } from '@/lib/prisma';
import { AnalyticsView } from './AnalyticsView';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'CENTRAL INTELLIGENCE — DealHunter Lumina',
    description: 'Real-time global deal telemetry and predictive market analysis.',
};

export default async function AnalyticsPage() {
    // ── Parallel DB queries ──
    const [deals, destinations, searchLogs, priceAlerts] = await Promise.all([
        prisma.deal.findMany({ include: { destination: true }, orderBy: { createdAt: 'desc' } }),
        prisma.destination.findMany({ orderBy: { popularityScore: 'desc' }, take: 6 }),
        prisma.searchLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20 }),
        prisma.priceAlert.findMany(),
    ]);

    // ── Derived stats ──
    const totalSavings = deals.reduce((acc, d) => acc + (d.originalPrice - d.price), 0);
    const avgDiscount = deals.length > 0
        ? Math.round(deals.reduce((acc, d) => acc + ((d.originalPrice - d.price) / d.originalPrice) * 100, 0) / deals.length)
        : 0;
    const hotDeals = deals.filter(d => d.aiRating === 'SUPER_HOT').length;
    const completedSearches = searchLogs.filter(s => s.status === 'COMPLETED').length;
    const successRate = searchLogs.length > 0 ? Math.round((completedSearches / searchLogs.length) * 100) : 0;

    // Top destinations by deals
    const destDealCount = destinations.map(dest => ({
        ...dest,
        dealCount: deals.filter(d => d.destinationId === dest.id).length,
        avgPrice: (() => {
            const dDeals = deals.filter(d => d.destinationId === dest.id);
            return dDeals.length > 0 ? Math.round(dDeals.reduce((a, d) => a + d.price, 0) / dDeals.length) : 0;
        })(),
    }));

    // Search status breakdown
    const searchByStatus = {
        COMPLETED: searchLogs.filter(s => s.status === 'COMPLETED').length,
        PENDING: searchLogs.filter(s => s.status === 'PENDING').length,
        FAILED: searchLogs.filter(s => s.status === 'FAILED').length,
    };

    const stats = {
        totalSavings,
        avgDiscount,
        hotDeals,
        completedSearches,
        successRate,
        searchByStatus,
        destDealCount,
    };

    return (
        <AnalyticsView
            deals={deals}
            destinations={destinations}
            searchLogs={searchLogs}
            priceAlerts={priceAlerts}
            stats={stats}
        />
    );
}
