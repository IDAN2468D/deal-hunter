'use server';

import { tryMultipleModels } from '@/lib/gemini';
import { z } from 'zod';

const PredictionSchema = z.object({
    recommendation: z.enum(['BUY_NOW', 'WAIT_48H', 'HIGH_VOLATILITY']),
    confidence: z.number().min(0).max(100),
    explanation: z.string(),
    marketVibe: z.string(),
    predictedPriceChange: z.string().optional()
});

export async function predictPriceSignal(
    dealTitle: string,
    currentPrice: number,
    originalPrice: number
) {
    const prompt = `
        You are the Lumina Ghost Signal Predictor. Analyze this travel deal and predict price movement for the next 48-72 hours.
        
        DEAL: "${dealTitle}"
        CURRENT PRICE: $${currentPrice}
        ORIGINAL PRICE: $${originalPrice} (Discount: ${Math.round((1 - currentPrice / originalPrice) * 100)}%)
        
        CRITERIA:
        - If discount > 40%, it's likely a flash deal (BUY_NOW).
        - If discount < 15%, it might be a price test (WAIT_48H).
        - If price is round (e.g., $500), it's stable. If uneven (e.g., $493.21), it might be dynamic (HIGH_VOLATILITY).
        
        Return ONLY a JSON object with this schema:
        {
            "recommendation": "BUY_NOW" | "WAIT_48H" | "HIGH_VOLATILITY",
            "confidence": Number (0-100),
            "explanation": "Short 1-sentence tactical reasoning in Hebrew.",
            "marketVibe": "e.g., Aggressive, Stable, Volatile",
            "predictedPriceChange": "e.g., +5%, -10%, Stable"
        }
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) throw new Error('AI Timeout');

        let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const data = JSON.parse(cleaned);

        return {
            success: true,
            prediction: PredictionSchema.parse(data)
        };
    } catch (error) {
        console.error('Predictor Error:', error);
        return {
            success: false,
            error: 'Failed to generate ghost signal.'
        };
    }
}
