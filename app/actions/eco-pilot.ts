'use server';

import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
});

const EcoSchema = z.object({
    carbonFootprint: z.number().describe("Estimated carbon footprint in kg CO2e"),
    equivalents: z.array(z.string()).describe("Fun facts like 'Equivalent to X trees planted' or 'Y burgers eaten'"),
    greenAlternatives: z.array(z.object({
        type: z.string(),
        title: z.string(),
        impactReduction: z.string().describe("Percentage or description of reduction"),
        description: z.string()
    })),
    offsetCost: z.number().describe("Cost in USD to offset this trip"),
    ecoRating: z.number().min(1).max(10).describe("1-10 rating of the trip's sustainability"),
    tacticalAnalysis: z.string().describe("Professional advice on footprint reduction"),
});

export async function calculateEcoImpactAction(destination: string, durationDays: number, travelers: number) {
    try {
        const prompt = `
            You are the 'Lumina Tactical Eco-Architect'. 
            Perform a high-fidelity sustainability audit for a precision trip:
            Destination: ${destination}
            Parameters: ${travelers} operatives, ${durationDays} day deployment.
            
            Audit Requirements:
            1. Carbon Breakdown: Provide a granular estimate (kg CO2e) for Flights, Accommodation, and Local Transport.
            2. Impact Lexicon: Provide 3 high-impact equivalents (e.g., "Equivalent to charging X smartphones", "Impact of Y hours of private jet flight").
            3. Tactical Green Alternatives: Suggest 3 ELITE alternatives. Include a 'Luxury Eco-Stay', a 'Low-Emission Transit' (Train/EV), and a 'Regenerative Activity'.
            4. Offset Calculation: Precision calculation based on \$35/tonne (Elite Standard).
            5. Sustainability Quotient: A score from 1-10 with 2 decimal places.
            6. Tactical Analysis: A 2-sentence veteran traveler's advice on how to minimize footprint without sacrificing luxury.
            
            CRITICAL OUTPUT DIRECTIVES:
            - Language: All user-facing strings MUST be in Hebrew.
            - Tone: Tactical, Professional, Premium (Elite Intelligence style).
            - Use Hebrew terms like 'טביעת פחמן', 'חלופות ירוקות', 'ניטור'.
        `;

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: EcoSchema,
            prompt,
        });

        return { success: true, data: result.object };
    } catch (error) {
        console.error("ECO PILOT ERROR:", error);
        return { success: false, error: "Failed to calculate eco impact" };
    }
}
