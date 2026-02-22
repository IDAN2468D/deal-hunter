"use server";

import { PersonalizationAgent } from "@/lib/agents/personalization";
import { auth } from "@/auth";

const agent = new PersonalizationAgent();

export async function getPersonalizedDealsAction() {
    const session = await auth();
    // For demo, if no session, return empty or generic
    if (!session?.user?.id) return [];

    try {
        return await agent.recommendDeals(session.user.id);
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function updateUserPreferenceAction(vibe: string) {
    const session = await auth();
    if (!session?.user?.id) return;

    await agent.updatePreferences(session.user.id, vibe);
}
