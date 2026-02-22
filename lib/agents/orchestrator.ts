import { tryMultipleModels } from '@/lib/gemini';
import { AgentTask } from '@/types/agents';
import { SENTINEL_ERRORS, sanitizeInput } from '@/lib/validations';

/**
 * Orchestrator Class
 * Transforms natural language queries into structured sub-tasks.
 * Strictly follows the 'No Any' law and the Sentinel safety specification.
 */
export class Orchestrator {
    // In compliance with Protocol 4.2: Reuse hardened Gemini logic from central lib
    constructor() {
        // Sentinel Layer: Validate API key existence (Section 1 of Spec)
        if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
            throw new Error(`SENTINEL: Missing Gemini API Key. Initialization aborted.`);
        }
    }

    /**
     * transform: The main entry point for NL decomposition.
     * Implements self-correction feedback loop (Section 3 of Spec).
     */
    async searchDeals(query: string, retry: boolean = true): Promise<AgentTask[]> {
        const cleanQuery = sanitizeInput(query);

        // Architect's System Spec for transformation
        const systemPrompt = `
            You are the DealHunter Orchestrator. 
            Extract Destination, Budget, Month, Vibe, and Dates from the user query.
            Today's Date: 2026-02-20.
            Output ONLY a valid JSON array matching the AgentTask interface.

            interface AgentTask {
                type: 'flight' | 'hotel' | 'activity';
                destination: string;
                budget: number;
                startDate: string; // ISO Date (YYYY-MM-DD) or "FLEXIBLE"
                endDate: string;   // ISO Date (YYYY-MM-DD) or "FLEXIBLE"
                requirements: string[]; // Include vibes here (e.g., "vibe:romantic")
            }

            Rules:
            1. Total Budget Allocation: Split logically (e.g., 40% flights, 40% hotels, 20% activities).
            2. Dates & Months: If a month is mentioned (e.g., "August"), set startDate and endDate to "FLEXIBLE" and MUST add "month:2026-08" (or relevant YYYY-MM) to requirements.
            3. Vibes: If an abstract vibe or trip type is mentioned (e.g., "romantic", "backpacking", "family"), add "vibe:vibe_name" to requirements.
            4. Logic: Choose destinations that HISTORICALLY match the requested vibe (e.g., Bali for Beach Chill, Tokyo for Luxury/Adventure).
            5. Dates Default: If no date/month is given, estimate a 7-day trip starting in approximately 30-45 days from TODAY (March/April 2026).
            6. Requirement Array: Must include exactly what the user asked for (e.g., ["vibe:romantic", "month:2026-08"]).
            7. Output: Raw JSON array only. No preamble.
        `;

        try {
            const prompt = `${systemPrompt}\n\nUser Query: "${cleanQuery}"\n\nJSON Output:`;

            // Using the hardened utility which handles fallbacks and retries
            const text = await tryMultipleModels(prompt);

            if (!text) {
                throw new Error(SENTINEL_ERRORS.TIMEOUT);
            }

            // Sanitizing JSON response from AI (common in agent flows)
            const cleanJson = text.replace(/```json|```/g, '').trim();
            const tasks: AgentTask[] = JSON.parse(cleanJson);

            if (!Array.isArray(tasks)) {
                throw new Error("Invalid output format: Expected Array");
            }

            return tasks;

        } catch (error) {
            // Feedback Loop (Self-correction)
            if (retry) {
                return this.searchDeals(query, false);
            }

            throw new Error(`${SENTINEL_ERRORS.HALLUCINATION}: Orchestrator failed to decompose query.`);
        }
    }
}
