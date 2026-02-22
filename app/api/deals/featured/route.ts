import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const deals = await prisma.deal.findMany({
            where: { isFeatured: true },
            take: 8,
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(deals);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
    }
}
