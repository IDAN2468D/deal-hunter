'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function generatePackingList(destination: string, daysCount: number) {
    try {
        const { object } = await generateObject({
            model: google('gemini-2.5-pro'),
            schema: z.object({
                items: z.array(z.object({
                    id: z.string().describe("A unique 6-char id"),
                    item: z.string().describe("The name of the item to pack, in Hebrew"),
                    category: z.string().describe("The category (e.g. בגדים, אלקטרוניקה, מסמכים) in Hebrew"),
                    reason: z.string().describe("AI reasoning for why this item is essential for this specific destination, in Hebrew")
                }))
            }),
            prompt: `
        You are an elite AI travel concierge for "DealHunter Elite".
        The user is travelling to ${destination} for ${daysCount} days.
        Generate a hyper-tailored packing list for this destination.
        Think about the typical weather, culture, and power plug types for this destination.
        Provide around 10-15 highly specific essential items (do not include basic underwear/socks unless special).
        Ensure all labels and reasons are in Hebrew.
        `
        });

        return { success: true, items: object.items };
    } catch (error) {
        console.error('Error generating packing list:', error);
        return { success: false, items: null };
    }
}
