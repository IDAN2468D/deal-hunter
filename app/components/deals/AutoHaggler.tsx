'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hagglerAction, HaggledDealPayload } from '@/app/actions/haggler';
import { Timer, Zap, AlertCircle, Plane, Hotel, X, ArrowRight, Sparkles } from 'lucide-react';

export const AutoHaggler = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [isHaggling, setIsHaggling] = useState(false);
    const [haggledDeal, setHaggledDeal] = useState<HaggledDealPayload | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);

    const handleHaggle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) return;
        setIsHaggling(true);
        setHaggledDeal(null);
        const deal = await hagglerAction(prompt);
        if (deal?.success) {
            setHaggledDeal(deal);
            setTimeLeft(deal.expiresInSeconds);
        }
        setIsHaggling(false);
    };

    useEffect(() => {
        if (!haggledDeal || timeLeft <= 0) return;
        const interval = setInterval(() => setTimeLeft((p) => p - 1), 1000);
        return () => clearInterval(interval);
    }, [haggledDeal, timeLeft]);

    const formatTime = (s: number) =>
        `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const discount = haggledDeal
        ? Math.round(((haggledDeal.originalTotal - haggledDeal.haggledTotal) / haggledDeal.originalTotal) * 100)
        : 0;

    return (
        <>
            {/* ── TRIGGER BUTTON ── */}
            <div className="flex justify-center w-full my-8">
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest text-black shadow-[0_0_40px_rgba(212,175,55,0.25)] hover:shadow-[0_0_60px_rgba(212,175,55,0.4)] transition-shadow duration-500"
                    style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #b8962e 100%)' }}
                >
                    {/* Shimmer */}
                    <span className="absolute inset-0 w-1/3 bg-white/40 blur-md -translate-x-full group-hover:translate-x-[400%] transition-transform duration-700" />
                    <Zap className="w-5 h-5 animate-pulse relative z-10" />
                    <span className="relative z-10">הפעל ברוקר דילים אוטומטי</span>
                    <Sparkles className="w-4 h-4 relative z-10 opacity-70" />
                </motion.button>
            </div>

            {/* ── MODAL ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg"
                        dir="rtl"
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.92, y: 40, opacity: 0 }}
                            transition={{ type: 'spring', damping: 22, stiffness: 180 }}
                            className="w-full max-w-2xl relative"
                        >
                            {/* Gold border wrapper */}
                            <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-br from-gold/60 via-bronze/30 to-gold/20 pointer-events-none" />

                            <div className="relative bg-[#080808] rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]">

                                {/* Header */}
                                <div className="relative p-8 pb-0">
                                    {/* Close */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3.5 bg-gradient-to-br from-gold to-bronze rounded-[1.25rem] shadow-xl shadow-gold/30">
                                            <Zap className="w-6 h-6 text-black" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none mb-1">ברוקר אוטומטי</h2>
                                            <p className="text-gold/60 text-[10px] font-mono tracking-[0.2em] uppercase">AI Deal Assembly · Real-time</p>
                                        </div>
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={handleHaggle} className="flex flex-col gap-3">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={prompt}
                                                onChange={(e) => setPrompt(e.target.value)}
                                                placeholder="למשל: תרכיב לי טיסה ומלון במדריד ל-3 לילות ב-400$"
                                                disabled={isHaggling}
                                                className="w-full bg-white/4 border border-white/10 focus:border-gold/50 rounded-[1.25rem] px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all font-medium text-sm"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isHaggling || !prompt}
                                            className="w-full bg-gold hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black uppercase tracking-[0.2em] py-4 rounded-[1.25rem] shadow-lg shadow-gold/20 transition-all flex justify-center items-center gap-3 active:scale-[0.98]"
                                        >
                                            {isHaggling ? (
                                                <>
                                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                                                        <Zap className="w-5 h-5" />
                                                    </motion.div>
                                                    מחפש עסקאות...
                                                </>
                                            ) : (
                                                <>שלח לברוקר <ArrowRight className="w-4 h-4" /></>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                {/* Results */}
                                <AnimatePresence>
                                    {haggledDeal && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-8 pt-6 border-t border-white/8 mt-6">
                                                {/* Timer row */}
                                                <div className="flex items-center justify-between mb-6 p-4 rounded-2xl bg-gold/8 border border-gold/20">
                                                    <div className="flex items-center gap-2.5 text-gold">
                                                        <AlertCircle className="w-4 h-4 animate-pulse" />
                                                        <span className="text-[11px] font-black uppercase tracking-wider">{haggledDeal.scarcityMessage}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 font-mono text-xl font-black text-gold">
                                                        <Timer className="w-4 h-4" />
                                                        {formatTime(timeLeft)}
                                                    </div>
                                                </div>

                                                {/* Breakdown cards */}
                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className="p-5 bg-white/[0.03] rounded-[1.25rem] border border-white/8">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Plane className="w-3.5 h-3.5 text-sky-400" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">מקטע טיסה</span>
                                                        </div>
                                                        <div className="font-black text-white mb-1">{haggledDeal.flightDetails.airline}</div>
                                                        <div className="text-[10px] text-white/30 mb-3">{haggledDeal.destination} · {haggledDeal.flightDetails.duration}</div>
                                                        <div className="text-2xl font-black text-sky-400">${haggledDeal.flightDetails.cost}</div>
                                                    </div>
                                                    <div className="p-5 bg-white/[0.03] rounded-[1.25rem] border border-white/8">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Hotel className="w-3.5 h-3.5 text-gold" />
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">מקום אירוח</span>
                                                        </div>
                                                        <div className="font-black text-white mb-1 truncate">{haggledDeal.hotelDetails.name}</div>
                                                        <div className="text-[10px] text-white/30 mb-3">{'⭐'.repeat(haggledDeal.hotelDetails.rating)} כוכבים</div>
                                                        <div className="text-2xl font-black text-gold">${haggledDeal.hotelDetails.cost}</div>
                                                    </div>
                                                </div>

                                                {/* Summary CTA */}
                                                <div className="flex items-center justify-between p-5 rounded-2xl border border-gold/20 bg-gradient-to-l from-gold/10 to-transparent">
                                                    <div>
                                                        <div className="text-[9px] text-white/30 line-through uppercase tracking-widest">מחיר רגיל: ${haggledDeal.originalTotal}</div>
                                                        <div className="flex items-baseline gap-3 mt-1">
                                                            <span className="text-3xl font-black text-white">${haggledDeal.haggledTotal}</span>
                                                            <span className="text-[10px] font-black text-gold bg-gold/15 border border-gold/30 px-2.5 py-1 rounded-lg">-{discount}%</span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        disabled={timeLeft <= 0}
                                                        className="px-8 py-4 bg-white hover:bg-gold text-black font-black uppercase tracking-widest text-[10px] rounded-[1.25rem] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-xl"
                                                    >
                                                        {timeLeft > 0 ? 'סגור עסקה' : 'פג תוקף'}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
