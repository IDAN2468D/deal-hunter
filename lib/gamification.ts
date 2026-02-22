import { prisma } from '@/lib/prisma';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from 'zod';

export const POINT_VALUES = {
    BOOKING: 500,
    SQUAD_JOIN: 100,
    DAILY_LOGIN: 50,
    SEARCH: 10,
    REVIEW_VOTE: 20
};

export class GamificationSystem {
    /**
     * Awards points to a user and potentially levels them up.
     */
    async awardPoints(userId: string, amount: number, reason: string) {
        return await prisma.$transaction(async (tx) => {
            // 1. Log transaction
            await tx.pointTransaction.create({
                data: { userId, amount, reason }
            });

            // 2. Check if user exists
            const existingUser = await tx.user.findUnique({ where: { id: userId } });
            if (!existingUser) {
                console.warn(`GAMIFICATION: User ${userId} not found. Skipping points.`);
                return { points: 0, levelUp: false };
            }

            // 3. Update user total
            const user = await tx.user.update({
                where: { id: userId },
                data: {
                    points: { increment: amount }
                }
            });

            // 4. Level up logic (Level = Square root of points / 5)
            const newLevel = Math.max(1, Math.floor(Math.sqrt(user.points) / 5));
            const currentLevel = existingUser.level ?? 1;

            if (newLevel > currentLevel) {
                await tx.user.update({
                    where: { id: userId },
                    data: { level: newLevel }
                });
                return { points: user.points, levelUp: true, newLevel };
            }

            return { points: user.points, levelUp: false };
        });
    }

    async getUserStats(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                points: true,
                level: true,
                pointHistory: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        const currentLevel = user?.level ?? 1;
        const nextLevelPoints = Math.pow((currentLevel + 1) * 5, 2);

        return {
            points: user?.points ?? 0,
            level: currentLevel,
            pointHistory: user?.pointHistory ?? [],
            nextLevelPoints,
            progress: Math.min(100, ((user?.points || 0) / nextLevelPoints) * 100)
        };
    }

    async checkAndAwardBadges(userId: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { userBadges: { include: { badge: true } }, orders: true }
        });

        if (!user) return [];

        const earnedBadgeIds = new Set(user.userBadges.map((ub: { badgeId: string }) => ub.badgeId));
        const badgesToAward = [];

        // Seed badges dynamically if they do not exist
        const ensureBadge = async (name: string, description: string, iconUrl: string, category: string) => {
            let badge = await prisma.badge.findUnique({ where: { name } });
            if (!badge) {
                badge = await prisma.badge.create({ data: { name, description, iconUrl, category } });
            }
            return badge;
        };

        const firstPurchaseBadge = await ensureBadge("First Purchase", "Made your first deal booking! 👑", "🛍️", "USAGE");
        if (user.orders.length > 0 && !earnedBadgeIds.has(firstPurchaseBadge.id)) {
            badgesToAward.push(firstPurchaseBadge);
        }

        const highRollerBadge = await ensureBadge("High Roller", "Accumulated over 1000 points 🌟", "💎", "ACHIEVEMENT");
        if (user.points >= 1000 && !earnedBadgeIds.has(highRollerBadge.id)) {
            badgesToAward.push(highRollerBadge);
        }

        const currentHour = new Date().getHours();
        const nightHunterBadge = await ensureBadge("Night Hunter", "Hunting for deals past 1 AM 🦉", "🌙", "TIME");
        if (currentHour >= 1 && currentHour <= 5 && !earnedBadgeIds.has(nightHunterBadge.id)) {
            badgesToAward.push(nightHunterBadge);
        }

        for (const badge of badgesToAward) {
            await prisma.userBadge.create({
                data: {
                    userId,
                    badgeId: badge.id
                }
            });
            await this.awardPoints(userId, 50, `Badge Unlocked: ${badge.name}`);
        }

        return badgesToAward;
    }

    /**
     * The Critic & Architect: Analyzes the DB Gamification Economy and adjusts prices dynamically
     * to prevent point inflation or deflation.
     */
    async analyzeEconomyHealth() {
        console.log("GAMIFICATION: Analyzing Economy Health...");

        // 1. Gather Economic Indicators
        const totalUsers = await prisma.user.count();
        const users = await prisma.user.findMany({ select: { points: true } });
        const totalPoints = users.reduce((acc, u) => acc + u.points, 0);
        const avgPoints = totalUsers > 0 ? totalPoints / totalUsers : 0;

        const recentTransactions = await prisma.pointTransaction.count({
            where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
        });

        // 2. Prepare Context for AI
        const prompt = `
            You are 'The Critic' agent managing an artificial Game Economy.
            Analyze the current state of the platform points system:
            
            - Total Users: ${totalUsers}
            - Total Points in Circulation: ${totalPoints}
            - Average Points Per User: ${avgPoints.toFixed(2)}
            - Point Transactions in last 24h: ${recentTransactions}
            
            Our target average points per user is between 1000 and 5000.
            If the average points exceed 5000, we have INFLATION. You must create an expensive "Epic Quest" to burn points.
            If the average points are below 1000, we have DEFLATION. Create a very cheap quest with a high reward to encourage engagement.
            If stable, output STABLE.
            
            You must return strictly typed JSON according to the schema.
        `;

        const EconomySchema = z.object({
            state: z.enum(["INFLATION", "DEFLATION", "STABLE"]),
            actionTaken: z.string().describe("What action was taken, e.g., 'Generated 10000pt Quest'"),
            quest: z.object({
                title: z.string(),
                description: z.string(),
                pointCost: z.number(), // High if inflation, low if deflation
                reward: z.string(),
            }).nullable().describe("Nullable if STABLE")
        });

        // 3. Generate AI Decision
        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: EconomySchema,
            prompt
        });

        const decision = result.object;

        // 4. Enforce the Output
        if (decision.state !== 'STABLE' && decision.quest) {
            type DynamicQuestDelegate = { create: (args: { data: unknown }) => Promise<unknown> };
            const p = prisma as unknown as Record<string, DynamicQuestDelegate | undefined>;
            if (p.dynamicQuest) {
                await p.dynamicQuest.create({
                    data: {
                        title: decision.quest.title,
                        description: decision.quest.description,
                        pointCost: decision.quest.pointCost,
                        reward: decision.quest.reward,
                        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
                    }
                });
            }
        }

        return decision;
    }
}
