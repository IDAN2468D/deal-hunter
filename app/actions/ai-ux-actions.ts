"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SwipeSchema = z.object({
    userId: z.string().min(1, "User ID is required"),
    dealId: z.string().min(1, "Deal ID is required"),
    action: z.enum(["LIKE", "DISCARD"]),
});

export async function recordDealSwipe(formData: FormData) {
    try {
        const rawData = {
            userId: formData.get("userId"),
            dealId: formData.get("dealId"),
            action: formData.get("action"),
        };

        const validatedData = SwipeSchema.parse(rawData);

        // Get the user's preference record, or create if it doesn't exist
        const pref = await prisma.userPreference.findUnique({
            where: { userId: validatedData.userId },
        });

        if (!pref) {
            await prisma.userPreference.create({
                data: {
                    userId: validatedData.userId,
                    likedDealIds: validatedData.action === "LIKE" ? [validatedData.dealId] : [],
                    discardedDealIds: validatedData.action === "DISCARD" ? [validatedData.dealId] : [],
                },
            });
        } else {
            // Update existing
            if (validatedData.action === "LIKE") {
                if (!pref.likedDealIds.includes(validatedData.dealId)) {
                    await prisma.userPreference.update({
                        where: { id: pref.id },
                        data: {
                            likedDealIds: { push: validatedData.dealId },
                        },
                    });

                    // Trigger background task to extract vibes from the liked deal asynchronously
                    // In a real app, this might be offloaded to a queue (e.g. Inngest)
                    extractVibesFromDeal(validatedData.userId, validatedData.dealId).catch(err => {
                        console.error("Failed background vibe extraction:", err);
                    });
                }
            } else {
                if (!pref.discardedDealIds.includes(validatedData.dealId)) {
                    await prisma.userPreference.update({
                        where: { id: pref.id },
                        data: {
                            discardedDealIds: { push: validatedData.dealId },
                        },
                    });
                }
            }
        }

        return { success: true };
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("recordDealSwipe Error:", error);
        return { success: false, error: "Failed to record swipe." };
    }
}

// Internal asynchronous helper
async function extractVibesFromDeal(userId: string, dealId: string) {
    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) return;

    // Placeholder for the actual Gemini API call
    // We simulate extracting "Beach", "Luxury", etc. from the deal title/flight data
    console.log(`[AI Worker] Analyzing Deal ${deal.title} to extract vibes for User ${userId}`);

    const extractedVibes = ["Beach", "Relaxation"]; // Mock

    const pref = await prisma.userPreference.findUnique({ where: { userId } });

    if (pref) {
        // Add new vibes to the array
        const currentVibes = new Set(pref.preferredVibes);
        extractedVibes.forEach(v => currentVibes.add(v));

        await prisma.userPreference.update({
            where: { id: pref.id },
            data: {
                preferredVibes: Array.from(currentVibes)
            }
        });
    }
}
