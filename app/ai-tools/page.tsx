"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calculator, Users, Image as ImageIcon, Bell,
    MessageSquare, Sparkles, Activity, ChevronRight, Terminal,
    Cpu, Globe, Shield, Zap
} from 'lucide-react';
import { BudgetTool } from '@/app/components/ai-tools/BudgetTool';
import { SquadTool } from '@/app/components/ai-tools/SquadTool';
import { VisionTool } from '@/app/components/ai-tools/VisionTool';
import { AlertsTool } from '@/app/components/ai-tools/AlertsTool';
import { IntelTool } from '@/app/components/ai-tools/IntelTool';
import { EcoPilotTool } from '@/app/components/ai-tools/EcoPilotTool';
import { Leaf } from 'lucide-react';

type ToolType = 'BUDGET' | 'SQUAD' | 'VISUAL' | 'ALERTS' | 'REVIEWS' | 'ECO';

const tools: { id: ToolType; name: string; nameEn: string; icon: React.ElementType; color: string; gradient: string; status: string; desc: string }[] = [
    { id: 'BUDGET', name: 'תקציב חכם', nameEn: 'Smart Budget', icon: Calculator, color: '#3b82f6', gradient: 'from-blue-500/20 to-blue-500/5', status: 'אופטימיזציה פיננסית', desc: 'הקצאת הון עצבית' },
    { id: 'SQUAD', name: 'נחיל סוכנים', nameEn: 'Agent Swarm', icon: Users, color: '#8b5cf6', gradient: 'from-aurora/20 to-aurora/5', status: 'מערך רב-סוכנים', desc: 'חיפוש משימות מקבילי' },
    { id: 'VISUAL', name: 'סריקה חזותית', nameEn: 'Visual Scan', icon: ImageIcon, color: '#ef4444', gradient: 'from-red-500/20 to-red-500/5', status: 'ראייה ממוחשבת', desc: 'זיהוי יעדים חכם' },
    { id: 'ALERTS', name: 'התראות מחיר', nameEn: 'Price Alerts', icon: Bell, color: '#8b5cf6', gradient: 'from-violet-500/20 to-violet-500/5', status: 'דופק שוק', desc: 'ניטור מחירים חזוי' },
    { id: 'REVIEWS', name: 'ניתוח ביקורות', nameEn: 'Review Intel', icon: MessageSquare, color: '#f59e0b', gradient: 'from-amber-500/20 to-amber-500/5', status: 'ניתוח רגשות NLP', desc: 'תובנות מעומק הביקורות' },
    { id: 'ECO', name: 'מצפן קיימות', nameEn: 'Eco Pilot', icon: Leaf, color: '#10b981', gradient: 'from-emerald-500/20 to-emerald-500/5', status: 'ניטור פחמן', desc: 'תכנון חופשה ירוקה' },
];

