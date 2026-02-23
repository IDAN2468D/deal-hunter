import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';

// The Sentinel: Strict validation for incoming distress signals (errors)
const ErrorWebhookSchema = z.object({
    errorId: z.string(),
    message: z.string(),
    stackTrace: z.string(),
    environment: z.enum(['production', 'staging', 'development']).default('production'),
    timestamp: z.string().optional(),
});

// The Critic: Validation for the AI's generated patch
const PatchSchema = z.object({
    analysis: z.string().describe("Explanation of why the error occurred and how to fix it."),
    targetFile: z.string().describe("The absolute or relative path to the file that needs fixing."),
    patchContent: z.string().describe("The proposed code replacement or diff."),
    confidenceScore: z.number().min(0).max(100).describe("AI's confidence in this fix."),
    isBreakingChange: z.boolean(),
});

/**
 * The Exterminator + Architect
 * Listens for Vercel/Sentry webhooks, parses the stack trace, and generates an emergency hot-fix.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Zod Validation (The Sentinel)
        const parseResult = ErrorWebhookSchema.safeParse(body);
        if (!parseResult.success) {
            console.error("WEBHOOK REJECTED: Malformed payload", parseResult.error);
            return NextResponse.json({ error: "Invalid payload format" }, { status: 400 });
        }

        const errorData = parseResult.data;
        console.log(`EXTERMINATOR: Received Error [${errorData.errorId}] - Analyzing...`);

        // 2. AI Code-Patch Generation (The Builder)
        const prompt = `
            You are 'The Builder' and 'The Exterminator'. 
            A critical production error has occurred in our Next.js App.
            
            Error Message: ${errorData.message}
            Stack Trace: ${errorData.stackTrace}
            Environment: ${errorData.environment}
            
            Analyze the stack trace, identify the failing file, and write a code patch.
            Follow the "No Any" law. Assume strict TypeScript.
            Output your response adhering to the PatchSchema json.
        `;

        const result = await generateObject({
            model: google('gemini-2.5-flash'),
            schema: PatchSchema,
            prompt,
        });

        const patch = result.object;

        console.log(`BUILDER: Patch generated for ${patch.targetFile} (Confidence: ${patch.confidenceScore}%)`);

        // 3. 'Room of State' Logging
        // Instead of applying the patch blindly, we save it to an emergency directory for review or auto-GitHub action deployment.
        const logsDir = path.join(process.cwd(), '.emergency-patches');
        await fs.mkdir(logsDir, { recursive: true });

        const logFilePath = path.join(logsDir, `patch-${errorData.errorId}.json`);
        await fs.writeFile(logFilePath, JSON.stringify({ error: errorData, generatedPatch: patch }, null, 2));

        // 4. Build auto-deploy GitHub action trigger
        if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
            console.log("ORCHESTRATOR: Triggering GitHub Auto-Deploy Action for Hotfix...");
            await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/actions/workflows/hotfix-deploy.yml/dispatches`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'Authorization': `token ${process.env.GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    ref: 'main',
                    inputs: {
                        patchFile: logFilePath,
                        errorId: errorData.errorId
                    }
                })
            });
        }

        return NextResponse.json({
            success: true,
            message: "Error received, hot-fix generated, and auto-deploy triggered.",
            patchAction: patch
        });

    } catch (e: unknown) {
        console.error("SWARM FAILURE: Could not handle webhook.", e);
        return NextResponse.json({ success: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
    }
}
