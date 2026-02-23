import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    console.log("Starting minimal test...");
    const apiKey = process.env.GEMINI_API_KEY || "";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent("Say hi");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Minimal test failed:", e);
    }
}

test();
