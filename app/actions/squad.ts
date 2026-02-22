"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createSquadRoom(name: string, itineraryId?: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const inviteCode = Math.random().toString(36).substring(2, 12).toUpperCase();

    const room = await prisma.squadRoom.create({
        data: {
            name,
            inviteCode,
            itineraryId,
            members: {
                create: {
                    userId: session.user.id,
                    role: "OWNER"
                }
            }
        }
    });

    revalidatePath("/squad");
    return { success: true, room };
}

export async function joinSquadRoom(inviteCode: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const room = await prisma.squadRoom.findUnique({
        where: { inviteCode }
    });

    if (!room) throw new Error("Room not found");

    // Check if already a member
    const existingMember = await prisma.squadMember.findFirst({
        where: {
            roomId: room.id,
            userId: session.user.id
        }
    });

    if (existingMember) return { success: true, room };

    await prisma.squadMember.create({
        data: {
            roomId: room.id,
            userId: session.user.id,
            role: "MEMBER"
        }
    });

    revalidatePath("/squad");
    return { success: true, room };
}

export async function getMySquads() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.squadMember.findMany({
        where: { userId: session.user.id },
        include: {
            room: {
                include: {
                    members: {
                        include: {
                            user: {
                                select: { name: true, image: true }
                            }
                        }
                    },
                    itinerary: true
                }
            }
        }
    });
}
