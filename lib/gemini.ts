import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI: GoogleGenerativeAI | null = null;

/**
 * ⚠️ CRITICAL ARCHITECT NOTE: 
 * Valid versions are: 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'.
 */
export const getGeminiModel = (modelName: string = 'gemini-2.5-flash') => {
    if (!genAI) {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ No Gemini API Key (GEMINI_API_KEY or GOOGLE_API_KEY) defined');
            return null;
        }
        genAI = new GoogleGenerativeAI(apiKey);
    }

    return genAI.getGenerativeModel({ model: modelName });
};

export interface GenerativeModelInterface {
    generateContent: (prompt: string) => Promise<{ response: { text: () => string } }>;
}

/**
 * Utility to handle Gemini responses safely with retries and backoff
 */
export async function safeGenerateContent(
    model: GenerativeModelInterface,
    prompt: string,
    retries: number = 3,
    delay: number = 2000
): Promise<string> {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const isRateLimit = message.includes('429') || message.includes('quota');

        if (isRateLimit && retries > 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
            return safeGenerateContent(model, prompt, retries - 1, delay * 2);
        }

        throw error;
    }
}

/**
 * Helper to try multiple models in order of preference
 */
export async function tryMultipleModels(prompt: string, models: string[] = ['gemini-2.5-flash', 'gemini-2.5-flash']): Promise<string | null> {
    for (const modelName of models) {
        const model = getGeminiModel(modelName);
        if (!model) continue;

        try {
            return await safeGenerateContent(model as GenerativeModelInterface, prompt);
        } catch (e) {
            console.error(`❌ Gemini Model ${modelName} failed:`, e instanceof Error ? e.message : e);
            continue;
        }
    }
    return null;
}
