/**
 * AgentTask Interface
 * Defines a single sub-task for specialized agents (Flights, Hotels, etc.)
 */
export interface AgentTask {
    type: 'flight' | 'hotel' | 'activity';
    destination: string;
    budget: number;
    startDate: string; // ISO Date or "FLEXIBLE"
    endDate: string;   // ISO Date or "FLEXIBLE"
    requirements: string[];
}

/**
 * Orchestrator Task Result
 */
export interface OrchestratorOutcome {
    tasks: AgentTask[];
    query: string;
    timestamp: string;
}

export interface AgentSearchResult {
    success: boolean;
    data?: {
        logId: string;
        tasks: AgentTask[];
    };
    error?: string;
}
