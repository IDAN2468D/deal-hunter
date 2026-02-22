import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkDB() {
    const deals = await prisma.deal.findMany();
    const destinations = await prisma.destination.findMany();

    console.log(`Deals count: ${deals.length}`);
    console.log(`Destinations count: ${destinations.length}`);

    if (deals.length > 0) {
        console.log('Sample Deal Titles:', deals.slice(0, 3).map(d => d.title));
    }

    if (destinations.length > 0) {
        console.log('Sample Destinations:', destinations.slice(0, 3).map(d => d.name));
    }
}

checkDB()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
