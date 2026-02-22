'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Link as LinkIcon, Copy, CheckCircle2, Crown, Zap, Gift } from 'lucide-react';

interface SquadMember {
    id: string;
    name: string;
    avatar: string;
    role: 'VIP' | 'Hunter' | 'Scout';
    lastActive: string;
    recentActivity: string;
}

const mockSquad: SquadMember[] = [
    { id: '1', name: 'Alon.K', avatar: 'AK', role: 'VIP', lastActive: 'עכשיו', recentActivity: 'אהב טיסה לפריז ב-$299' },
    { id: '2', name: 'Maya.T', avatar: 'MT', role: 'Hunter', lastActive: 'לפני 5 דק׳', recentActivity: 'הזמינה דיל למלדיביים' },
    { id: '3', name: 'Chen.L', avatar: 'CL', role: 'Scout', lastActive: 'לפני שעה', recentActivity: 'צופה המלצות AI ללונדון' }
];

export const HuntSquad: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const [openActivity, setOpenActivity] = useState<string | null>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText('https://dlhntr.app/squad/join/xh82p9');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-neutral-900 border border-white/10 p-8 rounded-[3rem] relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                            <Users className="w-6 h-6 text-purple-400" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-tighter">צוות הציד <span className="text-white/30 hidden sm:inline">שלך</span></h2>
                    </div>
                    <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mt-1">צודו יחד מולטיפלייר של X1.5 נקודות לכל הזמנה</p>
                </div>

                <div
                    onClick={handleCopy}
                    className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
                >
                    <div className="text-left flex flex-col">
                        <span className="text-[#d4af37] text-[9px] font-black uppercase tracking-widest mb-1">הזמן חברים לצוות</span>
                        <span className="text-white/50 text-xs font-mono tracking-wider group-hover:text-white transition-colors">dlhntr.app/squad...</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/50" />}
                    </div>
                </div>
            </div>

            {/* Squad List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                {mockSquad.map((member, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={member.id}
                        onMouseEnter={() => setOpenActivity(member.id)}
                        onMouseLeave={() => setOpenActivity(null)}
                        className="bg-white/5 border border-white/5 hover:border-[#d4af37]/30 rounded-3xl p-5 hover:bg-white/10 transition-all cursor-pointer relative group"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neutral-800 to-black border border-white/10 flex items-center justify-center font-black text-xl text-white/80 shadow-inner group-hover:border-[#d4af37]/50 transition-colors">
                                {member.avatar}
                            </div>
                            <div>
                                <h4 className="font-black text-base flex items-center gap-2">
                                    {member.name}
                                    {member.role === 'VIP' && <Crown className="w-3.5 h-3.5 text-[#d4af37]" />}
                                </h4>
                                <span className="text-[10px] uppercase font-black tracking-widest text-white/30">{member.lastActive}</span>
                            </div>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <AnimatePresence>
                            {openActivity === member.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-4 mt-2 border-t border-white/5 overflow-hidden"
                                >
                                    <div className="flex items-start gap-2 text-xs">
                                        <Zap className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                                        <p className="text-white/70 font-medium leading-relaxed">{member.recentActivity}</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Gamification Booster */}
            <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-[#d4af37]/10 border border-purple-500/20 p-4 rounded-2xl flex items-center justify-between z-10 relative">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-black/40 rounded-xl border border-white/5 shadow-xl">
                        <Gift className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <h4 className="font-black uppercase tracking-tight text-sm text-purple-100">בונוס צוות פעיל</h4>
                        <p className="text-white/40 text-[10px] font-bold tracking-widest mt-0.5">3 חברי צוות אונליין החודש. עוד 2 להכפלת נקודות!</p>
                    </div>
                </div>
                <div className="w-32 h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 hidden sm:block">
                    <motion.div initial={{ width: 0 }} animate={{ width: '60%' }} className="h-full bg-gradient-to-r from-purple-500 to-[#d4af37]" />
                </div>
            </div>
        </div>
    );
};
