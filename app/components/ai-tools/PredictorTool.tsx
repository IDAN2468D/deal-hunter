'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Zap, Ghost, ShieldAlert, Loader2, Search } from 'lucide-react';
import { predictPriceSignal } from '@/app/actions/price-predictor';

export function PredictorTool() {
    const [dealTitle, setDealTitle] = useState('טיסה לטוקיו עם אמירטס');
    const [price, setPrice] = useState(850);
    const [original, setOriginal] = useState(1200);
    const [isPredicting, setIsPredicting] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handlePredict = async () => {
        setIsPredicting(true);
        setResult(null);
        const res = await predictPriceSignal(dealTitle, price, original);
        if (res.success) {
            setResult(res.prediction);
        }
        setIsPredicting(false);
    };

    const getStatusColor = (rec: string) => {
        switch (rec) {
            case 'BUY_NOW': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'WAIT_48H': return 'text-gold bg-gold/10 border-gold/20';
            case 'HIGH_VOLATILITY': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-white/20 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex justify-between items-start">
                <div className="text-right">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white flex items-center justify-end gap-4">
                        Ghost <span className="text-gradient-lumina">Signal</span> Predictor
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">חיזוי אותות רפאים v2.4</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <Ghost className="w-6 h-6 text-gold" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Inputs */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="glass-tactical p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block text-right">תיאור העסקה</label>
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input
                                    type="text"
                                    value={dealTitle}
                                    onChange={(e) => setDealTitle(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pr-12 pl-6 text-white font-bold outline-none focus:border-gold/50 transition-all text-right"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block text-right">מחיר נוכחי ($)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-gold/50 transition-all text-right"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 block text-right">מחיר מקורי ($)</label>
                                <input
                                    type="number"
                                    value={original}
                                    onChange={(e) => setOriginal(Number(e.target.value))}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-gold/50 transition-all text-right"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handlePredict}
                            disabled={isPredicting}
                            className="w-full bg-gold hover:bg-gold-bright text-black font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(229,195,102,0.3)] disabled:opacity-50"
                        >
                            {isPredicting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    מנתח תנודות שוק...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    ייצר אות חיזוי
                                </span>
                            )}
                        </button>
                    </div>

                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] flex items-center gap-4">
                        <ShieldAlert className="w-5 h-5 text-gold/40" />
                        <p className="text-[9px] text-white/30 uppercase font-bold tracking-widest leading-relaxed text-right">
                            החיזוי מבוסס על אדריכלות AI ואינו מהווה ייעוץ פיננסי. <br /> השוק תנודתי, פעל באחריות.
                        </p>
                    </div>
                </div>

                {/* Results Visualization */}
                <div className="lg:col-span-7">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="h-full glass-tactical rounded-[3rem] border border-white/5 p-10 flex flex-col justify-between overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[100px] -mr-32 -mt-32" />

                                <div className="relative z-10">
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest mb-8 border ${getStatusColor(result.recommendation)}`}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        המלצה: {result.recommendation.replace('_', ' ')}
                                    </div>

                                    <h3 className="text-6xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
                                        {result.confidence}% <span className="text-white/20 text-3xl">Confidence</span>
                                    </h3>

                                    <p className="text-xl font-bold text-white/80 leading-relaxed max-w-lg mb-8 text-right">
                                        {result.explanation}
                                    </p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">Vibe שוק</div>
                                            <div className="text-xl font-black text-gold uppercase italic">{result.marketVibe}</div>
                                        </div>
                                        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                                            <div className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-2">שינוי צפוי</div>
                                            <div className="flex items-center gap-2 text-xl font-black text-white uppercase italic">
                                                {result.predictedPriceChange?.includes('+') ? <TrendingUp className="w-5 h-5 text-red-400" /> : <TrendingDown className="w-5 h-5 text-emerald-400" />}
                                                {result.predictedPriceChange}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative z-10 p-6 bg-gold/10 border border-gold/20 rounded-3xl mt-8">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                                            <span className="text-[10px] font-black text-white/40 uppercase">אות טקטי פעיל</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-gold font-bold">LUMINA_SIGNAL_STABLE</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full glass-tactical rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center p-20 text-center">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                                    <Ghost className="w-10 h-10 text-white/10" />
                                </div>
                                <h4 className="text-xl font-black text-white/20 uppercase tracking-widest mb-4">ממתין לנתוני קלט</h4>
                                <p className="text-white/10 text-xs font-bold uppercase tracking-[0.3em] max-w-xs leading-relaxed">
                                    הכנס את פרטי העסקה כדי שסוכן החיזוי יוכל להתחיל בניתוח תנודות השוק והסתברויות המחיר.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
