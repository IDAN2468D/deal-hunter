
import { prisma } from './lib/prisma';

async function checkData() {
    try {
        const destinations = await prisma.destination.findMany();
        const deals = await prisma.deal.findMany({
            include: { destination: true }
        });

        console.log(`--- DATABASE DIAGNOSTIC ---`);
        console.log(`Destinations found: ${destinations.length}`);
        destinations.forEach(d => console.log(` - ${d.name} (Lat: ${d.lat}, Lng: ${d.lng})`));

        console.log(`Deals found: ${deals.length}`);
        const dealsWithCoords = deals.filter(d => d.destination?.lat !== null);
        console.log(`Deals with coordinates: ${dealsWithCoords.length}`);

        process.exit(0);
    } catch (e) {
        console.error("DIAGNOSTIC FAILED:", e);
        process.exit(1);
    }
}

checkData();
