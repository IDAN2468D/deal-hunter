'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchMonthDeals } from '@/app/actions/deals';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface FlexCalendarProps {
    initialMonth?: string; // YYYY-MM
}

export const FlexCalendar: React.FC<FlexCalendarProps> = ({ initialMonth = "2026-08" }) => {
    const [month, setMonth] = useState(initialMonth);
    const [heatmap, setHeatmap] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadHeatmap = async () => {
            setLoading(true);
            const result = await fetchMonthDeals(month);
            if (result.success && result.data) {
                setHeatmap(result.data);
            }
            setLoading(false);
        };
        loadHeatmap();
    }, [month]);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const [year, mon] = month.split('-').map(Number);

    const handlePrevMonth = () => {
        const date = new Date(year, mon - 2);
        setMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
    };

    const handleNextMonth = () => {
        const date = new Date(year, mon);
        setMonth(`${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`);
    };

    const days = getDaysInMonth(year, mon - 1);
    const firstDay = new Date(year, mon - 1, 1).getDay();

    const getPriceColor = (price: number) => {
        const prices = Object.values(heatmap);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const range = max - min;

        if (range === 0) return 'bg-green-500/20 text-green-500';

        const percent = (price - min) / range;
        if (percent < 0.3) return 'bg-green-500/20 text-green-500 border-green-500/30';
        if (percent < 0.7) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
        return 'bg-red-500/20 text-red-500 border-red-500/30';
    };

    return (
        <div className="bg-neutral-900/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20">
                        <CalendarIcon className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                            {new Date(year, mon - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">שמירת מחירים פעילה</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-white/40 hover:text-white"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {['אח', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-neutral-600 uppercase tracking-widest py-2">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: days }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${mon.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const price = heatmap[dateStr];

                    return (
                        <motion.div
                            key={day}
                            whileHover={{ scale: 1.05 }}
                            className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all cursor-pointer ${price
                                ? getPriceColor(price)
                                : 'bg-neutral-800/20 border-white/5 text-neutral-600'
                                }`}
                        >
                            <span className="text-xs font-black">{day}</span>
                            {price && (
                                <span className="text-[9px] font-mono mt-1 opacity-80">${price}</span>
                            )}
                            {price === Math.min(...Object.values(heatmap)) && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#d4af37] rounded-full shadow-[0_0_10px_#d4af37]" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded-md" />
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">עסקאה מצויינת</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded-md" />
                        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">מחיר שיא</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors cursor-help">
                    <Info className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">כיצד מחושבים המחירים</span>
                </div>
            </div>
        </div>
    );
};
