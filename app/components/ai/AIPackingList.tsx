'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Circle, Loader2, Info } from 'lucide-react';
import { generatePackingList } from '@/app/actions/packing'; // We will create this

interface PackingItem {
    id: string;
    item: string;
    category: string;
    reason: string;
}

interface AIPackingListProps {
    destination: string;
    daysCount: number;
}

export const AIPackingList: React.FC<AIPackingListProps> = ({ destination, daysCount }) => {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'DONE' | 'ERROR'>('IDLE');
    const [items, setItems] = useState<PackingItem[]>([]);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const handleGenerate = async () => {
        setStatus('LOADING');
        try {
            const result = await generatePackingList(destination, daysCount);
            if (result.success && result.items) {
                setItems(result.items);
                setStatus('DONE');
            } else {
                setStatus('ERROR');
            }
        } catch (e) {
            setStatus('ERROR');
        }
    };

    const toggleItem = (id: string) => {
        const newChecked = new Set(checkedItems);
        if (newChecked.has(id)) {
            newChecked.delete(id);
        } else {
            newChecked.add(id);
        }
        setCheckedItems(newChecked);
    };

    if (status === 'IDLE') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 bg-white/[0.02] rounded-[2rem]">
                <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-8 h-8 text-[#d4af37]" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">אמן האריזה AI</h3>
                <p className="text-white/40 text-sm mb-8 max-w-sm">
                    סוכן ה-AI מנתח את מזג האוויר ב{destination} ואת משך החופשה שלך ({(daysCount)} ימים) כדי ליצור רשימת אריזה חכמה ומדויקת.
                </p>
                <button
                    onClick={handleGenerate}
                    className="bg-[#d4af37] text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-[#f3e5ab] shadow-lg shadow-[#d4af37]/20"
                >
                    צור רשימת אריזה אוטומטית
                </button>
            </div>
        );
    }

    if (status === 'LOADING') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="w-8 h-8 text-[#d4af37] mb-4 animate-spin" />
                <p className="text-white/40 text-sm">המערכת מחשבת תחזיות ומתאימה ציוד...</p>
            </div>
        );
    }

    if (status === 'ERROR') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                <p>שגיאה ביצירת הרשימה. נסה שוב מאוחר יותר.</p>
                <button onClick={handleGenerate} className="mt-4 text-[#d4af37] underline text-sm">נסה שוב</button>
            </div>
        );
    }

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, PackingItem[]>);

    const progress = Math.round((checkedItems.size / items.length) * 100) || 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mix-blend-difference">רשימת אריזה AI ל{destination}</h3>
                    <p className="text-white/40 text-xs">הותאם במיוחד למסע של {daysCount} ימים</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-[#d4af37]">{progress}%</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">מוכן ליציאה</div>
                </div>
            </div>

            <div className="w-full bg-white/5 rounded-full h-1.5 mb-8 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="bg-[#d4af37] h-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(groupedItems).map(([category, catItems]) => (
                    <div key={category} className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-4 bg-black/40 inline-block px-3 py-1 rounded-lg">
                            {category}
                        </h4>
                        <div className="space-y-3">
                            {catItems.map(item => {
                                const isChecked = checkedItems.has(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItem(item.id)}
                                        className={`group cursor-pointer flex items-start gap-3 p-2 -mx-2 rounded-xl transition-all ${isChecked ? 'opacity-50' : 'hover:bg-white/5'}`}
                                    >
                                        <div className="mt-0.5 flex-shrink-0">
                                            {isChecked ?
                                                <CheckCircle2 className="w-5 h-5 text-[#d4af37]" /> :
                                                <Circle className="w-5 h-5 text-white/20 group-hover:text-[#d4af37]/50" />
                                            }
                                        </div>
                                        <div>
                                            <div className={`text-sm font-black transition-all ${isChecked ? 'text-white/50 line-through' : 'text-white'}`}>
                                                {item.item}
                                            </div>
                                            <div className="text-[10px] text-white/40 mt-1 flex items-start gap-1">
                                                <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                                <span>{item.reason}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