export default function AIToolsPage() {
    const [selectedTool, setSelectedTool] = useState<ToolType>('BUDGET');
    const [result, setResult] = useState<unknown>(null);
    const [systemTime, setSystemTime] = useState('');
    const [booting, setBooting] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setBooting(false), 1500);
        const interval = setInterval(() => {
            setSystemTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    const activeTool = tools.find(t => t.id === selectedTool);

    if (booting) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative"
                >
                    <div className="w-32 h-32 border-4 border-gold/10 rounded-full animate-spin border-t-gold shadow-[0_0_50px_rgba(212,175,55,0.2)]" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-gold" />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center space-y-4"
                >
                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase text-right">מפעיל את <span className="text-gradient-lumina">מעבדת Lumina</span></h2>
                    <div className="flex gap-2 justify-center">
                        {[1, 2, 3].map(i => (
                            <motion.div key={i} animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-gold" />
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-neutral-200 font-sans selection:bg-gold selection:text-black overflow-hidden relative">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gold/5 blur-[200px] rounded-full opacity-50" />
                <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-aurora/5 blur-[200px] rounded-full opacity-50" />
                <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
            </div>

            <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] relative z-10 m-6 gap-6">

                {/* ─── COMMAND MATRIX (SIDEBAR) ─── */}
                <aside className="w-full lg:w-96 glass-lumina rounded-[3rem] border border-white/10 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

                    {/* Sidebar Header */}
                    <div className="p-10 pb-8 border-b border-white/5 relative">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-gold/10 border border-gold/20 flex items-center gap-2">
                                <Activity className="w-3 h-3 text-gold animate-pulse" />
                                <span className="text-[9px] font-black text-gold uppercase tracking-[0.2em]">נוירוני פעיל</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{systemTime}</span>
                        </div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none text-right">
                            מעבדת <span className="text-gradient-lumina">Lumina</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-3 italic text-right">חבילת מודיעין אוטונומית v5.0</p>
                    </div>

                    {/* Matrix Navigation */}
                    <nav className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {tools.map((tool, i) => {
                            const isActive = selectedTool === tool.id;
                            return (
                                <motion.button
                                    key={tool.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => { setSelectedTool(tool.id); setResult(null); }}
                                    className={`w-full flex items-center gap-5 p-5 rounded-[2rem] transition-all duration-500 relative overflow-hidden group border ${isActive
                                        ? `bg-white/5 border-white/10 shadow-xl`
                                        : 'border-transparent hover:bg-white/[0.03] hover:border-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="toolIndicator"
                                            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-gold to-transparent rounded-r-full"
                                        />
                                    )}
                                    <div
                                        className="p-4 rounded-2xl transition-all duration-500 shrink-0 relative group-hover:scale-110"
                                        style={{
                                            backgroundColor: isActive ? `${tool.color}15` : 'rgba(255,255,255,0.03)',
                                            border: `1px solid ${isActive ? tool.color + '40' : 'rgba(255,255,255,0.05)'}`,
                                            boxShadow: isActive ? `0 0 20px ${tool.color}20` : 'none'
                                        }}
                                    >
                                        <tool.icon className="w-5 h-5 transition-transform group-hover:rotate-12" style={{ color: isActive ? tool.color : 'rgba(255,255,255,0.3)' }} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className={`font-black text-xs uppercase tracking-[0.1em] leading-none mb-1.5 transition-colors text-right ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`}>
                                            {tool.name}
                                        </div>
                                        <div className="text-[8px] font-black text-white/10 uppercase tracking-widest leading-none truncate mb-1">
                                            {tool.desc}
                                        </div>
                                        <div className="text-[7px] font-mono mt-1 opacity-60 uppercase tracking-wider" style={{ color: tool.color }}>
                                            {tool.status}
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-500 ${isActive ? 'text-white/40' : 'text-white/5 group-hover:text-white/20'}`} />
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* Infrastructure Status */}
                    <div className="p-8 border-t border-white/5 bg-white/[0.02]">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <Cpu className="w-3.5 h-3.5 text-white/20" />
                                <div className="text-[7px] font-black text-white/20 uppercase tracking-widest text-right">עיבוד</div>
                                <div className="text-[10px] font-mono text-white/60 text-right">94.2% עומס</div>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                                <Globe className="w-3.5 h-3.5 text-white/20" />
                                <div className="text-[7px] font-black text-white/20 uppercase tracking-widest text-right">שיהוי</div>
                                <div className="text-[10px] font-mono text-white/60 text-right">12MS_משוער</div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ─── MAIN HUB (DISPLAY AREA) ─── */}
                <main className="flex-1 glass-lumina rounded-[3rem] border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
                    <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

                    {/* Header HUD */}
                    <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-black/20 backdrop-blur-md">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl" style={{ backgroundColor: `${activeTool?.color || '#ffd700'}15`, border: `1px solid ${activeTool?.color || '#ffd700'}30` }}>
                                    {activeTool ? (
                                        <activeTool.icon className="w-5 h-5" style={{ color: activeTool.color }} />
                                    ) : (
                                        <Sparkles className="w-5 h-5 text-gold" />
                                    )}
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">{activeTool?.name || 'מעבדת Lumina'}</h2>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeTool?.color || '#ffd700', boxShadow: `0 0 10px ${activeTool?.color || '#ffd700'}` }} />
                                            <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">{activeTool?.status || 'SYSTEM_OFFLINE'}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-white/10 uppercase tracking-widest">ID: {selectedTool}_OP_05</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="hidden xl:flex flex-col items-end">
                                <div className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1 text-right">סמכות אותות</div>
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-gold/40' : 'bg-white/5'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-mono text-gold font-bold">GEMINI_1.5_PRO</span>
                                </div>
                            </div>
                            <div className="h-10 w-[1px] bg-white/10 mx-2" />
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-crosshair">
                                <Terminal className="w-5 h-5 text-white/40" />
                            </div>
                        </div>
                    </div>

                    {/* Viewport Area */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-10 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedTool}
                                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full"
                            >
                                {selectedTool === 'BUDGET' && <BudgetTool result={result} setResult={setResult} />}
                                {selectedTool === 'SQUAD' && <SquadTool />}
                                {selectedTool === 'VISUAL' && <VisionTool />}
                                {selectedTool === 'ALERTS' && <AlertsTool />}
                                {selectedTool === 'REVIEWS' && <IntelTool />}
                                {selectedTool === 'ECO' && <EcoPilotTool />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Tactical Overlay (Minimal footer inside main area) */}
                    <div className="px-10 py-5 border-t border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between text-[8px] font-mono text-white/10 uppercase tracking-[0.5em] relative z-10">
                        <span>פרוטוקול.בינה.LUMINA.פעיל</span>
                        <div className="flex gap-10">
                            <span>חיישנים: תקין</span>
                            <span>הצפנה: AES-256</span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Global HUD Compass Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-12 right-12 w-16 h-16 glass-lumina border border-gold/20 rounded-full flex items-center justify-center text-gold shadow-3xl z-[200] group"
            >
                <div className="absolute inset-0 bg-gold/10 rounded-full blur-xl group-hover:bg-gold/20 transition-all" />
                <Zap className="w-6 h-6 relative z-10" />
            </motion.button>
        </div>
    );
}


