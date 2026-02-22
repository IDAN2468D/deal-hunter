# 🛡️ Security & Validation Layer Specification
**Role:** The Sentinel | **Version:** 1.0 | **Protocol:** v4.2 Agentic

---

## 1. Zod Schema Definition (The "No Any" Law)

To ensure zero `any` types and strict runtime validation, we define the `SearchQuerySchema`.

```typescript
import { z } from 'zod';

export const SearchQuerySchema = z.object({
  destination: z
    .string()
    .min(2, "Destination must be at least 2 characters")
    .max(100, "Destination too long")
    .trim(),
  budget: z
    .number()
    .positive("Budget must be a positive number")
    .max(1000000, "Budget exceeds common sense"),
  dates: z.object({
    start: z.string().datetime().refine((val) => new Date(val) >= new Date(), {
      message: "Start date cannot be in the past",
    }),
    end: z.string().datetime(),
  }).refine((data) => new Date(data.end) > new Date(data.start), {
    message: "End date must be after start date",
    path: ["end"],
  }),
});

// Inferred Types (No Any Law)
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
```

---

## 2. API Safety & Error Handling

### Error Policy (Zero Defects)
Standardized error codes to prevent leaking system internals while providing clear user feedback.

| Failure Point | Error Code | User Message |
| :--- | :--- | :--- |
| **Logic Mismatch** | `ERR_AI_HALLUCINATION` | "AI analysis provided inconsistent data. Refreshing..." |
| **Validation Fail** | `ERR_INVALID_RANGE` | "Budget or Dates are outside of allowed thresholds." |
| **Gateway Delay** | `ERR_API_TIMEOUT` | "AI server is taking too long to respond. Retrying..." |

### Sanitization (Anti-Injection)
Before data reaches the Gemini API, the Sentinel enforces:
1. **Instruction Stripping**: Removing keywords like `Ignore previous instructions`, `System:`, or `User:`.
2. **Template Hardening**: Inputs are injected into a fixed JSON template where keys are pre-defined, and user input is treated only as string values.
3. **Length Constraints**: Hard caps on string inputs to prevent buffer/token overflow attacks.

---

## 3. Data Integrity & Fallbacks

> [!IMPORTANT]
> **The Defensive Programming Law:** Assume every agent output is potentially corrupt.

### Sub-Agent Fallback Matrix

| Flight Agent | Hotel Agent | Resulting UI State |
| :--- | :--- | :--- |
| ✅ Success | ✅ Success | Full Itinerary Shown |
| ✅ Success | ❌ Failure | "Flights Found. Hotel data is currently loading..." (Graceful degradation) |
| ❌ Failure | ✅ Success | "Hotels Found. Flight details unavailable." |
| ❌ Failure | ❌ Failure | "AI Search Service currently limited. Show standard deals?" |

---

## 4. Execution Workflow
1. Input received -> `SearchQuerySchema.safeParse()`.
2. Sanitization script cleans strings.
3. Orchestrator triggers sub-agents.
4. Sentinel validates sub-agent JSON outputs against internal schemas.
