'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { PriceAlertSchema, type PriceAlertInput } from '@/lib/validations';

/**
 * Builder: createPriceAlert
 * Validates input with Sentinel's PriceAlertSchema, then upserts to prevent duplicates.
 * Uses findFirst + create/update since Prisma MongoDB doesn't support compound unique in upsert.
 */
export async function createPriceAlert(data: PriceAlertInput): Promise<{
    success: boolean;
    error?: string;
}> {
    const parsed = PriceAlertSchema.safeParse(data);
    if (!parsed.success) {
        const flat = parsed.error.flatten();
        const firstMsg = flat.formErrors[0] ?? Object.values(flat.fieldErrors).flat()[0] ?? 'Invalid input';
        return { success: false, error: firstMsg };
    }

    const { userId, destinationId, targetPrice } = parsed.data;

    try {
        // Upsert pattern: find existing alert for this user+destination
        const existing = await prisma.priceAlert.findFirst({
            where: { userId, destinationId },
        });

        if (existing) {
            await prisma.priceAlert.update({
                where: { id: existing.id },
                data: { targetPrice },
            });
        } else {
            await prisma.priceAlert.create({
                data: { userId, destinationId, targetPrice },
            });
        }

        revalidatePath('/price-watch');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Failed to create alert: ${message}` };
    }
}

/**
 * Builder: getUserAlerts
 * Returns all active price alerts for a user, with destination data included.
 */
export async function getUserAlerts(userId: string): Promise<{
    success: boolean;
    data?: Array<{
        id: string;
        targetPrice: number;
        createdAt: Date;
        destination: {
            id: string;
            name: string;
            country: string;
            imageUrl: string;
            slug: string;
        };
    }>;
    error?: string;
}> {
    if (!userId) return { success: false, error: 'userId is required' };

    try {
        const alerts = await prisma.priceAlert.findMany({
            where: { userId },
            include: {
                destination: {
                    select: {
                        id: true,
                        name: true,
                        country: true,
                        imageUrl: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return { success: true, data: alerts };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Failed to fetch alerts: ${message}` };
    }
}

/**
 * Builder: deletePriceAlert
 * Deletes an alert, but only if the requesting userId owns it (ownership check).
 */
export async function deletePriceAlert(
    alertId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    if (!alertId || !userId) {
        return { success: false, error: 'alertId and userId are required' };
    }

    try {
        // Sentinel: Ownership check — verify the alert belongs to this user
        const alert = await prisma.priceAlert.findFirst({
            where: { id: alertId, userId },
        });

        if (!alert) {
            return { success: false, error: 'Alert not found or unauthorized' };
        }

        await prisma.priceAlert.delete({ where: { id: alertId } });
        revalidatePath('/price-watch');
        return { success: true };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Failed to delete alert: ${message}` };
    }
}

/**
 * Builder: incrementWatchCount
 * Increments the watchCount on a Deal to show social proof ("X hunters watching").
 * NOTE: watchCount was added to schema.prisma. Run `prisma db push` to sync the DB
 * and regenerate the client types. Until then, we cast via unknown to bypass the type check.
 */
export async function incrementWatchCount(
    dealId: string
): Promise<{ success: boolean; newCount?: number; error?: string }> {
    if (!dealId) return { success: false, error: 'dealId is required' };

    try {
        // Cast through unknown until Prisma client is regenerated after `prisma db push`
        const updated = await (prisma.deal.update as (args: unknown) => Promise<Record<string, unknown>>)({
            where: { id: dealId },
            data: { watchCount: { increment: 1 } },
            select: { watchCount: true },
        });

        return { success: true, newCount: updated['watchCount'] as number };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return { success: false, error: `Failed to increment watch count: ${message}` };
    }
}

/**
 * Architect: analyzePriceTrend
 * Uses Gemini AI to provide a "Price Confidence" report.
 * Analyzes market data (simulated) to tell users if it's a good time to book.
 */
export async function analyzePriceTrend(destination: string, currentPrice: number) {
    // We import this here to avoid circular dependencies if any exist, 
    // but primarily to keep the action atomic.
    const { tryMultipleModels } = await import('@/lib/gemini');

    const prompt = `
        As a pro travel pricing analyst for DealHunter, analyze this deal:
        Destination: ${destination}
        Current Price: $${currentPrice.toLocaleString()}
        
        Provide a trend analysis in JSON format ONLY:
        {
          "recommendation": "Short 1-sentence advice (e.g., 'Book now, prices rising' or 'Wait, historical lows coming')",
          "target": "Numeric recommended target price to set an alert at",
          "confidence": "HIGH, MEDIUM, or LOW"
        }
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error("AI analysis failed");

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        return {
            recommendation: data.recommendation || "Market is stable. Set an alert for dips.",
            target: Number(data.target) || Math.floor(currentPrice * 0.9),
            confidence: data.confidence || "MEDIUM"
        };
    } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error("Price Analysis Error:", error);
        return {
            recommendation: "Unable to sync with live market pulse. Set an alert to be safe.",
            target: Math.floor(currentPrice * 0.95),
            confidence: "LOW" as const
        };
    }
}

/**
 * 🕵️ The Architect: predictPriceEvolution
 * Generates a 7-day predictive price trend using AI.
 */
export async function predictPriceEvolution(destination: string, currentPrice: number) {
    const { tryMultipleModels } = await import('@/lib/gemini');

    const prompt = `
        As a DealHunter AI Quant, predict the 7-day price evolution for:
        Destination: ${destination}
        Current Price: $${currentPrice}

        Generate a JSON object with 7 data points representing the next 7 days.
        Return ONLY valid JSON:
        {
            "points": [
                {"day": "Day 1", "price": number},
                {"day": "Day 2", "price": number},
                ...
                {"day": "Day 7", "price": number}
            ],
            "summary": "Short trend summary",
            "risk": "LOW" | "MEDIUM" | "HIGH"
        }
        Apply realistic market volatility (2-8% fluctuations).
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error("AI prediction failed");

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        return {
            success: true,
            data: {
                points: data.points as { day: string; price: number }[],
                summary: data.summary as string,
                risk: data.risk as 'LOW' | 'MEDIUM' | 'HIGH'
            }
        };
    } catch (error) {
        // Fallback mock data if AI fails
        return {
            success: false,
            data: {
                points: Array.from({ length: 7 }, (_, i) => ({
                    day: `Day ${i + 1}`,
                    price: currentPrice + (Math.random() * 40 - 20)
                })),
                summary: "Historical stability expected.",
                risk: "LOW" as const
            }
        };
    }
}
