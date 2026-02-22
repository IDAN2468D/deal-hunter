import { Orchestrator } from '../lib/agents/orchestrator';
import { loadEnvFile } from 'node:process';

// Load env variables
loadEnvFile('.env');

async function testFuzzySearch() {
    console.log("🐝 --- DEALHUNTER ELITE SQUAD: COMPREHENSIVE FUZZY SEARCH TEST --- 🐝");
    const orchestrator = new Orchestrator();

    const testQueries = [
        "Romantic getaway in August",
        "Adventure trip to Japan for $5000",
        "Beach holiday for a weekend in July with $2000",
        "Family friendly skiing in French Alps next December",
        "Last minute backpacking in Thailand",
        "Luxury stay in New York for 3 nights next week"
    ];

    let totalPassed = 0;

    for (const query of testQueries) {
        console.log(`\n🔍 TESTING QUERY: "${query}"`);
        try {
            const tasks = await orchestrator.searchDeals(query);
            console.log("✅ DECOMPOSED TASKS:");

            let queryPassed = true;
            const currentYear = new Date().getFullYear();

            tasks.forEach(task => {
                const totalReqs = task.requirements.join(', ');
                console.log(`  - [${task.type.toUpperCase()}] -> ${task.destination}`);
                console.log(`    Budget: $${task.budget} | From: ${task.startDate} | To: ${task.endDate}`);
                console.log(`    Specs: ${totalReqs}`);

                // Validation rules
                if (task.startDate !== 'FLEXIBLE') {
                    const startYear = new Date(task.startDate).getFullYear();
                    // If target is in the past, it's a fail
                    if (startYear < currentYear) {
                        console.error(`    ❌ FAIL: Date ${task.startDate} is in the past!`);
                        queryPassed = false;
                    }
                }
            });

            // check if vibe exists
            const hasVibe = tasks.some(t => t.requirements.some((r: string) => r.startsWith('vibe:')));
            if (!hasVibe && (query.toLowerCase().includes('romantic') || query.toLowerCase().includes('adventure') || query.toLowerCase().includes('luxury'))) {
                console.warn(`    ⚠️  WARNING: No 'vibe:' tag found despite descriptive query.`);
            }

            if (queryPassed) totalPassed++;

        } catch (error) {
            console.error("❌ CRITICAL FAILURE:", error instanceof Error ? error.message : String(error));
        }
    }

    console.log(`\n🎯 TEST SUMMARY: ${totalPassed}/${testQueries.length} Queries passed validation logic.`);
}

testFuzzySearch();
