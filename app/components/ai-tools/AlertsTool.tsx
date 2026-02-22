"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, TrendingUp, TrendingDown, AlertCircle, Zap, Activity, Info } from 'lucide-react';
import { predictPriceEvolution } from '@/app/actions/price-alerts';
import { PricePrediction, PredictionPoint } from '@/lib/types';

export function AlertsTool() {
    const [destination, setDestination] = useState('Paris, France');
    const [currentPrice, setCurrentPrice] = useState(850);
    const [prediction, setPrediction] = useState<PricePrediction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runPrediction = async () => {
        setIsLoading(true);
        try {
            const res = await predictPriceEvolution(destination, currentPrice);
            setPrediction(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white">
                        Price <span className="text-violet-500">Alert</span> Intel
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1">Predictive Market Analysis v3.4</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-tactical p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Monitoring Asset</label>
                            <input
                                type="text"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-violet-500/50 transition-all"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Entry Price ($)</label>
                            <input
                                type="number"
                                value={currentPrice}
                                onChange={e => setCurrentPrice(Number(e.target.value))}
                                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-white font-bold outline-none focus:border-violet-500/50 transition-all"
                            />
                        </div>
                        <button
                            onClick={runPrediction}
                            disabled={isLoading}
                            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(139,92,246,0.2)] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <TrendingUp className="w-4 h-4" />
                            {isLoading ? 'Processing Pulse...' : 'Generate Prediction'}
                        </button>
                    </div>

                    <div className="glass-tactical p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
                            <AlertCircle className="w-5 h-5 text-violet-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">Vulnerability Scan</p>
                            <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">Scanning 42 Global Hubs</p>
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="lg:col-span-8 glass-tactical rounded-[3rem] border border-white/5 overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">7-Day Expenditure Projection</span>
                        </div>
                        {prediction && (
                            <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${prediction.risk === 'LOW' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                prediction.risk === 'MEDIUM' ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-red-500/10 border-red-500/20 text-red-500'
                                }`}>
                                RISK_LEVEL: {prediction.risk}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-10 flex flex-col justify-center">
                        {!prediction && !isLoading && (
                            <div className="text-center opacity-10 space-y-4">
                                <Activity className="w-16 h-16 mx-auto" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Waiting for Market Vector</p>
                            </div>
                        )}

                        {isLoading && (
                            <div className="w-full max-w-sm mx-auto space-y-6">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="h-full w-1/2 bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                                    />
                                </div>
                                <p className="text-[8px] font-mono text-center text-violet-500/50 uppercase tracking-[0.4em]">Propagating Tensors...</p>
                            </div>
                        )}

                        {prediction && (
                            <div className="space-y-10">
                                {/* Custom SVG Chart */}
                                <div className="w-full h-48 relative">
                                    <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid Lines */}
                                        {[0, 25, 50, 75, 100].map(p => (
                                            <line key={p} x1="0" y1={p * 2} x2="700" y2={p * 2} stroke="white" strokeOpacity="0.03" strokeWidth="1" />
                                        ))}

                                        {/* Data Path */}
                                        <motion.path
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 1.5 }}
                                            d={`M ${prediction.points.map((p: PredictionPoint, i: number) => {
                                                const x = (i / 6) * 700;
                                                const y = 100 - ((p.price - currentPrice) / currentPrice) * 500;
                                                return `${x},${y}`;
                                            }).join(' L ')}`}
                                            fill="none"
                                            stroke="#8b5cf6"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />

                                        {/* Area Fill */}
                                        <motion.path
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            d={`M 0,200 L ${prediction.points.map((p: PredictionPoint, i: number) => {
                                                const x = (i / 6) * 700;
                                                const y = 100 - ((p.price - currentPrice) / currentPrice) * 500;
                                                return `${x},${y}`;
                                            }).join(' L ')} L 700,200 Z`}
                                            fill="url(#chartGradient)"
                                        />

                                        {/* Points */}
                                        {prediction.points.map((p: PredictionPoint, i: number) => {
                                            const x = (i / 6) * 700;
                                            const y = 100 - ((p.price - currentPrice) / currentPrice) * 500;
                                            return (
                                                <motion.circle
                                                    key={i}
                                                    initial={{ r: 0 }}
                                                    animate={{ r: 4 }}
                                                    transition={{ delay: 1 + (i * 0.1) }}
                                                    cx={x} cy={y} fill="#8b5cf6"
                                                />
                                            );
                                        })}
                                    </svg>

                                    {/* Labels */}
                                    <div className="flex justify-between mt-4">
                                        {prediction.points.map((p: PredictionPoint, i: number) => (
                                            <span key={i} className="text-[8px] font-mono text-white/20 uppercase">{p.day}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex items-start gap-4">
                                    <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Architect Insight</p>
                                        <p className="text-sm font-medium text-white/60 leading-relaxed font-mono">
                                            "{prediction.summary}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
