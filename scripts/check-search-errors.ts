import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- FETCHING LAST 5 SEARCH LOGS ---');
    const logs = await prisma.searchLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });

    logs.forEach(log => {
        console.log(`\nID: ${log.id}`);
        console.log(`Query: ${log.query}`);
        console.log(`Status: ${log.status}`);
        console.log(`Fail Reason: ${log.failReason || 'None'}`);
        console.log(`Model: ${log.agentModel}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
