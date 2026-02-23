import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

// No complex env loading, just check if it's there
const apiKey = process.env.GOOGLE_API_KEY;

async function test() {
    console.log('API Key present:', !!apiKey);
    if (!apiKey) return;

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try listing models via the REST API directly since SDK listing is complex
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log('Fetching available models list...');
    try {
        const res = await fetch(url);
        const data = await res.json() as { error?: { message: string }, models?: Array<{ name: string }> };

        if (data.error) {
            console.error('API Error:', data.error.message);
        } else {
            console.log('Available Models (first 5):');
            data.models?.slice(0, 5).forEach((m) => console.log(`- ${m.name}`));

            const hasFlash = data.models?.some((m) => m.name.includes('gemini-2.5-flash'));
            console.log('\nHas gemini-2.5-flash:', hasFlash);
        }
    } catch (e: unknown) {
        console.error('Fetch failed:', e instanceof Error ? e.message : String(e));
    }
}

test();
