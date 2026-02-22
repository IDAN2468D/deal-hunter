'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, BellRing, BarChart3, ChevronDown, LogIn, Crown } from 'lucide-react';
import { toggleProSubscription } from '@/app/actions/alerts';

export const UserMenu: React.FC = () => {
    const { data: session, status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    if (status === 'loading') {
        return <div className="w-10 h-10 rounded-2xl bg-white/5 animate-pulse" />;
    }

    if (!session) {
        return (
            <div className="flex items-center gap-5">
                <Link
                    href="/login"
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group"
                >
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Connect
                </Link>
                <Link
                    href="/register"
                    className="bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] px-6 py-3 rounded-2xl hover:bg-gold transition-all shadow-3xl active:scale-95"
                >
                    Initialize
                </Link>
            </div>
        );
    }

    const initials = session.user?.name
        ? session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : session.user?.email?.[0]?.toUpperCase() ?? '?';

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setIsOpen(o => !o)}
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 p-2 pr-5 rounded-2xl transition-all glass-lumina active:scale-95"
            >
                <div className="w-9 h-9 rounded-xl bg-gold text-black flex items-center justify-center text-[10px] font-black shadow-3xl">
                    {initials}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black text-white uppercase tracking-tighter max-w-[100px] truncate">
                        {session.user?.name ?? 'Identified'}
                    </span>
                    <span className="text-[7px] font-medium text-white/20 uppercase tracking-widest mt-1">Authorized</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/20 transition-transform duration-500 ${isOpen ? 'rotate-180 text-white' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95, rotate: -1 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-[120%] w-64 glass-lumina border border-white/10 rounded-[2rem] overflow-hidden shadow-3xl z-[200]"
                    >
                        <div className="absolute inset-0 bg-aurora/5 blur-3xl pointer-events-none" />

                        {/* User info */}
                        <div className="p-6 border-b border-white/5 bg-black/40 relative">
                            <p className="text-white font-black text-lg tracking-tighter uppercase truncate">{session.user?.name ?? 'Asset'}</p>
                            <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest truncate mt-1">{session.user?.email}</p>
                        </div>

                        {/* Menu items */}
                        <div className="p-3">
                            {[
                                { href: '/price-watch', icon: BellRing, label: 'Signals' },
                                { href: '/analytics', icon: BarChart3, label: 'Data Hub' },
                                { href: '/profile', icon: User, label: 'Profile' },
                            ].map(({ href, icon: Icon, label }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest group"
                                >
                                    <Icon className="w-4 h-4 text-aurora group-hover:scale-110 transition-transform" />
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* Sign out */}
                        <div className="p-3 bg-black/20">
                            <button
                                onClick={async () => {
                                    await toggleProSubscription();
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-gold bg-gold/5 border border-gold/10 hover:bg-gold/10 transition-all text-[10px] font-black uppercase tracking-[0.2em] mb-3 group"
                            >
                                <div className="flex items-center gap-3">
                                    <Crown className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    Elite Status
                                </div>
                                <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                            </button>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-red-400/40 hover:text-red-400 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4" />
                                Terminate
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
