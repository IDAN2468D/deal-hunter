import { GoogleGenerativeAI } from '@google/generative-ai';

async function test() {
    console.log("Starting minimal test...");
    const apiKey = "AIzaSyC1j2ZgO6BQTVrUd1UCdYYBsVpSV4KJ4HU";
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent("Say hi");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.error("Minimal test failed:", e);
    }
}

test();
