"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { Deal } from "@prisma/client";

const VoteSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
    dealId: z.string().min(1, "Deal ID is required"),
    userId: z.string().min(1, "User ID is required"),
    vote: z.enum(["UPVOTE", "DOWNVOTE"]),
});

export async function castDealVote(formData: FormData) {
    try {
        const rawData = {
            roomId: formData.get("roomId"),
            dealId: formData.get("dealId"),
            userId: formData.get("userId"),
            vote: formData.get("vote"),
        };

        const validatedData = VoteSchema.parse(rawData);

        // Enforce one vote per user per deal in the room
        const existingVote = await prisma.dealVote.findUnique({
            where: {
                userId_dealId_roomId: {
                    userId: validatedData.userId,
                    dealId: validatedData.dealId,
                    roomId: validatedData.roomId,
                },
            },
        });

        if (existingVote) {
            // Update vote if it exists
            await prisma.dealVote.update({
                where: { id: existingVote.id },
                data: { vote: validatedData.vote },
            });
        } else {
            // Create new vote
            await prisma.dealVote.create({
                data: {
                    userId: validatedData.userId,
                    dealId: validatedData.dealId,
                    roomId: validatedData.roomId,
                    vote: validatedData.vote,
                },
            });
        }

        revalidatePath(`/squads/${validatedData.roomId}`);
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("castDealVote Error:", error);
        return { success: false, error: "Failed to cast vote." };
    }
}

export async function getSquadRoomLeaderboard(roomId: string) {
    try {
        if (!roomId) throw new Error("Room ID is required");

        const votes = await prisma.dealVote.findMany({
            where: { roomId },
            include: { deal: true },
        });

        // Aggregate votes by deal
        const dealScores = new Map<string, { deal: Deal; score: number }>();

        for (const v of votes) {
            if (!dealScores.has(v.dealId)) {
                dealScores.set(v.dealId, { deal: v.deal, score: 0 });
            }
            const current = dealScores.get(v.dealId);
            if (current) {
                current.score += v.vote === "UPVOTE" ? 1 : -1;
            }
        }

        // Sort by score descending
        const sortedDeals = Array.from(dealScores.values()).sort((a, b) => b.score - a.score);

        return { success: true, deals: sortedDeals };
    } catch (error: unknown) {
        console.error("getSquadRoomLeaderboard Error:", error);
        return { success: false, error: "Failed to get leaderboard.", deals: [] };
    }
}

const BudgetSplitSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"),
    totalCost: z.number().min(0, "Total cost cannot be negative"),
});

export async function calculateBudgetSplit(roomId: string, totalCost: number) {
    try {
        const validatedData = BudgetSplitSchema.parse({ roomId, totalCost });

        const room = await prisma.squadRoom.findUnique({
            where: { id: validatedData.roomId },
            include: {
                members: {
                    include: { user: true },
                },
            },
        });

        if (!room) {
            return { success: false, error: "Room not found." };
        }

        const memberCount = room.members.length;
        if (memberCount === 0) {
            return { success: false, error: "No members in this room." };
        }

        // Basic calculation: evenly split for now, but we can factor in points later
        const baseShare = validatedData.totalCost / memberCount;

        // We can simulate point usage: 1 point = $0.01 discount, max 20% of share
        const splitDetails = room.members.map((member) => {
            const user = member.user;
            const pointDiscount = Math.min((user?.points ?? 0) * 0.01, baseShare * 0.2);
            const finalShare = baseShare - pointDiscount;

            return {
                userId: user?.id ?? "unknown",
                name: user?.name ?? "Unknown",
                baseShare,
                pointDiscount,
                finalShare,
            };
        });

        return { success: true, splitDetails };

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("calculateBudgetSplit Error:", error);
        return { success: false, error: "Failed to calculate budget.", splitDetails: [] };
    }
}
