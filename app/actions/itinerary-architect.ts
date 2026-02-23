'use server';

import { tryMultipleModels } from '@/lib/gemini';
import { z } from 'zod';

const ActivitySchema = z.object({
    time: z.string(),
    title: z.string(),
    description: z.string(),
    location: z.string(),
});

const ItineraryDaySchema = z.object({
    day: z.number(),
    theme: z.string(),
    tips: z.string(),
    activities: z.array(ActivitySchema),
});

/**
 * Weather Simulation Layer (Elite Real-time Intelligence)
 * In a production environment, this would call OpenWeatherMap or similar.
 */
async function getRealtimeIntelligence(destination: string) {
    // Simulated weather intelligence
    const factors = ['HEAVY_RAIN', 'HEAT_WAVE', 'LOCAL_FESTIVAL', 'CLEAR_SKIES', 'PUBLIC_STRIKE'];
    const intelligence = factors[Math.floor(Math.random() * factors.length)];

    return {
        condition: intelligence,
        impact: intelligence === 'HEAVY_RAIN' ? 'Outdoor activities compromised' :
            intelligence === 'LOCAL_FESTIVAL' ? 'Popular areas congested' : 'Nominal operations'
    };
}

export async function architectItinerary(
    destination: string,
    currentPlan: any[],
    intelligenceOverride?: string
) {
    const intelligence = await getRealtimeIntelligence(destination);
    const condition = intelligenceOverride || intelligence.condition;

    const prompt = `
        You are the Lumina Itinerary Architect. Your job is to RE-ARCHITECT an existing travel itinerary based on REAL-TIME INTELLIGENCE.
        
        DESTINATION: ${destination}
        REAL-TIME CONDITION: ${condition}
        CURRENT PLAN: ${JSON.stringify(currentPlan)}
        
        TASK:
        Modify the itinerary to react to the condition. 
        - If HEAVY_RAIN: Swap outdoor activities for high-end boutique indoor experiences (galleries, luxury malls, indoor spas).
        - If LOCAL_FESTIVAL: Incorporate the festival into the themes or warn about congestion in tips.
        - If PUBLIC_STRIKE: Suggest walking-distance clusters or localized luxury bubbles.
        - If CLEAR_SKIES: Optimize for viewpoints and rooftop sunset experiences.
        
        Keep the SAME JSON STRUCTURE as the current plan.
        Return ONLY the modified JSON array. No markdown, no text.
    `;

    try {
        const text = await tryMultipleModels(prompt);
        if (!text) return { success: false, error: 'Agent Timeout' };

        let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
        if (arrayMatch) cleaned = arrayMatch[0];

        const parsed = JSON.parse(cleaned);

        return {
            success: true,
            plan: parsed,
            intelligence: condition,
            narrative: `המערכת זיהתה: ${condition === 'HEAVY_RAIN' ? 'גשם כבד' : condition === 'CLEAR_SKIES' ? 'שמיים בהירים' : condition}. המסלול הותאם בזמן אמת.`
        };
    } catch (error) {
        console.error('Architect Error:', error);
        return { success: false, error: 'Architect failed to respond' };
    }
}
