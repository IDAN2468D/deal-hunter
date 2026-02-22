import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();
    const session = await auth();
    const userId = session?.user?.id;

    let systemPrompt = `You are a helpful, expert AI travel agent for the DealHunter Elite platform.
Your goal is to help users find the best travel deals, answer questions about destinations, and assist with their itineraries.
Be concise, enthusiastic, and use emojis.

If the user asks for deals, use the 'searchDeals' tool.`;

    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { preferences: true }
        });
        if (user?.name) {
            systemPrompt += `\n\nYou are talking to ${user.name}.`;
        }
        if (user?.preferences?.preferredVibes?.length) {
            systemPrompt += `\nThey have previously liked deals with these vibes: ${user.preferences.preferredVibes.join(', ')}. Try to tailor recommendations to this if possible.`;
        }
    }

    const searchDealsParams = z.object({
        destination: z.string().describe('The name of the destination, city, or country.'),
        maxBudget: z.number().optional().describe('Maximum budget in USD.'),
    });

    const result = streamText({
        model: google('gemini-1.5-flash'),
        messages,
        system: systemPrompt,
        tools: {
            searchDeals: tool({
                description: 'Search for active travel deals (flights or hotels) based on destination or max budget.',
                parameters: searchDealsParams,
                execute: async (args: z.infer<typeof searchDealsParams>): Promise<string> => {
                    const { destination, maxBudget } = args;
                    const dest = await prisma.destination.findFirst({
                        where: { name: { contains: destination, mode: 'insensitive' } }
                    });

                    let deals;
                    if (dest) {
                        deals = await prisma.deal.findMany({
                            where: {
                                destinationId: dest.id,
                                ...(maxBudget ? { price: { lte: maxBudget } } : {})
                            },
                            take: 3,
                            orderBy: { price: "asc" }
                        });
                    } else {
                        deals = await prisma.deal.findMany({
                            where: {
                                title: { contains: destination, mode: "insensitive" },
                                ...(maxBudget ? { price: { lte: maxBudget } } : {})
                            },
                            take: 3,
                            orderBy: { price: "asc" }
                        });
                    }

                    if (!deals || deals.length === 0) {
                        return "No deals found matching that criteria right now.";
                    }

                    return JSON.stringify(deals.map(d => ({
                        title: d.title,
                        price: d.price,
                        type: d.type,
                        link: `/deals/${d.id}`
                    })));
                },
            } as any),
        },
    });

    return result.toTextStreamResponse();
}
