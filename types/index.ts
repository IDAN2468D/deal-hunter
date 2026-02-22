import { Deal, Destination, User } from '@prisma/client';

export type { Deal, Destination, User };

export type DealWithDestination = Deal & {
    destination: Destination | null;
};

// Add other shared types here
export type SearchParams = {
    dest?: string;
    start?: string;
    end?: string;
    price?: string;
};

export interface AgentResult {
    success: boolean;
    data?: unknown; // Nested data structure varies by agent
    error?: string;
}

export interface SwarmResults {
    flights: AgentResult;
    hotels: AgentResult;
    timestamp: string;
}

export interface ToolInvocation {
    toolCallId: string;
    state: 'call' | 'partial-call' | 'result';
    result?: unknown;
    args?: Record<string, unknown>;
}

export interface ChatMessage {
    id: string;
    role: 'system' | 'user' | 'assistant' | 'data';
    content: string;
    toolInvocations?: ToolInvocation[];
}
