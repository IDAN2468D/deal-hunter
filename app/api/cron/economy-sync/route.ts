import { NextResponse } from 'next/server';
import { GamificationSystem } from '@/lib/gamification';

/**
 * Endpoint for the Dynamic Economy Balancer CRON job.
 * Vercel CRON can hit this daily to auto-adjust inflation.
 */
export async function GET(request: Request) {
    // Basic authorization check (e.g., matching a CRON_SECRET)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV !== 'development') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        const system = new GamificationSystem();
        const analysis = await system.analyzeEconomyHealth();

        return NextResponse.json({
            success: true,
            message: "Economy synced successfully",
            state: analysis.state,
            action: analysis.actionTaken,
            questGenerated: analysis.quest ?? null
        });
    } catch (e: unknown) {
        console.error("Economy Sync Error:", e);
        return NextResponse.json({ success: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
