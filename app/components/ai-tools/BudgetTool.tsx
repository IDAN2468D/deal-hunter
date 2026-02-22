"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Globe, Zap, Target, TrendingUp, PieChart } from 'lucide-react';
import { optimizeBudgetAction } from '@/app/actions/ai-budget';

interface BudgetResult {
    reasoning: string;
    currency: string;
    [key: string]: number | string;
}

export function BudgetTool({ result, setResult }: { result: unknown, setResult: (val: unknown) => void }) {
    const [budget, setBudget] = useState(5000);
    const [dest, setDest] = useState('Bali, Indonesia');
    const [isLoading, setIsLoading] = useState(false);

    const handleOptimize = async () => {
        setIsLoading(true);
        const res = await optimizeBudgetAction(budget, dest, 2, 7);
        if (res.success) setResult(res.data);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-10">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white text-right">
                        מקצה <span className="text-blue-500">תקציב</span> חכם
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1 text-right">אופטימיזציה פיננסית נוירונית v2.1</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500/20" />
                    <div className="w-2 h-2 rounded-full bg-blue-500/40" />
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inputs Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">הקצאת הון</span>
                            <DollarSign className="w-3 h-3 text-[#3b82f6]" />
                        </div>
                        <div className="relative group">
                            <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-3xl font-black focus:border-[#3b82f6] outline-none transition-all group-hover:bg-white/[0.05]"
                            />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/20 uppercase tracking-widest">דולר_נזיל</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">אזור פריסה</span>
                            <Target className="w-3 h-3 text-[#3b82f6]" />
                        </div>
                        <div className="relative group">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-[#3b82f6] w-5 h-5" />
                            <input
                                type="text"
                                value={dest}
                                onChange={(e) => setDest(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-16 text-xl font-bold focus:border-[#3b82f6] outline-none transition-all group-hover:bg-white/[0.05] text-right"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleOptimize}
                        disabled={isLoading}
                        className="w-full bg-[#3b82f6] text-white font-black uppercase tracking-[0.2em] py-6 rounded-3xl hover:bg-[#2563eb] transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(59,130,246,0.3)] flex items-center justify-center gap-4"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                <span>מעבד נתונים...</span>
                            </div>
                        ) : (
                            <>
                                <TrendingUp className="w-5 h-5" />
                                <span>הפעל סימולציה פיננסית</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="relative">
                    {!result && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem] p-12 text-center opacity-20">
                            <PieChart className="w-20 h-20 mb-6" />
                            <p className="text-xs font-black uppercase tracking-widest leading-relaxed text-right">
                                ממתין להזנת נתונים <br /> המערכת במצב המתנה
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem] p-12 overflow-hidden">
                            <div className="absolute inset-0 cyber-grid opacity-10" />
                            <div className="w-16 h-16 border-4 border-t-[#3b82f6] border-white/5 rounded-full animate-spin mb-6" />
                            <p className="text-[10px] font-mono text-[#3b82f6] animate-pulse text-right">מבצע אופטימיזציה לוקטורים...</p>
                        </div>
                    )}

                    {Boolean(result) && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-10 glass-tactical rounded-[3rem] border border-white/10 h-full flex flex-col justify-between overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <PieChart className="w-40 h-40" />
                            </div>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 relative z-10">
                                {Object.entries(result as BudgetResult).filter(([k]) => k !== 'reasoning' && k !== 'currency').map(([key, val], idx) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div className="text-[10px] font-black uppercase text-white/30 mb-2 tracking-widest">{key}</div>
                                        <div className="text-3xl font-black text-white">${(val as number).toLocaleString()}</div>
                                        <div className="h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((val as number) / budget) * 100}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-[#3b82f6]"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Zap className="w-3 h-3 text-[#3b82f6]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#3b82f6] text-right">תובנת אסטרטג AI</span>
                                </div>
                                <p className="text-sm text-white/60 leading-relaxed font-medium text-right italic">
                                    "{(result as BudgetResult).reasoning}"
                                </p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
