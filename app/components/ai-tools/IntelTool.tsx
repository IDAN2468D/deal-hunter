"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Megaphone, Target, Sparkles, Activity, Star } from 'lucide-react';
import { summarizeDestinationReviews } from '@/app/actions/reviews';
import { ReviewSummary } from '@/lib/agents/review-summarizer';

export function IntelTool() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState<ReviewSummary | null>(null);

    // Mock reviews if no real data is passed
    const runAnalysis = async () => {
        setIsProcessing(true);
        try {
            // Simulated call - in real app we'd fetch actual reviews from a tool/API
            const res = await summarizeDestinationReviews("sample-id", [
                "The view was incredible but the lines were long.",
                "Best pasta I ever had, but the hotel was a bit loud.",
                "Very safe city, great for walking around at night.",
                "Expensive, but worth every penny for the luxury feel."
            ]);
            if (res.success && res.summary) setSummary(res.summary);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white text-right">
                        ליבת <span className="text-amber-500">מודיעין</span> ביקורות
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1 text-right">חילוץ סנטימנט NLP v1.9</p>
                </div>
                <button
                    onClick={runAnalysis}
                    disabled={isProcessing}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl transition-all shadow-[0_10px_40px_rgba(245,158,11,0.2)] disabled:opacity-50 flex items-center gap-3"
                >
                    <Activity className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                    {isProcessing ? 'מנתח סנטימנט...' : 'התחל ניתוח NLP'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Pros List */}
                <div className="glass-tactical rounded-[3rem] border border-white/5 p-10 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <ThumbsUp className="w-40 h-40 text-green-500" />
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <ThumbsUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest text-right">יתרונות טקטיים</h3>
                    </div>

                    <div className="space-y-4 relative z-10">
                        {summary ? summary.pros?.map((pro: string, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                <span className="text-sm font-medium text-white/70 uppercase tracking-tight text-right">{pro}</span>
                            </motion.div>
                        )) : (
                            [1, 2, 3].map(i => (
                                <div key={i} className="h-14 bg-white/[0.02] border border-white/5 rounded-2xl opacity-20 border-dashed" />
                            ))
                        )}
                    </div>
                </div>

                {/* Cons & Stats */}
                <div className="space-y-8 flex flex-col">
                    <div className="glass-tactical rounded-[3rem] border border-white/5 p-10 flex-1 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ThumbsDown className="w-40 h-40 text-red-500" />
                        </div>

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <ThumbsDown className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest text-right">איומים מבצעיים</h3>
                        </div>

                        <div className="space-y-4 relative z-10">
                            {summary ? summary.cons?.map((con: string, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                    <span className="text-sm font-medium text-white/70 uppercase tracking-tight text-right">{con}</span>
                                </motion.div>
                            )) : (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="h-14 bg-white/[0.02] border border-white/5 rounded-2xl opacity-20 border-dashed" />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Summary Intelligence */}
                    <div className="glass-tactical rounded-[2.5rem] border border-white/5 p-8 relative overflow-hidden">
                        <div className="flex items-center justify-end gap-4 mb-4">
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest text-right">סיכום נוירוני</span>
                            <Sparkles className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-sm font-medium text-white/50 leading-relaxed italic font-mono text-right">
                            {summary ? `"${summary.summaryText}"` : "ממתין לנתוני יעד עבור עיבוד NLP..."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
