import { Orchestrator } from '../lib/agents/orchestrator';
import { loadEnvFile } from 'node:process';

// Load env variables
loadEnvFile('.env');

async function testOrchestrator() {
    console.log("🐝 Starting Orchestrator Integration Test...");
    console.log("API Key present:", !!process.env.GOOGLE_API_KEY);

    const orchestrator = new Orchestrator();

    // Complex NL Query
    const query = "I want a luxury trip to Tokyo for 5 days in December with a budget of 5000 dollars. I need a hotel near Shibuya and direct flights.";

    try {
        console.log(`Query: "${query}"`);
        const tasks = await orchestrator.searchDeals(query);

        console.log("\n✅ Orchestration Successful!");
        console.log("Generated Tasks:");
        console.table(tasks.map(t => ({
            type: t.type,
            dest: t.destination,
            budget: `$${t.budget}`,
            reqs: t.requirements.join(', ')
        })));

        // Basic Assertions (Manual check in log)
        const totalBudget = tasks.reduce((sum, t) => sum + t.budget, 0);
        console.log(`\nTotal Allocated Budget: $${totalBudget}`);

    } catch (error) {
        console.error("\n❌ Orchestration Failed:", error instanceof Error ? error.message : String(error));
    }
}

testOrchestrator();
