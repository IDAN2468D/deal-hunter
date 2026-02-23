"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Activity, Globe, Zap, Compass, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const footerLinks = [
    { label: 'קישורי מערכת', items: ['מסמכי תפעול', 'סטטוס API', 'מדיניות סייבר', 'פרוטוקול פרטיות'] },
    { label: 'פעילות שטח', items: ['פורטל הציידים', 'מודיעין גלובלי', 'קישור ישיר', 'מעבדת AI'] },
];

export function TacticalFooter() {
    const [uptime, setUptime] = useState(0);
    const [time, setTime] = useState('');

    useEffect(() => {
        const start = Date.now();
        const interval = setInterval(() => {
            setUptime(Math.floor((Date.now() - start) / 1000));
            setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="relative z-10 mt-40 pb-20 px-8 md:px-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 py-20 relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-aurora/5 blur-[120px] rounded-full -z-10 animate-pulse" />

                    {/* Brand Meta */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-5">
                                <div className="p-3.5 glass-lumina border border-white/20 rounded-2xl shadow-3xl">
                                    <Compass className="w-5 h-5 text-aurora" />
                                </div>
                                <span className="font-black text-2xl tracking-tighter text-white uppercase italic leading-none">
                                    DEAL<span className="text-gradient-lumina">HUNTER</span>
                                </span>
                            </div>
                            <p className="text-[10px] text-white/30 leading-relaxed font-bold uppercase tracking-[0.4em] max-w-sm text-right">
                                מודיעין נסיעות בביצועים גבוהים. <br />
                                מגדירים מחדש את החופשה היוקרתית.
                            </p>
                        </div>

                        <div className="p-8 glass-lumina border border-white/10 rounded-[2.5rem] bg-black/40 space-y-6 shadow-3xl">
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black uppercase text-white/20 tracking-[0.5em]">רשת גלובלית</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-aurora animate-pulse shadow-aurora-glow" />
                                    <span className="text-[9px] font-black text-aurora uppercase tracking-tighter">פעיל</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { icon: Shield, label: 'Secure Instance', state: 'Verified' },
                                    { icon: Zap, label: 'Lumina Engine', state: 'Active' },
                                    { icon: Globe, label: 'Asset Node', state: 'Synced' },
                                ].map(({ icon: Icon, label, state }) => (
                                    <div key={label} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-gold transition-colors" />
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{label}</span>
                                        </div>
                                        <span className="text-[9px] font-mono text-white/60 tracking-tighter group-hover:text-white">{state}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-white/5 flex justify-between text-[9px] font-mono text-white/15 uppercase tracking-widest">
                                <span>זמן פעילות: {uptime}ש'</span>
                                <span className="text-gold/40">{time} LMT</span>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-10">
                        {footerLinks.map((col) => (
                            <div key={col.label} className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em]">{col.label}</h4>
                                <ul className="space-y-5">
                                    {col.items.map((item) => (
                                        <li key={item}>
                                            <a href="#" className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/30 hover:text-white transition-all duration-500">
                                                <span>{item}</span>
                                                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-aurora" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Data Visualization */}
                    <div className="lg:col-span-4 space-y-8">
                        <h4 className="text-[10px] font-black uppercase text-white/20 tracking-[0.5em] text-right">מטא-דאטה בזמן אמת</h4>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { value: '18.4K', label: 'צמתים', accent: 'text-aurora' },
                                { value: '99.9%', label: 'יציבות', accent: 'text-green-500' },
                                { value: '$2.4M', label: 'תשואה', accent: 'text-gold' },
                                { value: '0.4ms', label: 'זמן תגובה', accent: 'text-white' },
                            ].map(({ value, label, accent }) => (
                                <motion.div
                                    key={label}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="p-8 glass-lumina border border-white/5 rounded-[2rem] text-center shadow-3xl group"
                                >
                                    <div className={`text-2xl font-black ${accent} tracking-tighter italic mb-1 group-hover:scale-110 transition-transform`}>{value}</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">{label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Vector */}
                <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative">
                    <div className="absolute top-0 left-0 w-32 h-[1px] bg-aurora opacity-30" />
                    <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.4em] italic font-black">
                        © 2026 DealHunter // פרוטוקול לומינה v7.2-סופי · גישה מורשית בלבד
                    </p>
                    <div className="flex gap-10">
                        <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500/40" />
                            לחיצת_יד_מאובטחת_הושלמה
                        </span>
                        <div className="text-[9px] font-mono text-aurora/30 uppercase tracking-[0.3em] font-black">
                            // נרטיב_יוקרה_פעיל
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
