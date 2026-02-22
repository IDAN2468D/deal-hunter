"use server";

import { BudgetOptimizer, BudgetSplit } from "@/lib/agents/budget-optimizer";
import { auth } from "@/auth";

const optimizer = new BudgetOptimizer();

export async function optimizeBudgetAction(
    totalBudget: number,
    destination: string,
    participants: number,
    days: number
): Promise<{ success: boolean; data?: BudgetSplit; error?: string }> {
    try {
        const session = await auth();
        // Option to restrict to logged in users, but keeping it open for MVP w/ AI

        const data = await optimizer.optimize(totalBudget, destination, participants, days);
        return { success: true, data };
    } catch (error) {
        return { success: false, error: "Failed to optimize budget" };
    }
}
