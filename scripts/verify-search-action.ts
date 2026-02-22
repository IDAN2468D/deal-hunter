import { performAgenticSearch } from '../app/actions/search';
import { prisma } from '../lib/prisma';
import { loadEnvFile } from 'node:process';

loadEnvFile('.env');

async function verifySearchAction() {
    console.log("🔍 Verifying Search Server Action...");

    // 1. Ensure we have a test user
    const user = await prisma.user.findFirst() || await prisma.user.create({
        data: {
            email: 'test@dealhunter.ai',
            name: 'Architect Test'
        }
    });

    console.log(`Using User: ${user.name} (${user.id})`);

    const query = "Family trip to Orlando in July with $4000 budget";

    try {
        console.log(`Calling performAgenticSearch for: "${query}"`);
        const result = await performAgenticSearch(query, user.id);

        if (result.success) {
            console.log("✅ Action Success!");
            console.log(`Log ID: ${result.data.logId}`);

            // 2. Verify DB Persistence
            const logEntry = await prisma.searchLog.findUnique({
                where: { id: result.data.logId },
                include: { agentTasks: true }
            });

            console.log(`Database Log Status: ${logEntry?.status}`);
            console.log(`Agent Tasks Generated: ${logEntry?.agentTasks.length}`);

            if (logEntry?.status === 'COMPLETED' && logEntry.agentTasks.length > 0) {
                console.log("🚀 VERIFICATION PASSED: Full loop functional.");
            } else {
                console.error("❌ VERIFICATION FAILED: Database state inconsistent.");
            }
        } else {
            console.error("❌ Action Failed:", result.error);
        }
    } catch (error) {
        console.error("❌ Unexpected Error:", error);
    }
}

verifySearchAction();
