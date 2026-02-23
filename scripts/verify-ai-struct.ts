import { explainDeal, generateItinerary } from '../app/actions/ai-features';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

async function verifyAI() {
    console.log('🚀 Starting AI Structure Verification...\n');

    const testDeal = {
        title: '7-Day Ultra-Luxury Stay in Maldives Overwater Villa',
        price: 2499,
        originalPrice: 5500
    };

    try {
        console.log(`Testing Structured Insight for: "${testDeal.title}"...`);
        const insight = await explainDeal(testDeal.title, testDeal.price, testDeal.originalPrice);
        console.log('✅ Insight Response:', JSON.stringify(insight, null, 2));

        if (!insight.verdict || !Array.isArray(insight.pros)) {
            throw new Error('Insight structure is invalid!');
        }

        console.log('\nTesting Structured Itinerary for: "Maldives"...');
        const itinerary = await generateItinerary('Maldives', 3);
        console.log('✅ Itinerary Response:', JSON.stringify(itinerary, null, 2));

        if (!Array.isArray(itinerary) || itinerary.length === 0) {
            throw new Error('Itinerary structure is invalid!');
        }

        console.log('\n✨ All AI Structures Verified Successfully!');
    } catch (error) {
        console.error('\n❌ Verification Failed:', error);
        process.exit(1);
    }
}

verifyAI();
