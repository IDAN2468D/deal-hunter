import { tryMultipleModels } from '@/lib/gemini';
import { SENTINEL_ERRORS } from '@/lib/validations';

export interface BudgetSplit {
    flights: number;
    hotels: number;
    activities: number;
    food: number;
    emergency: number;
    currency: string;
    reasoning: string;
}

export class BudgetOptimizer {
    async optimize(totalBudget: number, destination: string, participants: number, days: number): Promise<BudgetSplit> {
        const prompt = `
            You are the DealHunter Budget Optimizer.
            Optimize a total budget of ${totalBudget} USD for ${participants} people for ${days} days in ${destination}.
            
            Provide a logical split between:
            - flights
            - hotels
            - activities (tours, sightseeing)
            - food (dining, groceries)
            - emergency (10% buffer recommended)
            
            Return ONLY a valid JSON object matching this interface:
            interface BudgetSplit {
                flights: number;
                hotels: number;
                activities: number;
                food: number;
                emergency: number;
                currency: "USD";
                reasoning: string; // Max 2 sentences explaining why this split is optimal for ${destination}
            }
            
            Output: Raw JSON only.
        `;

        try {
            const text = await tryMultipleModels(prompt);
            if (!text) throw new Error(SENTINEL_ERRORS.TIMEOUT);

            const cleanJson = text.replace(/```json|```/g, '').trim();
            const result: BudgetSplit = JSON.parse(cleanJson);
            return result;
        } catch (error) {
            console.error("BudgetOptimizer Error:", error);
            // Default split if AI fails
            return {
                flights: totalBudget * 0.4,
                hotels: totalBudget * 0.3,
                activities: totalBudget * 0.15,
                food: totalBudget * 0.1,
                emergency: totalBudget * 0.05,
                currency: "USD",
                reasoning: "AI was unavailable. Providing a standard 40/30/15/10/5 split."
            };
        }
    }
}
