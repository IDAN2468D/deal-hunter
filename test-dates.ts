import { Orchestrator } from './lib/agents/orchestrator';

async function testDateFeature() {
    console.log("📅 Testing Date Extraction Feature...");
    const orchestrator = new Orchestrator();

    // Test 1: Relative date
    console.log("\n🧪 Test 1: 'Cheap flights to Tokyo next month'");
    try {
        const tasks = await orchestrator.searchDeals("Cheap flights to Tokyo next month");
        tasks.forEach((t, i) => {
            console.log(`Task ${i + 1}: ${t.type} to ${t.destination}`);
            console.log(`  Dates: ${t.startDate} to ${t.endDate}`);
            console.log(`  Requirements: ${t.requirements.join(', ')}`);
        });

        const hasMonth = tasks.some(t => t.requirements.some(r => r.startsWith('month:')));
        if (hasMonth) console.log("✅ SUCCESS: Month requirement extracted!");
        else console.log("❌ FAILED: Month requirement missing.");
    } catch (e) {
        console.error("💥 Test 1 Crashed:", e);
    }

    // Test 2: Specific month
    console.log("\n🧪 Test 2: 'Luxury hotels in Paris in August'");
    try {
        const tasks = await orchestrator.searchDeals("Luxury hotels in Paris in August");
        const augTask = tasks.find(t => t.requirements.includes('month:2026-08'));
        if (augTask) console.log("✅ SUCCESS: August (2026-08) correctly identified!");
        else {
            console.log("❌ FAILED: August not found in requirements.");
            console.log("Requirements found:", tasks[0]?.requirements);
        }
    } catch (e) {
        console.error("💥 Test 2 Crashed:", e);
    }
}

testDateFeature();
