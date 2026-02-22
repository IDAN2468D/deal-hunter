"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createPriceAlert(destinationId: string, targetPrice: number) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const alert = await prisma.priceAlert.create({
        data: {
            destinationId,
            targetPrice,
            userId: session.user.id
        }
    });

    revalidatePath("/dashboard");
    return { success: true, alert };
}

export async function getMyAlerts() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.priceAlert.findMany({
        where: { userId: session.user.id },
        include: {
            destination: {
                include: {
                    deals: {
                        orderBy: { price: 'asc' },
                        take: 1
                    }
                }
            }
        }
    });
}

/**
 * AI Triggered Search for Alerts (Mock background task)
 */
export async function checkAlertsJob() {
    // In a real app, this would be a CRON job
    const alerts = await prisma.priceAlert.findMany({
        include: { destination: { include: { deals: true } } }
    });

    const notifications = [];

    for (const alert of alerts) {
        const bestDeal = alert.destination.deals[0];
        if (bestDeal && bestDeal.price <= alert.targetPrice) {
            notifications.push({
                userId: alert.userId,
                message: `HOT! ${alert.destination.name} reached your target price of ${alert.targetPrice}! Current price: ${bestDeal.price}`,
                dealId: bestDeal.id
            });
        }
    }

    return notifications;
}

/**
 * A mock function to simulate sending a WhatsApp/SMS alert via Twilio
 * when a user's price alert drops below their target.
 */
export async function sendWhatsAppAlertMock(targetUserId: string, message: string) {
    const user = await prisma.user.findUnique({ where: { id: targetUserId } }) as unknown as { email: string | null, isPro: boolean } | null;

    if (!user) {
        return { success: false, error: 'User not found' };
    }

    if (!user.isPro) {
        console.log(`[ALERT FAILED] User ${user.email} is not a PRO subscriber. Message suppressed: "${message}"`);
        return { success: false, error: 'User is not PRO' };
    }

    console.log(`\n\n🟢 [TWILIO SMS MOCK] 🟢`);
    console.log(`Sending to User: ${user.email} (PRO Tier)`);
    console.log(`Message: ${message}`);
    console.log(`Status: Delivered`);
    console.log(`-------------------------\n`);

    return { success: true, delivered: true };
}

/**
 * Upgrades the user account to PRO.
 */
export async function toggleProSubscription() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: 'Unauthorized' };

    const user = await prisma.user.findUnique({ where: { id: session.user.id } }) as unknown as { id: string, isPro: boolean } | null;
    if (!user) return { success: false, error: 'User not found' };

    type UserUpdateDelegate = { update: (args: unknown) => Promise<unknown> };
    const p = prisma as unknown as Record<string, UserUpdateDelegate | undefined>;
    if (p.user) {
        await p.user.update({
            where: { id: user.id },
            data: { isPro: !user.isPro }
        });
    }

    revalidatePath("/");
    return { success: true, isPro: !user.isPro };
}
