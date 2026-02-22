'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { GamificationSystem, POINT_VALUES } from "@/lib/gamification";

const gamification = new GamificationSystem();

/**
 * createOrderAction
 * Law of Defensive Programming: Captures userId early.
 */
export async function createOrderAction(dealId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return { success: false, error: "You must be signed in to book a deal." };

    try {
        const deal = await prisma.deal.findUnique({
            where: { id: dealId }
        });

        if (!deal) return { success: false, error: "Deal not found." };

        // 1. Create the order
        const order = await prisma.order.create({
            data: {
                userId: userId,
                dealId: deal.id,
                totalAmount: deal.price,
                currency: deal.currency,
                status: "PENDING"
            }
        });

        revalidatePath("/dashboard/orders");
        return { success: true, orderId: order.id };
    } catch (error) {
        console.error("Booking Error:", error);
        return { success: false, error: "Failed to create order. Please try again." };
    }
}

export async function processPaymentAction(orderId: string) {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("Unauthorized");

    await new Promise(resolve => setTimeout(resolve, 2000));

    const result = await prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: { id: orderId },
            data: { status: "PAID" }
        });

        await gamification.awardPoints(userId, POINT_VALUES.BOOKING, `Booking Confirmation: ${orderId}`);
        return order;
    });

    revalidatePath("/dashboard/orders");
    return { success: true, order: result };
}

export async function getMyOrders() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return [];

    return await prisma.order.findMany({
        where: { userId: userId },
        include: { deal: true },
        orderBy: { createdAt: 'desc' }
    });
}
