"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, Zap, TreeDeciduous, Wind, ShieldCheck, Info } from 'lucide-react';
import { calculateEcoImpactAction } from '@/app/actions/eco-pilot';

interface EcoResult {
    carbonFootprint: number;
    equivalents: string[];
    greenAlternatives: {
        type: string;
        title: string;
        impactReduction: string;
        description: string;
    }[];
    offsetCost: number;
    ecoRating: number;
}

export function EcoPilotTool() {
    const [dest, setDest] = useState('Paris, France');
    const [duration, setDuration] = useState(7);
    const [travelers, setTravelers] = useState(2);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<EcoResult | null>(null);

    const handleCalculate = async () => {
        setIsLoading(true);
        const res = await calculateEcoImpactAction(dest, duration, travelers);
        if (res.success) setResult(res.data as EcoResult);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-10">
            {/* Header Area */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white text-right">
                        מצפן <span className="text-emerald-500">קיימות</span> ECO
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1 text-right">ניטור פליטות פחמן וחלופות ירוקות v1.0</p>
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/20" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/40" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Inputs Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between px-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">יעד הטיסה</span>
                            <Globe className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                value={dest}
                                onChange={(e) => setDest(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500 outline-none transition-all group-hover:bg-white/[0.05] text-right"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex justify-between px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">משך שהות (ימים)</span>
                                <Wind className="w-3 h-3 text-emerald-500" />
                            </div>
                            <input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500 outline-none transition-all group-hover:bg-white/[0.05] text-center"
                            />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between px-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30 text-right">מספר נוסעים</span>
                                <TreeDeciduous className="w-3 h-3 text-emerald-500" />
                            </div>
                            <input
                                type="number"
                                value={travelers}
                                onChange={(e) => setTravelers(Number(e.target.value))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-3xl py-6 px-8 text-2xl font-black focus:border-emerald-500 outline-none transition-all group-hover:bg-white/[0.05] text-center"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCalculate}
                        disabled={isLoading}
                        className="w-full bg-emerald-600 text-white font-black uppercase tracking-[0.2em] py-6 rounded-3xl hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-3">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                <span>מנתח השפעה סביבתית...</span>
                            </div>
                        ) : (
                            <>
                                <Leaf className="w-5 h-5" />
                                <span>חשב חתימה אקולוגית</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Results Section */}
                <div className="relative">
                    {!result && !isLoading && (
                        <div className="h-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem] p-12 text-center opacity-20">
                            <Globe className="w-20 h-20 mb-6" />
                            <p className="text-xs font-black uppercase tracking-widest leading-relaxed text-right">
                                ממתין לנתוני טיסה <br /> המנתח האקולוגי מוכן
                            </p>
                        </div>
                    )}

                    {isLoading && (
                        <div className="h-full flex flex-col items-center justify-center border border-white/5 bg-white/[0.02] rounded-[3rem] p-12 overflow-hidden">
                            <div className="absolute inset-0 cyber-grid opacity-10" />
                            <div className="w-16 h-16 border-4 border-t-emerald-500 border-white/5 rounded-full animate-spin mb-6" />
                            <p className="text-[10px] font-mono text-emerald-500 animate-pulse text-right">מחשב מטריקות פחמן...</p>
                        </div>
                    )}

                    {result && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-8 glass-tactical rounded-[3rem] border border-white/10 h-full flex flex-col overflow-y-auto custom-scrollbar relative"
                        >
                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] text-right">
                                    <div className="text-[8px] font-black text-white/20 uppercase mb-1">פליטת CO2 מוערכת</div>
                                    <div className="text-3xl font-black text-emerald-400">{result.carbonFootprint}kg</div>
                                </div>
                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-[2rem] text-right">
                                    <div className="text-[8px] font-black text-white/20 uppercase mb-1">דירוג אקו</div>
                                    <div className="text-3xl font-black text-gold">{result.ecoRating}/10</div>
                                </div>
                            </div>

                            {/* Equivalents */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">משמעות המספרים</span>
                                    <Info className="w-3 h-3 text-emerald-500" />
                                </div>
                                <div className="space-y-2">
                                    {result.equivalents.map((eq, i) => (
                                        <div key={i} className="py-2 px-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-200/60 text-right">
                                            {eq}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alternatives */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center gap-2 justify-end">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">חלופות ירוקות מומלצות</span>
                                    <Zap className="w-3 h-3 text-emerald-500" />
                                </div>
                                <div className="space-y-3">
                                    {result.greenAlternatives.map((alt, i) => (
                                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-emerald-500/20 text-emerald-400 text-[8px] px-2 py-1 rounded-full font-black uppercase">{alt.impactReduction} חסכון</span>
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-white">{alt.title}</div>
                                                    <div className="text-[8px] font-mono text-white/20 italic">{alt.type}</div>
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-white/40 text-right leading-relaxed">{alt.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Offset CTA */}
                            <div className="mt-auto pt-6 border-t border-white/5">
                                <button className="w-full py-4 bg-white/[0.03] border border-emerald-500/30 rounded-2xl flex items-center justify-between px-6 hover:bg-emerald-500/10 transition-all group">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">קזז פליטות עכשיו</div>
                                        <div className="text-[8px] text-white/20 font-mono">עלות מוערכת: ${result.offsetCost} USD</div>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
