"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Globe, Zap, TreeDeciduous, Wind, ShieldCheck, Info, Activity, ChevronRight } from 'lucide-react';
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
    tacticalAnalysis?: string;
}

export function EcoPilotTool() {
    const [dest, setDest] = useState('Tokyo, Japan');
    const [duration, setDuration] = useState(10);
    const [travelers, setTravelers] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<EcoResult | null>(null);

    const handleCalculate = async () => {
        setIsLoading(true);
        const res = await calculateEcoImpactAction(dest, duration, travelers);
        if (res.success) setResult(res.data as EcoResult);
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-6 font-sans">
            {/* TOP BAR / HUD */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/5 pb-6">
                <div className="text-right w-full">
                    <div className="flex items-center gap-3 justify-end mb-2">
                        <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">אופטימיזציית פחמן מאושרת</div>
                        <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                            ECO <span className="text-emerald-500">PILOT</span>
                        </h2>
                    </div>
                    <p className="text-[9px] font-mono uppercase tracking-[0.5em] text-white/20">LUMINA SUSTAINABILITY QUANTUM ENGINE v2.5</p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
                {/* CONTROL DECK (LEFT/TOP) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-lumina p-8 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Leaf className="w-20 h-20 text-emerald-500 rotate-12" />
                        </div>

                        <div className="space-y-6 relative z-10">
                            {/* Destination Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block text-right">יעד המשימה</label>
                                <div className="relative group/input">
                                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 opacity-50 group-hover/input:opacity-100 transition-opacity" />
                                    <input
                                        type="text"
                                        value={dest}
                                        onChange={(e) => setDest(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-14 text-lg font-bold focus:border-emerald-500 outline-none transition-all hover:bg-white/[0.04] text-right"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Duration */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block text-right">ימי פריסה</label>
                                    <input
                                        type="number"
                                        value={duration}
                                        onChange={(e) => setDuration(Number(e.target.value))}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 text-xl font-black focus:border-emerald-500 outline-none transition-all hover:bg-white/[0.04] text-center"
                                    />
                                </div>
                                {/* Ops Count */}
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest block text-right">מספר סוכנים</label>
                                    <input
                                        type="number"
                                        value={travelers}
                                        onChange={(e) => setTravelers(Number(e.target.value))}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 px-6 text-xl font-black focus:border-emerald-500 outline-none transition-all hover:bg-white/[0.04] text-center"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCalculate}
                            disabled={isLoading}
                            className="w-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.3em] py-6 rounded-2xl transition-all disabled:opacity-50 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-4 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span className="text-[11px]">סורק השפעה...</span>
                                </div>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 text-gold animate-pulse" />
                                    <span className="text-[11px]">הפעל מנוע אופטימיזציה</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Secondary Status Panel */}
                    <div className="glass-lumina p-6 rounded-[2rem] border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-mono text-emerald-500/50 uppercase tracking-[0.2em]">0.34ms latency</span>
                            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">סטטוס רשת</span>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 24 }).map((_, i) => (
                                <div key={i} className={`h-4 flex-1 rounded-sm ${i < 18 ? 'bg-emerald-500/20' : 'bg-white/5'}`} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* INTELLIGENCE FEEDBACK (RIGHT/BOTTOM) */}
                <div className="lg:col-span-8 overflow-hidden flex flex-col">
                    <AnimatePresence mode="wait">
                        {!result && !isLoading ? (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[3rem] p-20 text-center"
                            >
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 relative">
                                    <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" />
                                    <ShieldCheck className="w-10 h-10 text-white/20 relative z-10" />
                                </div>
                                <h3 className="text-xl font-black text-white/30 uppercase tracking-[0.2em] mb-4">ממתין לפקודה</h3>
                                <p className="text-xs text-white/10 font-mono uppercase tracking-widest leading-relaxed">
                                    הכנס פרטי יעד ומשך שהות לקבלת <br /> ניתוח פחמן מלא ומפת דרכים לקיימות
                                </p>
                            </motion.div>
                        ) : isLoading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex-1 flex flex-col items-center justify-center glass-lumina rounded-[3rem] border border-white/5 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]" />
                                <div className="relative">
                                    <div className="w-32 h-32 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_50px_rgba(16,185,129,0.2)]" />
                                    <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-emerald-500 animate-pulse" />
                                </div>
                                <div className="mt-10 text-center">
                                    <p className="text-xs font-mono text-emerald-500/60 animate-pulse uppercase tracking-[0.5em]">Decomposing trip footprint...</p>
                                    <div className="flex gap-1 justify-center mt-4">
                                        {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />)}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className="flex-1 overflow-y-auto custom-scrollbar space-y-8"
                            >
                                {result && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="glass-lumina p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-emerald-500/[0.08] to-transparent text-right">
                                            <div className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.2em] mb-2">טביעת פחמן (KG CO2E)</div>
                                            <div className="text-5xl font-black text-white tracking-tighter">{result.carbonFootprint}</div>
                                            <div className="mt-4 flex items-center gap-2 justify-end">
                                                <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">דיוק מוערך: 98.4%</span>
                                            </div>
                                        </div>
                                        <div className="glass-lumina p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-gold/[0.05] to-transparent text-right">
                                            <div className="text-[10px] font-black text-gold/50 uppercase tracking-[0.2em] mb-2">דירוג קיימות LUMINA</div>
                                            <div className="text-5xl font-black text-gold tracking-tighter">{result.ecoRating}<span className="text-sm opacity-30">/10</span></div>
                                            <div className="mt-4 flex items-center gap-2 justify-end">
                                                <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden max-w-[100px]">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${result.ecoRating * 10}%` }} className="h-full bg-gold shadow-[0_0_10px_#ffd700]" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="glass-lumina p-8 rounded-[2rem] border border-white/5 text-right bg-gradient-to-br from-[#3b82f6]/[0.05] to-transparent">
                                            <div className="text-[10px] font-black text-[#3b82f6]/50 uppercase tracking-[0.2em] mb-2">עלות קיזוז יוקרה</div>
                                            <div className="text-5xl font-black text-white tracking-tighter">${result.offsetCost}</div>
                                            <button className="mt-4 text-[9px] font-black text-[#3b82f6] uppercase tracking-[0.2em] hover:text-white transition-colors flex items-center gap-2 justify-end ml-auto">
                                                שדרג לטיסה ניטרלית פחמן <ChevronRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* EQUIVALENTS INFOGRAPHIC */}
                                {result && (
                                    <div className="glass-lumina p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-emerald-500/[0.01] pointer-events-none" />
                                        <div className="flex items-center gap-2 justify-end mb-8">
                                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">לקסיקון השפעה טקטי</span>
                                            <Info className="w-3 h-3 text-emerald-500" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {result.equivalents.map((eq, i) => (
                                                <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl text-right group hover:bg-white/[0.04] transition-all">
                                                    <div className="flex justify-end mb-3">
                                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                                            <Activity className="w-4 h-4 text-emerald-500/40" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[13px] font-bold text-white/70 leading-relaxed italic">{eq}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* TACTICAL ANALYSIS BOX */}
                                {result?.tacticalAnalysis && (
                                    <div className="p-8 bg-emerald-950/20 border-r-4 border-emerald-500 rounded-l-[2rem] rounded-r-lg relative overflow-hidden">
                                        <div className="absolute top-0 left-0 p-4 opacity-10">
                                            <Zap className="w-20 h-20 text-emerald-500" />
                                        </div>
                                        <div className="flex flex-row-reverse items-center gap-4 mb-3">
                                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">ניתוח אסטרטגי מאת ECO-PILOT</h4>
                                        </div>
                                        <p className="text-lg font-bold text-white/80 leading-relaxed text-right relative z-10 italic">
                                            "{result.tacticalAnalysis}"
                                        </p>
                                    </div>
                                )}

                                {/* ELITE ALTERNATIVES */}
                                {result && (
                                    <div className="space-y-6">
                                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] text-right px-4">מפות דרכים חלופיות (ELITE SELECTION)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {result.greenAlternatives.map((alt, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ y: -5 }}
                                                    className="glass-lumina p-6 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all flex flex-col group h-full"
                                                >
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">{alt.impactReduction} חסכון פחמן</div>
                                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-emerald-500/10 transition-colors">
                                                            {alt.type.toLowerCase().includes('stay') ? <Globe className="w-4 h-4 text-emerald-500/50" /> : <Wind className="w-4 h-4 text-emerald-500/50" />}
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-1">
                                                        <h5 className="text-md font-black text-white mb-2 leading-tight">{alt.title}</h5>
                                                        <p className="text-[11px] text-white/40 leading-relaxed font-medium">{alt.description}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
