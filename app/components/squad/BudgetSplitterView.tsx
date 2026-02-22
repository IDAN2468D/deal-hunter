"use client";

import { useState, useEffect } from "react";
import { calculateBudgetSplit } from "@/app/actions/squad-actions";
import { Coins, Receipt } from "lucide-react";

interface BudgetSplitterProps {
    roomId: string;
    totalCost: number;
}

export function BudgetSplitterView({ roomId, totalCost }: BudgetSplitterProps) {
    const [splits, setSplits] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSplits() {
            setIsLoading(true);
            const res = await calculateBudgetSplit(roomId, totalCost);
            if (res.success) {
                setSplits(res.splitDetails || []);
                setError(null);
            } else {
                setError(res.error || "Failed to calculate split");
            }
            setIsLoading(false);
        }

        if (totalCost > 0) {
            fetchSplits();
        } else {
            setIsLoading(false);
        }
    }, [roomId, totalCost]);

    if (isLoading) {
        return <div className="animate-pulse flex space-x-4 p-4 border rounded-xl bg-gray-50 h-32"></div>;
    }

    if (error) {
        return <div className="p-4 text-red-500 bg-red-50 rounded-xl border border-red-200">{error}</div>;
    }

    if (splits.length === 0) {
        return null;
    }

    return (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 border-b pb-4 mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Receipt className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Budget Splitter</h3>
                    <p className="text-sm text-gray-500">Total estimated cost: ${totalCost.toFixed(2)}</p>
                </div>
            </div>

            <div className="space-y-4">
                {splits.map((split) => (
                    <div key={split.userId} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                {split.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{split.name}</p>
                                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
                                    <Coins className="w-3 h-3" />
                                    Point Savings: -${split.pointDiscount.toFixed(2)}
                                </div>
                            </div>
                        </div>

                        <div className="text-right pl-12 sm:pl-0">
                            <p className="text-xs text-gray-400 line-through">${split.baseShare.toFixed(2)}</p>
                            <p className="text-lg font-bold text-indigo-600">${split.finalShare.toFixed(2)}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm">
                <span className="text-gray-500">Using points logic saves money equally across members</span>
                <button className="text-indigo-600 font-medium hover:text-indigo-700 hover:underline">Request Payments</button>
            </div>
        </div>
    );
}
