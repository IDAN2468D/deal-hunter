import { tryMultipleModels } from '@/lib/gemini';
import { SENTINEL_ERRORS } from '@/lib/validations';

export interface ReviewSummary {
    pros: string[];
    cons: string[];
    overallSentiment: string;
    targetAudience: string;
    summaryText: string;
}

export class ReviewSummarizer {
    async summarize(reviews: string[]): Promise<ReviewSummary> {
        if (reviews.length === 0) {
            return {
                pros: ["N/A"],
                cons: ["N/A"],
                overallSentiment: "Neutral",
                targetAudience: "General",
                summaryText: "No reviews available yet."
            };
        }

        const prompt = `
            You are the DealHunter Review Summarizer.
            Analyze the following reviews for a travel destination/hotel:
            
            ${reviews.map((r, i) => `Review ${i + 1}: "${r}"`).join('\n')}
            
            Synthesize the consensus into:
            1. Top 3 Pros
            2. Top 3 Cons
            3. Overall Sentiment (Amazing, Good, Mixed, Poor)
            4. Recommended Target Audience (e.g., Families, Couples, Solo, Party)
            5. A concise 2-sentence summary.
            
            Return ONLY a valid JSON object matching this interface:
            interface ReviewSummary {
                pros: string[];
                cons: string[];
                overallSentiment: string;
                targetAudience: string;
                summaryText: string;
            }
            
            Output: Raw JSON only.
        `;

        try {
            const text = await tryMultipleModels(prompt);
            if (!text) throw new Error(SENTINEL_ERRORS.TIMEOUT);

            const cleanJson = text.replace(/```json|```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error("ReviewSummarizer Error:", error);
            return {
                pros: ["Review data error"],
                cons: ["Review data error"],
                overallSentiment: "N/A",
                targetAudience: "N/A",
                summaryText: "Review summarization failed due to an error."
            };
        }
    }
}
