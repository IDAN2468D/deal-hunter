'use server';

import { prisma } from '@/lib/prisma';

export async function fetchUserItineraries() {
    // Note: Using mock user ID as per project protocol until auth is fully integrated
    const mockUserId = "6995af5576e5d37aa9617051";

    try {
        const itineraries = await prisma.itinerary.findMany({
            where: {
                userId: mockUserId
            },
            include: {
                destination: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return { success: true, data: itineraries };
    } catch (error) {
        console.error('Fetch Itineraries Error:', error);
        return { success: false, error: 'Failed to fetch itineraries' };
    }
}

export async function deleteItinerary(itineraryId: string) {
    try {
        await prisma.itinerary.delete({
            where: {
                id: itineraryId
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Delete Itinerary Error:', error);
        return { success: false, error: 'Failed to delete itinerary' };
    }
}
