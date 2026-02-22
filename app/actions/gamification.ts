"use server";

import { GamificationSystem } from "@/lib/gamification";
import { auth } from "@/auth";

const system = new GamificationSystem();

export async function getUserHunterStatsAction() {
    const session = await auth();
    if (!session?.user?.id) return null;

    return await system.getUserStats(session.user.id);
}

export async function checkAndAwardBadgesAction() {
    const session = await auth();
    if (!session?.user?.id) return { success: false, newBadges: [] };

    const newBadges = await system.checkAndAwardBadges(session.user.id);
    return { success: true, newBadges };
}
