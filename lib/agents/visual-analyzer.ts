import { getGeminiModel } from '@/lib/gemini';
import { SENTINEL_ERRORS } from '@/lib/validations';

export interface VisualSearchResult {
    destination: string;
    country: string;
    description: string;
    confidence: number;
    similarDestinations: string[];
}

export class VisualAnalyzer {
    async analyzeImageUrl(imageBuffer: Buffer, mimeType: string): Promise<VisualSearchResult> {
        const model = getGeminiModel('gemini-2.5-flash'); // Or fallback if needed
        if (!model) throw new Error(SENTINEL_ERRORS.TIMEOUT);

        const prompt = "Identify the travel destination in this image. Is it a landmark, a city, or a specific beach? Provide the city/region and country.";

        try {
            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBuffer.toString('base64'),
                        mimeType
                    }
                }
            ]);

            const responseText = result.response.text();

            // Now use the text result to get structured JSON from the model 
            // (Or just parse it if we asked for JSON in a second pass, or combine)

            const structPrompt = `
                Extract destination information from this text:
                "${responseText.replace(/"/g, "'")}"

                Return ONLY a JSON object:
                {
                    "destination": "Name of city/region",
                    "country": "Name of country",
                    "description": "Short 1 sentence description",
                    "confidence": 0-1,
                    "similarDestinations": ["Dest 1", "Dest 2"]
                }
            `;

            // Second pass for structuring (more reliable than combining vision + complex json in one hit with some models)
            const structResult = await model.generateContent(structPrompt);
            const rawBody = structResult.response.text();
            const cleanJson = rawBody.replace(/```json|```/g, '').trim();

            try {
                return JSON.parse(cleanJson);
            } catch (e) {
                // If parsing fails, try to find the JSON block inside the text
                const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]);
                }
                throw e;
            }

        } catch (error) {
            console.error("VisualAnalyzer Error:", error);
            throw new Error(`${SENTINEL_ERRORS.HALLUCINATION}: Visual analysis failed.`);
        }
    }
}
