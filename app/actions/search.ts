'use server';

import { prisma } from '@/lib/prisma';
import { Orchestrator } from '@/lib/agents/orchestrator';
import { SearchQuerySchema, SENTINEL_ERRORS } from '@/lib/validations';
import { SearchStatus } from '@prisma/client';
import { GamificationSystem, POINT_VALUES } from '@/lib/gamification';

const gamification = new GamificationSystem();

/**
 * performAgenticSearch: The central Server Action for decomposing travel queries.
 * Bridges the UI, Gemini AI, and MongoDB persistence.
 */
export async function performAgenticSearch(query: string, userId: string) {
    // 1. Sentinel Layer: Validation (Law of Defensive Programming)
    // We update this to handle the new fuzzy search capabilities
    const validation = SearchQuerySchema.safeParse({
        destination: query.length > 2 ? query : "Explore",
        budget: 500, // Default for orchestration if not found in query
        fuzzyDates: query.toLowerCase().includes('in ') || query.toLowerCase().includes('month')
    });

    let searchLogId: string | null = null;

    try {
        // 2. Persistence (Start): Status PENDING
        const log = await prisma.searchLog.create({
            data: {
                query,
                userId,
                status: 'PENDING',
                agentModel: 'gemini-1.5-flash'
            }
        });
        searchLogId = log.id;

        // 3. Orchestration: Call Gemini
        const orchestrator = new Orchestrator();
        const tasks = await orchestrator.searchDeals(query);

        // 4. Persistence (End): Success Case
        await prisma.searchLog.update({
            where: { id: searchLogId },
            data: {
                status: 'COMPLETED',
                agentTasks: {
                    create: tasks.map(task => {
                        // Handle "FLEXIBLE" dates for Prisma DateTime fields
                        const isFlexibleStart = task.startDate === 'FLEXIBLE';
                        const isFlexibleEnd = task.endDate === 'FLEXIBLE';

                        // Extract month from requirements if flexible
                        const monthReq = task.requirements.find(r => r.startsWith('month:'));
                        const month = monthReq ? monthReq.split(':')[1] : null;

                        let startDate = new Date();
                        let endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

                        if (isFlexibleStart && month) {
                            startDate = new Date(`${month}-01T00:00:00Z`);
                        } else if (!isFlexibleStart) {
                            startDate = new Date(task.startDate);
                        }

                        if (isFlexibleEnd && month) {
                            // Last day of month
                            const [year, mon] = month.split('-').map(Number);
                            endDate = new Date(year, mon, 0, 23, 59, 59);
                        } else if (!isFlexibleEnd) {
                            endDate = new Date(task.endDate);
                        }

                        // Final safety check: If date is invalid, use default
                        const finalStart = isNaN(startDate.getTime()) ? new Date() : startDate;
                        const finalEnd = isNaN(endDate.getTime()) ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : endDate;

                        return {
                            type: task.type,
                            destination: task.destination,
                            budget: task.budget,
                            startDate: finalStart,
                            endDate: finalEnd,
                            requirements: task.requirements
                        };
                    })
                }
            }
        });

        // 5. Gamification (Award Points)
        await gamification.awardPoints(userId, POINT_VALUES.SEARCH, `Search Query: ${query}`);

        return {
            success: true,
            data: {
                logId: searchLogId,
                tasks
            }
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error in orchestration";

        // 5. Persistence (End): Failed Case
        if (searchLogId) {
            await prisma.searchLog.update({
                where: { id: searchLogId },
                data: {
                    status: 'FAILED',
                    failReason: errorMessage
                }
            });
        }

        return {
            success: false,
            error: errorMessage
        };
    }
}
