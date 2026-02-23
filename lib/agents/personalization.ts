import { prisma } from '@/lib/prisma';
import { tryMultipleModels } from '@/lib/gemini';
import { Deal } from '@prisma/client';

export class PersonalizationAgent {
    /**
     * Recommends deals based on user preferences and search history.
     */
    async recommendDeals(userId: string): Promise<Deal[]> {
        // 1. Fetch user data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                preferences: true,
                searchLogs: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                }
            }
        });

        if (!user) return [];

        // 2. Extract context for AI
        type UserWithIncludes = typeof user & {
            preferences?: { preferredVibes: string[] } | null;
            searchLogs: { query: string }[];
        };
        const u = user as unknown as UserWithIncludes;
        const context = {
            preferences: u.preferences,
            recentQueries: u.searchLogs.map((log) => log.query),
            points: u.points,
            level: u.level
        };

        // 3. Fetch current exciting deals
        const availableDeals = await prisma.deal.findMany({
            where: { isFeatured: true },
            take: 20
        });

        if (availableDeals.length === 0) return [];

        // 4. AI decision logic
        const prompt = `
            You are the DealHunter Personalization Expert.
            Based on the following user profile and available deals, select the TOP 3 deals this user would love.
            
            User Context:
            - Preferred Vibes: ${u.preferences?.preferredVibes.join(', ') || 'Any'}
            - Recent Searches: ${context.recentQueries.join(' | ')}
            - User Level: ${u.level}
            
            Available Deals:
            ${availableDeals.map(d => `ID: ${d.id} | Title: ${d.title} | Price: ${d.price} | Type: ${d.type}`).join('\n')}
            
            Return ONLY a valid JSON array of the Deal IDs.
            Example: ["ID_1", "ID_2"]
        `;

        try {
            const rawOutput = await tryMultipleModels(prompt, ['gemini-2.5-flash', 'gemini-2.5-flash']);
            if (!rawOutput) return availableDeals.slice(0, 3);

            const cleanJson = rawOutput.replace(/```json|```/g, '').trim();
            const recommendedIds: string[] = JSON.parse(cleanJson);

            // Fetch and return the actual deal objects
            return await prisma.deal.findMany({
                where: { id: { in: recommendedIds } }
            });

        } catch (error) {
            console.error("PersonalizationAgent Error:", error);
            return availableDeals.slice(0, 3); // Fallback to featured
        }
    }

    /**
     * Updates user preferences based on recent behavior.
     */
    async updatePreferences(userId: string, newVibe: string): Promise<void> {
        await prisma.userPreference.upsert({
            where: { userId },
            update: {
                preferredVibes: {
                    push: newVibe
                }
            },
            create: {
                userId,
                preferredVibes: [newVibe]
            }
        });
    }
}
