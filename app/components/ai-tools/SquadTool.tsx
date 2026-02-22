"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Shield, Zap, Target, Plane, Hotel, Cpu, MessageSquare, ChevronRight, Activity } from 'lucide-react';
import { orchestrateSearch } from '@/app/actions/agent-swarm';

interface AgentMessage {
    id: string;
    agent: 'FLIGHT' | 'HOTEL' | 'ORCHESTRATOR';
    text: string;
    type: 'info' | 'success' | 'warning';
}

export function SquadTool() {
    const [destination, setDestination] = useState('Tokyo, Japan');
    const [budget, setBudget] = useState(3000);
    const [messages, setMessages] = useState<AgentMessage[]>([
        { id: '1', agent: 'ORCHESTRATOR', text: 'ממתין להזנת פרמטרים למשימה...', type: 'info' }
    ]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<any>(null);

    const runMission = async () => {
        setIsProcessing(true);
        setResults(null);
        setMessages([
            { id: Date.now().toString(), agent: 'ORCHESTRATOR', text: `מפעיל את הנחיל עבור ${destination}...`, type: 'info' }
        ]);

        try {
            // Simulate agent chatter
            setTimeout(() => {
                setMessages(prev => [...prev, { id: '2', agent: 'FLIGHT', text: 'סורק מסלולי טיסה עבור וקטורים חסכוניים...', type: 'info' }]);
            }, 800);
            setTimeout(() => {
                setMessages(prev => [...prev, { id: '3', agent: 'HOTEL', text: 'מנתח נקודות לינה ואירוח מאובטחות...', type: 'info' }]);
            }, 1500);

            const res = await orchestrateSearch(destination, budget);
            setResults(res);

            setMessages(prev => [
                ...prev,
                { id: '4', agent: 'ORCHESTRATOR', text: 'רכישת נתונים הושלמה. ממזג תוצאות.', type: 'success' }
            ]);
        } catch (error) {
            setMessages(prev => [...prev, { id: 'err', agent: 'ORCHESTRATOR', text: 'זוהתה הפרעה במערכת.', type: 'warning' }]);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center justify-end gap-4 text-right">
                        בקרת <span className="text-aurora">נחיל</span> סוכנים
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1 text-right">מנוע תיזמור רב-סוכנים v5.0</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-mono text-aurora uppercase tracking-widest text-right">קישור נוירוני</span>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1 h-3 bg-aurora/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1">
                {/* ── MISSION INPUTS (Left) ── */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="glass-tactical p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-aurora/5 blur-[80px] pointer-events-none" />

                        <div className="space-y-4 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center justify-end gap-2 text-right">
                                אזור יעד <Target className="w-3 h-3 text-aurora" />
                            </label>
                            <input
                                type="text"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-aurora/50 transition-all"
                            />
                        </div>

                        <div className="space-y-4 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center justify-end gap-2 text-right">
                                רזרבת הון ($) <Cpu className="w-3 h-3 text-aurora" />
                            </label>
                            <input
                                type="number"
                                value={budget}
                                onChange={e => setBudget(Number(e.target.value))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-aurora/50 transition-all underline-offset-8"
                            />
                        </div>

                        <button
                            onClick={runMission}
                            disabled={isProcessing}
                            className="w-full bg-aurora hover:bg-aurora/80 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(139,92,246,0.3)] disabled:opacity-50 relative group overflow-hidden"
                        >
                            <div className="absolute inset-x-0 h-full w-20 bg-white/20 -skew-x-12 -translate-x-40 group-hover:translate-x-80 transition-transform duration-1000" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isProcessing ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                {isProcessing ? 'פורס נחיל...' : 'ייזום משימה'}
                            </span>
                        </button>
                    </div>

                    {/* Agent Status Board */}
                    <div className="glass-tactical p-6 rounded-[2rem] border border-white/5 space-y-4">
                        <h4 className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Agent Squad Status</h4>
                        {[
                            { name: 'Architect (ארכיטקט)', status: 'מוכן', icon: Shield, color: 'text-blue-400' },
                            { name: 'Flight Scout (סייר טיסות)', status: isProcessing ? 'פעיל' : 'מוכן', icon: Plane, color: 'text-aurora' },
                            { name: 'Hotel Intel (מודיעין מלונות)', status: isProcessing ? 'פעיל' : 'מוכן', icon: Hotel, color: 'text-emerald-400' },
                        ].map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <agent.icon className={`w-3.5 h-3.5 ${agent.color}`} />
                                    <span className="text-[10px] font-bold text-white/60">{agent.name}</span>
                                </div>
                                <span className={`text-[8px] font-mono ${agent.status === 'ACTIVE' ? 'text-green-400 animate-pulse' : 'text-white/20'}`}>{agent.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── MISSION LOG & RESULTS (Right) ── */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                    {/* Comm Log */}
                    <div className="flex-1 glass-tactical rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col">
                        <div className="bg-white/[0.02] px-8 py-4 border-b border-white/5 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate text-right">יעד: {destination.toUpperCase()}</span>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-aurora/20" />
                                <div className="w-2 h-2 rounded-full bg-aurora/40" />
                                <div className="w-2 h-2 rounded-full bg-aurora animate-pulse" />
                            </div>
                        </div>

                        <div className="flex-1 p-8 space-y-4 overflow-y-auto custom-scrollbar max-h-[300px]">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className={`p-2 rounded-lg shrink-0 ${m.agent === 'ORCHESTRATOR' ? 'bg-white/5 text-white/40' :
                                        m.agent === 'FLIGHT' ? 'bg-aurora/10 text-aurora' : 'bg-emerald-500/10 text-emerald-400'
                                        }`}>
                                        {m.agent === 'ORCHESTRATOR' ? <Activity className="w-3 h-3" /> :
                                            m.agent === 'FLIGHT' ? <Plane className="w-3 h-3" /> : <Hotel className="w-3 h-3" />}
                                    </div>
                                    <div className="flex-1 text-right">
                                        <div className="text-[8px] font-mono text-white/10 uppercase mb-1">מערכת {m.agent}</div>
                                        <p className="text-xs font-medium text-white/70 leading-relaxed font-mono tracking-tight text-right">{m.text}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Result Output */}
                        <AnimatePresence>
                            {results && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="border-t border-aurora/10 bg-aurora/[0.02] p-8 space-y-6"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Flight Data */}
                                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-aurora" />
                                            <div className="flex justify-between items-start mb-4">
                                                <Plane className="w-5 h-5 text-aurora" />
                                                <span className="text-xl font-black text-white">${results.flights.data?.estimatedPrice}</span>
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1 text-right">וקטור נכנס</h5>
                                            <p className="text-sm font-bold text-white uppercase text-right">{results.flights.data?.airline}</p>
                                            <p className="text-[9px] font-mono text-white/40 mt-2 italic text-right">"{results.flights.data?.matchReason}"</p>
                                        </div>

                                        {/* Hotel Data */}
                                        <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                                            <div className="flex justify-between items-start mb-4">
                                                <Hotel className="w-5 h-5 text-emerald-500" />
                                                <span className="text-xl font-black text-white">${results.hotels.data?.totalStayPrice}</span>
                                            </div>
                                            <h5 className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1 text-right">בסיס מבצעי</h5>
                                            <p className="text-sm font-bold text-white uppercase text-right">{results.hotels.data?.name}</p>
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {results.hotels.data?.perks?.slice(0, 3).map((p: string) => (
                                                    <span key={p} className="text-[7px] font-black uppercase px-2 py-0.5 bg-white/5 rounded-full text-white/40">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer HUD */}
                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-4 h-4 text-white/20" />
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest text-right">
                                {isProcessing ? 'Streaming parallel analysis...' : 'Squad ready for deployment.'}
                            </span>
                        </div>
                        <Activity className={`w-3.5 h-3.5 ${isProcessing ? 'text-aurora animate-spin' : 'text-white/10'}`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
