"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Coffee, Menu, X, Sparkles, Trophy, Compass,
    Search, BarChart3, Bell, Activity, Target
} from 'lucide-react';
import { UserMenu } from '../auth/UserMenu';

export function TacticalNav() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [systemTime, setSystemTime] = useState('');
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const interval = setInterval(() => {
            setSystemTime(new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit', minute: '2-digit'
            }));
        }, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        };
    }, []);

    const navLinks = [
        { name: 'גילוי', href: '/deals', icon: Compass },
        { name: 'מחקר', href: '/search', icon: Search },
        { name: 'ניתוח', href: '/analytics', icon: BarChart3 },
        { name: 'מעבדת ה-AI', href: '/ai-tools', icon: Sparkles, highlight: true },
        { name: 'התראות', href: '/price-watch', icon: Bell },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-1000 ${scrolled ? 'py-4' : 'py-10'}`}>
                <div className="max-w-[1800px] mx-auto px-8 md:px-16 flex justify-between items-center relative">

                    {/* Lumina Nav Background */}
                    <AnimatePresence>
                        {scrolled && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="absolute inset-x-6 md:inset-x-12 h-full bg-[#050505]/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-3xl pointer-events-none -z-10"
                            >
                                <div className="absolute inset-0 bg-aurora/5 blur-3xl rounded-full opacity-50" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Left: Lumina Branding */}
                    <Link href="/" className="relative flex items-center gap-5 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-aurora/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
                            <div className="relative p-3.5 bg-black border border-white/20 rounded-2xl shadow-3xl group-hover:border-aurora/50 transition-colors">
                                <Compass className="w-6 h-6 text-aurora" />
                            </div>
                        </motion.div>
                        <div className="flex flex-col text-right">
                            <span className="font-black text-2xl tracking-tighter text-white uppercase italic leading-none">
                                DEAL<span className="text-gradient-lumina">HUNTER</span>
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20 mt-1">פרדיגמת לומינה</span>
                        </div>
                    </Link>

                    {/* Center: Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-3 p-2 bg-white/5 border border-white/5 rounded-[2rem] glass-lumina">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-3 relative group overflow-hidden ${pathname === link.href ? 'bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <link.icon className={`w-4 h-4 transition-transform duration-500 group-hover:scale-110 ${link.highlight && pathname !== link.href ? 'text-aurora scale-110' : ''}`} />
                                <span className="relative z-10">{link.name}</span>
                                {pathname !== link.href && (
                                    <motion.div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-8">
                        <div className="hidden xl:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-aurora animate-pulse shadow-aurora-glow" />
                            <span className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{systemTime} LMT</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/hunter-portal" className="hidden sm:flex items-center gap-3 glass-lumina border border-white/10 px-6 py-3.5 rounded-2xl text-[10px] font-black text-white/60 hover:bg-gold hover:text-black hover:border-gold transition-all duration-500 uppercase tracking-widest group shadow-2xl">
                                <Trophy className="w-4 h-4 text-gold group-hover:text-black transition-transform" />
                                <span>עלית</span>
                            </Link>
                            <UserMenu />
                            <button
                                onClick={() => setIsOpen(true)}
                                className="lg:hidden p-4 glass-lumina rounded-2xl border border-white/10 text-white hover:border-aurora/50 transition-all duration-500 group shadow-2xl"
                            >
                                <Menu className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Immersive Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        className="fixed inset-0 z-[110] bg-[#020202]/95 backdrop-blur-3xl lg:hidden flex flex-col p-12"
                    >
                        <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-aurora/5 blur-[200px] rounded-full -z-10" />

                        <div className="flex justify-between items-center mb-16">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-aurora mb-2">מערכת ניווט טקטית</span>
                                <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">מטריצת <span className="text-gradient-lumina">פיקוד</span></h2>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-5 glass-lumina rounded-3xl border border-white/10 text-white shadow-3xl"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col gap-5">
                            {navLinks.map((link, idx) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-500 ${pathname === link.href ? 'bg-white border-white text-black shadow-3xl' : 'glass-lumina border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}
                                    >
                                        <div className={`p-4 rounded-2xl ${pathname === link.href ? 'bg-black/10' : 'bg-white/5'}`}>
                                            <link.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-2xl font-black uppercase tracking-tight italic">{link.name}</span>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto grid grid-cols-2 gap-6">
                            <div className="p-8 glass-lumina rounded-[2.5rem] border border-white/5 flex flex-col justify-between aspect-square shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-gold/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Trophy className="w-8 h-8 text-gold relative z-10" />
                                <div className="relative z-10 text-right">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">סטטוס</div>
                                    <div className="text-lg font-black uppercase tracking-tighter text-white">נכס עלית</div>
                                </div>
                            </div>
                            <div className="p-8 glass-lumina rounded-[2.5rem] border border-white/5 flex flex-col justify-between aspect-square shadow-2xl relative group overflow-hidden">
                                <div className="absolute inset-0 bg-aurora/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Activity className="w-8 h-8 text-aurora relative z-10" />
                                <div className="relative z-10 text-right">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">זמן אמת</div>
                                    <div className="text-lg font-mono text-white tracking-widest">{systemTime}</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
