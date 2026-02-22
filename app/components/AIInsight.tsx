'use client';

import { useState } from 'react';
import { explainDeal } from '../actions/ai-features';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, ShieldCheck, Zap, Sparkles } from 'lucide-react';

interface AIInsightProps {
    dealTitle: string;
    price: number;
    originalPrice: number;
}

interface StructuredInsight {
    verdict: string;
    pros: string[];
    cons: string[];
    vibe?: string;
}

export default function AIInsight({ dealTitle, price, originalPrice }: AIInsightProps) {
    const [insight, setInsight] = useState<StructuredInsight | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchInsight = async () => {
        if (insight) {
            setIsOpen(!isOpen);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const data = await explainDeal(dealTitle, price, originalPrice);
            // Even if it's a fallback string, our server action now returns a StructuredInsight-like object
            setInsight(data as StructuredInsight);
            setIsOpen(true);
        } catch (err: unknown) {
            setError("AI is taking a nap. Try again soon!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-2">
            <button
                onClick={fetchInsight}
                disabled={isLoading}
                className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors group px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50"
            >
                <Sparkles className={`w-3 h-3 ${isLoading ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
                {isLoading ? 'Consulting Gemini...' : insight ? (isOpen ? 'Hide Insight' : 'Show AI Vibe') : 'Why this deal?'}
            </button>

            <AnimatePresence>
                {isOpen && insight && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/30 rounded-2xl border border-blue-100/30">
                                {insight.vibe && (
                                    <div className="inline-block px-2 py-0.5 rounded-md bg-blue-600 text-[10px] text-white font-black uppercase tracking-widest mb-2">
                                        {insight.vibe} VIBE
                                    </div>
                                )}
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                    {insight.verdict}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> Pros
                                    </p>
                                    <ul className="space-y-1">
                                        {insight.pros.map((pro, i) => (
                                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                                                <span className="text-emerald-500">•</span>
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-2 text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-1 justify-end">
                                        Cons <Info className="w-3 h-3" />
                                    </p>
                                    <ul className="space-y-1">
                                        {insight.cons.map((con, i) => (
                                            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5 justify-end">
                                                {con} <span className="text-amber-500">•</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <p className="text-[10px] text-red-500 mt-2 italic font-medium">{error}</p>
            )}
        </div>
    );
}
