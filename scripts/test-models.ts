import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);
    const models = ["gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.5-flash", "gemini-2.5-pro", "gemini-pro"];

    for (const m of models) {
        console.log(`Testing model: ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("hi");
            console.log(`✅ ${m} works: ${result.response.text()}`);
            break;
        } catch (e: unknown) {
            console.error(`❌ ${m} failed: ${e instanceof Error ? e.message : String(e)}`);
        }
    }
}

test();
