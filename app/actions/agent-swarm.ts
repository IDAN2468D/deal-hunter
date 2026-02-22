'use server';

import { tryMultipleModels } from '@/lib/gemini';
import { z } from 'zod';
import { AgentOutcomeSchema, sanitizeInput, SENTINEL_ERRORS } from '@/lib/validations';

const FlightSchema = z.object({
    airline: z.string(),
    flightNumber: z.string(),
    departureTime: z.string(),
    arrivalTime: z.string(),
    estimatedPrice: z.number(),
    matchReason: z.string()
});

/**
 * Flight Agent: Specializes in finding flight deals and data.
 */
export async function flightAgent(destination: string, budget: number) {
    const cleanDest = sanitizeInput(destination);

    // Check for range errors early (Sentinel Layer)
    if (budget <= 0) {
        return AgentOutcomeSchema.parse({
            success: false,
            error: SENTINEL_ERRORS.INVALID_RANGE
        });
    }

    const prompt = `
        You are a Flight Deal Expert. Find a hypothetical flight deal for ${cleanDest} within a total trip budget of $${budget}.
        Return ONLY a JSON object with this schema:
        {
            "airline": "String",
            "flightNumber": "String",
            "departureTime": "ISO String",
            "arrivalTime": "ISO String",
            "estimatedPrice": Number (usually 30-40% of budget),
            "matchReason": "Why this flight fits the traveler"
        }
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error(SENTINEL_ERRORS.TIMEOUT);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        let data;
        try {
            data = JSON.parse(cleanJson);
        } catch (e) {
            throw new Error(SENTINEL_ERRORS.HALLUCINATION);
        }

        return AgentOutcomeSchema.parse({
            success: true,
            data: FlightSchema.parse(data)
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Flight detection failed";
        return AgentOutcomeSchema.parse({
            success: false,
            error: (Object.values(SENTINEL_ERRORS) as string[]).includes(errorMessage as string)
                ? errorMessage
                : "Flight detection failed"
        });
    }
}

const HotelSchema = z.object({
    name: z.string(),
    stars: z.number(),
    location: z.string(),
    nightlyRate: z.number(),
    totalStayPrice: z.number(),
    perks: z.array(z.string())
});

/**
 * Hotel Agent: Specializes in finding accommodation deals.
 */
export async function hotelAgent(destination: string, budget: number, durationDays: number = 7) {
    const cleanDest = sanitizeInput(destination);

    if (budget <= 0) {
        return AgentOutcomeSchema.parse({
            success: false,
            error: SENTINEL_ERRORS.INVALID_RANGE
        });
    }

    const prompt = `
        You are a Luxury Hotel Expert. Find a hotel in ${cleanDest} for a ${durationDays}-day trip within a budget of $${budget}.
        Return ONLY a JSON object with this schema:
        {
            "name": "Hotel Name",
            "stars": Number (1-5),
            "location": "District/Area",
            "nightlyRate": Number,
            "totalStayPrice": Number,
            "perks": ["Spa", "Free WiFi", etc.]
        }
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error(SENTINEL_ERRORS.TIMEOUT);

        const cleanJson = text.replace(/```json|```/g, '').trim();
        let data;
        try {
            data = JSON.parse(cleanJson);
        } catch (e) {
            throw new Error(SENTINEL_ERRORS.HALLUCINATION);
        }

        return AgentOutcomeSchema.parse({
            success: true,
            data: HotelSchema.parse(data)
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Hotel detection failed";
        return AgentOutcomeSchema.parse({
            success: false,
            error: (Object.values(SENTINEL_ERRORS) as string[]).includes(errorMessage as string)
                ? errorMessage
                : "Hotel detection failed"
        });
    }
}

/**
 * Orchestrator: Runs specialized agents in parallel and merges results.
 */
export async function orchestrateSearch(destination: string, budget: number) {
    // Orchestrating agents...

    // Parallel Execution (Performance Optimization)
    const [flightResult, hotelResult] = await Promise.all([
        flightAgent(destination, budget),
        hotelAgent(destination, budget)
    ]);

    return {
        flights: flightResult,
        hotels: hotelResult,
        timestamp: new Date().toISOString()
    };
}
