'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, ShieldCheck } from 'lucide-react';

interface SniperToggleProps {
    dealId: string;
    currentPrice: number;
    targetPrice: number;
}

export const SniperToggle: React.FC<SniperToggleProps> = ({ dealId, currentPrice, targetPrice }) => {
    const [isArmed, setIsArmed] = useState(false);
    const [isSniping, setIsSniping] = useState(false);
    const [sniped, setSniped] = useState(false);

    useEffect(() => {
        if (!isArmed || sniped) return;

        // Simulate Price Drop logic (In production, this is WebSockets or Polling)
        const checkPriceDrop = setInterval(() => {
            // Fake 30% chance that price drops randomly after armed
            if (Math.random() > 0.7) {
                clearInterval(checkPriceDrop);
                executeSnipe();
            }
        }, 3000);

        return () => clearInterval(checkPriceDrop);
    }, [isArmed, sniped]);

    const executeSnipe = () => {
        setIsSniping(true);
        setTimeout(() => {
            setIsSniping(false);
            setSniped(true);
            setIsArmed(false);
        }, 2000); // 2 second intense animation
    };

    if (sniped) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-2xl flex items-center justify-between text-green-500">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest text-[10px]">המטרה הושגה: מחיר ננעל בהצלחה!</span>
                </div>
                <span className="font-black text-xl">${targetPrice}</span>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* The main control */}
            <div
                className={`p-6 border rounded-3xl transition-all duration-500 ${isArmed
                        ? 'bg-red-950/30 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
            >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Target className={`w-6 h-6 ${isArmed ? 'text-red-500 animate-pulse' : 'text-white/40'}`} />
                            <h3 className="text-xl font-black uppercase tracking-tighter">Auto-Booking Sniper</h3>
                        </div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                            {isArmed ? 'מחפש צניחת מחיר מתחת למטרה...' : 'קבע יעד והמערכת תתפוס רגעית שגיאת מחיר'}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="flex flex-col items-end">
                            <span className="text-white/30 text-[9px] uppercase font-black tracking-widest">מחיר יעד</span>
                            <span className={`text-2xl font-black ${isArmed ? 'text-red-500' : 'text-white'}`}>
                                ${targetPrice}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsArmed(!isArmed)}
                            className={`relative overflow-hidden px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all w-full md:w-auto ${isArmed
                                    ? 'bg-red-500 text-black hover:bg-red-600'
                                    : 'bg-[#d4af37] text-black hover:bg-[#f3e5ab]'
                                }`}
                        >
                            {/* Scanner line inside button when armed */}
                            {isArmed && (
                                <motion.div
                                    className="absolute inset-0 w-1/4 bg-white/30 skew-x-12"
                                    animate={{ left: ['-50%', '150%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            )}
                            <span className="relative z-10">{isArmed ? 'נטרל צלף' : 'חמוש עכשיו'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Intense Sniping Animation Overlay */}
            <AnimatePresence>
                {isSniping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-3xl bg-red-500 z-50 flex items-center justify-center overflow-hidden"
                    >
                        {/* Radar circles */}
                        <motion.div
                            animate={{ scale: [1, 5], opacity: [1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute w-20 h-20 border-4 border-black/30 rounded-full"
                        />
                        <motion.div
                            animate={{ scale: [1, 5], opacity: [1, 0] }}
                            transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
                            className="absolute w-20 h-20 border-4 border-black/30 rounded-full"
                        />

                        <div className="relative z-10 flex items-center gap-3 text-black">
                            <Zap className="w-8 h-8 animate-pulse" />
                            <span className="font-black text-2xl uppercase tracking-[0.3em]">מבצע הזמנה!</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
