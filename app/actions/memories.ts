'use server';

import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// We map generic themes to Unsplash collections or keywords
const getKeywordFromTheme = (theme: string, destination: string) => {
    const t = theme.toLowerCase();
    if (t.includes('romantic') || t.includes('רומנט')) return `romantic,${destination}`;
    if (t.includes('adventure') || t.includes('הרפתק')) return `adventure,nature,${destination}`;
    if (t.includes('relax') || t.includes('חוף') || t.includes('בריכ')) return `beach,resort,relax,${destination}`;
    if (t.includes('culture') || t.includes('תרבות') || t.includes('מוזיאון')) return `culture,architecture,${destination}`;
    return `travel,beautiful,${destination}`;
};

export async function generateFutureMemory(destination: string, theme: string) {
    try {
        // Step 1: Generate an evocative caption
        const { object } = await generateObject({
            model: google('gemini-2.5-pro'),
            schema: z.object({
                caption: z.string().describe("A beautiful, poetic, and nostalgic 2-sentence caption pretending this is a photo taken by the user on their future trip. Must be in Hebrew.")
            }),
            prompt: `
        You are simulating an AI that predicts the best moment of a user's upcoming trip.
        Destination: ${destination}
        Trip Theme/Vibe: ${theme}
        Write a short (max 2 sentences) caption for a postcard. It should sound like the user actively experiencing an incredible moment. Language: Hebrew.
        `
        });

        // Step 2: Fetch a relevant image from Unsplash Source API (Using keywords)
        // Note: Using a direct search query to a generic unsplash proxy since we don't have an API key.
        const keywords = getKeywordFromTheme(theme, destination);
        const rand = Math.floor(Math.random() * 1000);
        // We use source.unsplash for random evocative imagery based on keywords. 
        // Adding a random seed prevents browser caching if they do it twice.
        const imageUrl = `https://source.unsplash.com/800x1000/?${encodeURIComponent(keywords)}&sig=${rand}`;

        return {
            success: true,
            data: {
                imageUrl,
                caption: object.caption
            }
        };
    } catch (error) {
        console.error('Error generating future memory:', error);
        return { success: false, data: null };
    }
}
