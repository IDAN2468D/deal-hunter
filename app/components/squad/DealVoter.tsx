"use client";

import { useState } from "react";
import { castDealVote } from "@/app/actions/squad-actions";
import { Check, X } from "lucide-react";
import type { Deal } from "@prisma/client";

interface DealVoterProps {
    deal: Deal;
    roomId: string;
    userId: string;
    initialVote?: "UPVOTE" | "DOWNVOTE" | null;
}

export function DealVoter({ deal, roomId, userId, initialVote = null }: DealVoterProps) {
    const [currentVote, setCurrentVote] = useState<"UPVOTE" | "DOWNVOTE" | null>(initialVote);
    const [isVoting, setIsVoting] = useState(false);

    async function handleVote(voteType: "UPVOTE" | "DOWNVOTE") {
        if (isVoting) return;
        setIsVoting(true);

        // Optimistic update
        const previousVote = currentVote;
        setCurrentVote(voteType);

        const formData = new FormData();
        formData.append("roomId", roomId);
        formData.append("dealId", deal.id);
        formData.append("userId", userId);
        formData.append("vote", voteType);

        const result = await castDealVote(formData);

        if (!result.success) {
            console.error(result.error);
            // Revert on failure
            setCurrentVote(previousVote);
        }

        setIsVoting(false);
    }

    return (
        <div className="flex items-center gap-2 mt-4">
            <button
                onClick={() => handleVote("DOWNVOTE")}
                disabled={isVoting}
                className={`p-2 rounded-full border transition-colors ${currentVote === "DOWNVOTE"
                        ? "bg-red-100 border-red-500 text-red-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    } disabled:opacity-50`}
                aria-label="Downvote deal"
            >
                <X className="w-5 h-5" />
            </button>

            <button
                onClick={() => handleVote("UPVOTE")}
                disabled={isVoting}
                className={`p-2 rounded-full border transition-colors ${currentVote === "UPVOTE"
                        ? "bg-emerald-100 border-emerald-500 text-emerald-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                    } disabled:opacity-50`}
                aria-label="Upvote deal"
            >
                <Check className="w-5 h-5" />
            </button>

            {currentVote && (
                <span className="text-sm font-medium text-gray-600 ml-2">
                    {currentVote === "UPVOTE" ? "Liked" : "Passed"}
                </span>
            )}
        </div>
    );
}
