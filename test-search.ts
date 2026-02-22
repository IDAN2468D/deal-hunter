import { prisma } from './lib/prisma';

async function testSearchAction() {
    const user = await prisma.user.findFirst();
    if (!user) {
        console.error("❌ No user found in DB. Run seed or register first.");
        return;
    }

    console.log(`🔍 Testing with user: ${user.email} (${user.id})`);

    // Dynamically import the action
    const { performAgenticSearch } = await import('./app/actions/search');

    try {
        console.log("🚀 Starting Agentic Search...");
        const result = await performAgenticSearch("Cheap flights to Tokyo next month", user.id);

        if (result.success) {
            console.log("✅ SEARCH SUCCESS!");
            console.log("📊 Tasks generated:", result.data?.tasks?.length);
            console.log("🆔 Log ID:", result.data?.logId);
        } else {
            console.error("❌ SEARCH FAILED:", result.error);
        }
    } catch (error) {
        console.error("💥 CRASHED:", error);
    }
}

testSearchAction();
