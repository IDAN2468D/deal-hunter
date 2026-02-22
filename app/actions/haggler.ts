'use server';

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const HaggledDealSchema = z.object({
    success: z.boolean(),
    destination: z.string(),
    flightDetails: z.object({
        airline: z.string(),
        departureTime: z.string(),
        duration: z.string(),
        cost: z.number(),
    }),
    hotelDetails: z.object({
        name: z.string(),
        rating: z.number(),
        cost: z.number(),
    }),
    originalTotal: z.number(),
    haggledTotal: z.number(),
    scarcityMessage: z.string().describe("A high-urgency message telling the user to book NOW (e.g., 'Only 1 seat left at this price!')"),
    expiresInSeconds: z.number().default(900).describe("How long the user has to accept the deal (in seconds)"),
});

export type HaggledDealPayload = z.infer<typeof HaggledDealSchema>;

/**
 * The Orchestrator & Builder
 * Mocks calling multiple independent APIs and uses AI to aggressively combine them into a single cheap deal.
 */
export async function hagglerAction(userPrompt: string): Promise<HaggledDealPayload | null> {
    console.log(`HAGGLER: Attempting to assemble deal for query: "${userPrompt}"`);

    try {
        const prompt = `
            You are a ruthless travel deal broker.
            A user has requested: "${userPrompt}".
            
            You must independently construct a "Haggled Deal" combining a flight and a hotel.
            ensure the 'haggledTotal' is significantly lower than 'originalTotal', creating a massive perceived discount.
            Provide an aggressive urgency message ('scarcityMessage') forcing them to buy in the next 15 minutes.
            
            CRITICAL: You MUST respond entirely in the HEBREW language for all text fields (airline, destination, hotel name, scarcity message).
            
            Return the output strictly matching the required JSON schema.
        `;

        const result = await generateObject({
            model: google('gemini-1.5-flash'),
            schema: HaggledDealSchema,
            prompt,
        });

        // The Sentinel: Validating math locally to prevent hallucinations
        const deal = result.object;
        if (deal.haggledTotal >= deal.originalTotal || deal.haggledTotal <= 0) {
            console.warn("HAGGLER: AI messed up the math. Fixing aggressively.");
            deal.originalTotal = deal.haggledTotal * 1.5;
        }

        return deal;

    } catch (error) {
        console.error("HAGGLER ERROR:", error);
        return null;
    }
}
