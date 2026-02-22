import { generateObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const PersonaSchema = z.object({
  persona: z.enum(["luxury", "backpacker", "family", "neutral"]),
  reasoning: z.string().describe("Why this persona was chosen based on user data"),
});

export type PersonaType = z.infer<typeof PersonaSchema>["persona"];

/**
 * Determines the user concept/persona based on search logs, order history, and preferences.
 * Uses Gemini to classify the user into a specific bucket which drives the Generative UI.
 */
export async function determineUserPersona(userId: string): Promise<PersonaType> {
  try {
    // 1. Fetch relevant user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        preferences: true,
        searchLogs: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) return "neutral";

    // 2. Prepare context for AI
    const searchQueries = user.searchLogs.map((log) => log.query).join(", ");
    const preferences = user.preferences
      ? `Budget: ${user.preferences.maxBudget}, Vibes: ${user.preferences.preferredVibes.join(", ")}`
      : "No explicit preferences";

    const prompt = `
      Analyze the following user data from a travel deals platform and categorize their persona.
      
      User Search History: [${searchQueries || "None"}]
      User Preferences: [${preferences}]
      
      Categorize the user into ONE of the following:
      - luxury: High budget, 5-star hotels, exclusive experiences.
      - backpacker: Low budget, hostels, long-term travel, adventurous.
      - family: Kid-friendly, resorts, safety-focused, group travel.
      - neutral: Not enough data or average traveler, mixed signals.
      
      Return the persona and a brief reasoning.
    `;

    // 3. Generate Persona Analysis
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: PersonaSchema,
      prompt,
    });

    // 4. Update the DB asynchronously (fire and forget)
    // Wrap in try-catch so it doesn't fail the request if the field doesn't exist yet
    try {
      if (result.object.persona) {
        // Type casting to any here as a temporary workaround until prisma generate is explicitly run
        const prismaAny = prisma as any;
        if (prismaAny.userProfile) {
          await prismaAny.userProfile.upsert({
            where: { userId },
            update: { persona: result.object.persona, metrics: { reason: result.object.reasoning } },
            create: { userId, persona: result.object.persona, metrics: { reason: result.object.reasoning } },
          });
        }
      }
    } catch (e) {
      console.error("Failed to update UserProfile:", e);
    }

    return result.object.persona;
  } catch (error) {
    console.error("Error determining persona:", error);
    return "neutral"; // Fallback to safe default
  }
}
