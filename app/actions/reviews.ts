"use server";

import { ReviewSummarizer, ReviewSummary } from "@/lib/agents/review-summarizer";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const summarizer = new ReviewSummarizer();

export async function summarizeDestinationReviews(destinationId: string, reviews: string[]) {
    try {
        const summary = await summarizer.summarize(reviews);

        // Update destination with the summary
        await prisma.destination.update({
            where: { id: destinationId },
            data: {
                reviewSummary: summary.summaryText,
                // We could also store pros/cons in a JSON field if we added one
            }
        });

        revalidatePath(`/destinations/${destinationId}`);
        return { success: true, summary };
    } catch (error) {
        return { success: false, error: "Failed to summarize reviews" };
    }
}

export async function getDestinationSummary(destinationId: string) {
    const dest = await prisma.destination.findUnique({
        where: { id: destinationId },
        select: { reviewSummary: true, name: true }
    });
    return dest;
}
