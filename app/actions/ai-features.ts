'use server';

import { tryMultipleModels } from '@/lib/gemini';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for structured AI Verdict
const InsightSchema = z.object({
    verdict: z.string(),
    pros: z.array(z.string()),
    cons: z.array(z.string()),
    vibe: z.string().optional() // e.g., "Adventure", "Luxury", "Budget-Friendly"
});

export async function analyzeDeal(dealTitle: string, price: number, originalPrice: number) {
    const prompt = `
      Analyze this travel deal: "${dealTitle}" at $${price} (was $${originalPrice}).
      Rate it as: "SUPER_HOT", "GOOD", or "AVERAGE".
      Return ONLY the rating string.
    `;

    try {
        const text = await tryMultipleModels(prompt);
        return text?.trim() || 'AVERAGE';
    } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Analyze Deal Error:', message);
        }
        return 'AVERAGE';
    }
}

export async function generateItinerary(destination: string, days: number = 3, budget: number = 1000) {
    const prompt = `
      You are a professional luxury travel planner. Create a highly detailed ${days}-day itinerary for ${destination} with a budget of $${budget}.
      
      IMPORTANT: Respond with ONLY a valid JSON array. No markdown, no explanation, no text before or after.
      
      Required schema (strict):
      [
        {
          "day": 1,
          "theme": "The vibe of the day (e.g. Historic Heart, Coastal Bliss)",
          "tips": "One local insider tip for this day (transport, hidden spots, or local etiquette)",
          "activities": [
            {
              "time": "Morning",
              "title": "Activity Name with Emoji",
              "description": "Engaging description (2 sentences)",
              "location": "A search-friendly name for Google Maps"
            },
            {
              "time": "Afternoon",
              "title": "Activity Name with Emoji",
              "description": "Engaging description (2 sentences)",
              "location": "A search-friendly name for Google Maps"
            },
            {
              "time": "Evening",
              "title": "Activity Name with Emoji",
              "description": "Engaging description (2 sentences)",
              "location": "A search-friendly name for Google Maps"
            }
          ]
        }
      ]
      
      Rules:
      - Exactly ${days} objects in the array
      - Each day has exactly 3 activities (Morning, Afternoon, Evening)
      - Descriptions must be premium and evocative
      - Output ONLY the JSON array, nothing else
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) return null;

        // Strip markdown fences
        let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

        // Extract JSON array
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrayMatch) cleaned = arrayMatch[0];

        const parsed = JSON.parse(cleaned);
        if (!Array.isArray(parsed)) return null;

        return parsed;
    } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') {
            const message = error instanceof Error ? error.message : String(error);
            console.error('Itinerary Error:', message);
        }
        return null;
    }
}

export async function saveItinerary(destinationId: string, plan: import('@prisma/client').Prisma.InputJsonValue) {
    // Note: In an elite squad, we'd get userId from auth session.
    // For now using the mock user from the spec.
    const mockUserId = "6995af5576e5d37aa9617051";

    try {
        const saved = await prisma.itinerary.create({
            data: {
                destinationId,
                userId: mockUserId,
                plan: plan,
            }
        });
        return { success: true, id: saved.id };
    } catch (error) {
        console.error('Save Itinerary Error:', error);
        return { success: false, error: 'Failed to save itinerary' };
    }
}



/**
 * Explains why a deal is good or bad using structured JSON.
 */
export async function explainDeal(dealTitle: string, price: number, originalPrice: number) {
    const prompt = `
        You are a travel analyst. Analyze this deal and provide a structured breakdown.
        Deal: "${dealTitle}"
        Price: $${price}
        Original: $${originalPrice}
        
        Return ONLY a JSON object with this schema:
        {
          "verdict": "Short punchy summary (2 sentences)",
          "pros": ["Point 1", "Point 2"],
          "cons": ["Point 1"],
          "vibe": "One word vibe"
        }
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error("No response from AI");

        const cleanJson = text.replace(/```json|```/g, '').trim();
        const data = JSON.parse(cleanJson);

        // Validate
        return InsightSchema.parse(data);
    } catch (error: unknown) {
        if (process.env.NODE_ENV === 'development') console.error("ExplainDeal Error:", error);
        return {
            verdict: "AI insight currently unavailable.",
            pros: ["Great price potential"],
            cons: ["Analysis pending"],
            vibe: "Unknown"
        };
    }
}
