import { z } from 'zod';

/**
 * Standardized Sentinel Error Codes
 */
export const SENTINEL_ERRORS = {
    HALLUCINATION: 'ERR_AI_HALLUCINATION',
    INVALID_RANGE: 'ERR_INVALID_RANGE',
    TIMEOUT: 'ERR_API_TIMEOUT',
} as const;

/**
 * Strict Search Query Schema
 * Enforces: Destination length, positive budget, and logical dates.
 */
export const SearchQuerySchema = z.object({
    destination: z
        .string()
        .min(2, "Destination must be at least 2 characters")
        .max(100, "Destination too long")
        .trim()
        .optional(),
    budget: z
        .number()
        .positive("Budget must be a positive number")
        .max(1000000, "Budget exceeds common sense")
        .optional(),
    month: z
        .string()
        .regex(/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format")
        .optional(),
    vibe: z
        .string()
        .max(50, "Vibe description too long")
        .optional(),
    fuzzyDates: z.boolean().default(false),
    dates: z.object({
        start: z.string().datetime().refine((val) => {
            const date = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date >= today;
        }, {
            message: "Start date cannot be in the past",
        }),
        end: z.string().datetime(),
    }).optional().refine((data) => {
        if (!data) return true;
        return new Date(data.end) > new Date(data.start);
    }, {
        message: "End date must be after start date",
        path: ["end"],
    }),
}).refine((data) => {
    // Ensure either specific dates or a month is provided
    return !!data.month || !!data.dates || !!data.destination;
}, {
    message: "Either destination, specific dates, or a month must be provided",
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

/**
 * Sanitizer: Strips potentially malicious prompt injection keywords
 */
export function sanitizeInput(input: string): string {
    if (!input) return "";

    // Instruction Stripping (Anti-Injection)
    const injectionPatterns = [
        /ignore previous instructions/gi,
        /system:/gi,
        /user:/gi,
        /assistant:/gi,
        /you are a/gi,
        /forget your/gi,
        /override/gi,
        /<script.*?>.*?<\/script>/gi,
    ];

    let clean = input;
    injectionPatterns.forEach(pattern => {
        clean = clean.replace(pattern, "[CLEANED]");
    });

    return clean
        .trim()
        .slice(0, 500); // Length Constraint (500 chars max)
}

/**
 * Standardized AI Outcome Schema
 * Used to validate outputs from Sub-Agents (Flights, Hotels)
 */
export const AgentOutcomeSchema = z.object({
    success: z.boolean(),
    data: z.unknown().optional(), // Specific sub-schemas would refine this further
    error: z.string().optional(),
    hallucinationDetected: z.boolean().default(false)
});

/**
 * Sentinel: Server-side Price Alert Schema
 * Validates ObjectId format (24-char hex) and a sane price range.
 */
const objectIdRegex = /^[a-fA-F0-9]{24}$/;

export const PriceAlertSchema = z.object({
    userId: z
        .string()
        .regex(objectIdRegex, 'Invalid userId format'),
    destinationId: z
        .string()
        .regex(objectIdRegex, 'Invalid destinationId format'),
    targetPrice: z
        .number()
        .int('Target price must be a whole number')
        .positive('Target price must be positive')
        .max(50000, 'Target price exceeds maximum allowed'),
});

export type PriceAlertInput = z.infer<typeof PriceAlertSchema>;

/**
 * Sentinel: Client-side Price Alert Form Schema
 * Validates raw string input from the form before parsing.
 */
export const PriceAlertFormSchema = z.object({
    targetPrice: z
        .string()
        .min(1, 'Please enter a target price')
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: 'Must be a valid positive number',
        })
        .refine((val) => Number(val) <= 50000, {
            message: 'Price cannot exceed $50,000',
        }),
});

export type PriceAlertFormInput = z.infer<typeof PriceAlertFormSchema>;
