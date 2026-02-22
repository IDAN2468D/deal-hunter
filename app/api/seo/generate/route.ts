import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const trendTopic = body.topic || "budget friendly remote work destinations in Europe";

        console.log(`SEO FACTORY: Generating content for trend: ${trendTopic}`);

        const prompt = `
            You are an expert SEO Content Writer and Travel Deal Broker.
            Write an SEO optimized landing page for the keyword: "${trendTopic}".
            
            We need:
            1. An extremely catchy, URL-safe slug (e.g., cheap-remote-work-europe-2026).
            2. A high-converting H1 Title.
            3. A compelling meta description (max 160 chars).
            4. The main content in semantic HTML using Tailwind CSS classes for styling. 
               Make it beautiful. Use <section>, <h2>, <p className="mb-4 text-neutral-300">, and <ul> lists.
               Do NOT use markdown html blocks, just raw string HTML.
            You must return strictly typed JSON.
        `;

        const SeoSchema = z.object({
            slug: z.string(),
            title: z.string(),
            metaDesc: z.string(),
            content: z.string(),
        });

        // The Orchestrator delegates to Architect/Builder
        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: SeoSchema,
            prompt,
        });

        // The Sentinel: Validate output
        if (!result.object.slug || !result.object.content) {
            throw new Error("AI failed to generate valid content structure.");
        }

        // Save to Database
        // Assuming SeoPage exists if push hasn't run
        type SeoPageDelegate = { upsert: (args: unknown) => Promise<unknown> };
        const p = prisma as unknown as Record<string, SeoPageDelegate | undefined>;
        const seoPage = p.seoPage ? await p.seoPage.upsert({
            where: { slug: result.object.slug },
            update: {
                title: result.object.title,
                metaDesc: result.object.metaDesc,
                content: result.object.content,
                status: "published"
            },
            create: {
                slug: result.object.slug,
                title: result.object.title,
                metaDesc: result.object.metaDesc,
                content: result.object.content,
                status: "published"
            }
        }) : null;

        return NextResponse.json({ success: true, page: seoPage });

    } catch (e: unknown) {
        console.error("SEO Factory Error:", e);
        return NextResponse.json({ success: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
