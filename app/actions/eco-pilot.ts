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
});

export async function calculateEcoImpactAction(destination: string, durationDays: number, travelers: number) {
    try {
        const prompt = `
            You are the DealHunter Eco-Pilot Agent. 
            Analyze a trip to ${destination} for ${travelers} people staying ${durationDays} days.
            
            1. Estimate the total carbon footprint (kg CO2e) including average flight and hotel impact.
            2. Provide 3 fun equivalents contextually related to the footprint.
            3. Suggest 3 concrete green alternatives (e.g., specific eco-hotels, trains instead of flights, sustainable tours).
            4. Calculate the offset cost based on $25 per tonne CO2.
            5. Provide an eco-rating (1-10).
            
            CRITICAL: Return the response in HEBREW for all descriptive text fields (equivalents, title, reduction, description).
            The output must match the provided schema.
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
