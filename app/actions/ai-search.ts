'use server';

import { getGeminiModel, tryMultipleModels } from '@/lib/gemini';
import { z } from 'zod';

// Schema for the AI response
const DealSuggestionSchema = z.object({
    city: z.string(),
    country: z.string(),
    estimatedPrice: z.number().optional(),
    description: z.string(),
    matchScore: z.number().min(0).max(100),
});

export type DealSuggestion = z.infer<typeof DealSuggestionSchema>;

const ResponseSchema = z.array(DealSuggestionSchema);

export async function searchDealsWithGemini(query: string): Promise<DealSuggestion[]> {
    const model = getGeminiModel();
    if (!model) {
        if (process.env.NODE_ENV === 'development') console.error('Gemini model could not be initialized. Check GOOGLE_API_KEY.');
        return [];
    }

    // 1. Validate Input
    if (!query || query.length > 200) {
        if (process.env.NODE_ENV === 'development') console.error('Query too long or empty');
        return [];
    }

    try {
        // 3. Prompt Engineering
        const prompt = `
      You are an expert travel agent API. 
      User Query: "${query}"
      
      Extract travel intent and suggest 3-5 specific destinations.
      
      Rules:
      1. Return JSON ARRAY ONLY. No markdown, no text.
      2. Schema: [{ "city": "String", "country": "String", "estimatedPrice": Number (USD), "description": "String (why this matches)", "matchScore": Number (0-100) }]
      3. Be realistic with prices.
      4. If users ask for something impossible, suggest the closest alternative.
    `;

        const text = await tryMultipleModels(prompt);

        if (!text) {
            if (process.env.NODE_ENV === 'development') console.error('All Gemini models failed or quota exceeded.');
            return [];
        }

        // 4. Clean and Parse JSON
        const cleanJson = text.replace(/```json|```/g, '').trim();
        const rawData = JSON.parse(cleanJson);

        // 5. Validate with Zod
        const validatedData = ResponseSchema.parse(rawData);
        return validatedData;

    } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('AI Search Error:', error);
        return []; // Fail gracefully
    }
}
