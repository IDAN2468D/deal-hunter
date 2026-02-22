"use server";

import { VisualAnalyzer } from "@/lib/agents/visual-analyzer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const analyzer = new VisualAnalyzer();

export async function visualSearchAction(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("image") as File;
    if (!file) throw new Error("No image provided");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const analysis = await analyzer.analyzeImageUrl(buffer, file.type);

    // Save to SearchLog
    await prisma.searchLog.create({
        data: {
            query: `Visual Search: ${analysis.destination}`,
            userId: session.user.id,
            status: "COMPLETED",
            agentModel: "gemini-2.5-flash",
            // Note: We'd normally upload the image to S3/Cloudinary here and save the URL
            // For now just storing the destination name
        }
    });

    // Find destination in DB
    const destination = await prisma.destination.findFirst({
        where: {
            OR: [
                { name: { contains: analysis.destination, mode: 'insensitive' } },
                { country: { contains: analysis.country, mode: 'insensitive' } }
            ]
        }
    });

    return {
        success: true,
        analysis,
        destinationId: destination?.id
    };
}
