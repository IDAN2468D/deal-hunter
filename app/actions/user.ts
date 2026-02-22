'use server';

import { determineUserPersona, PersonaType } from "@/lib/ai-persona";

export async function getUserPersonaAction(userId: string): Promise<PersonaType> {
    return determineUserPersona(userId);
}
