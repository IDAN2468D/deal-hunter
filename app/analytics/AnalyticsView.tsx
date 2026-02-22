"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    BarChart3,
    Globe,
    TrendingDown,
    Zap,
    Star,
    Eye,
    Shield,
    Database,
    ZapOff,
    ArrowUpRight,
    MapPin
} from 'lucide-react';
import { AnalyticsData } from '@/lib/types';
import Link from 'next/link';

export function AnalyticsView({ deals, destinations, searchLogs, priceAlerts, stats }: AnalyticsData) {
    return (
        <main className="min-h-screen bg-[#020202] text-white pb-32 font-sans overflow-x-hidden selection:bg-aurora/30">
            {/* Immersive Background System */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 cyber-grid opacity-10" />
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-aurora/10 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gold/5 blur-[180px] rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020202]/50 to-[#020202]" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 pt-32">
                {/* Tactical Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-aurora/10 border border-aurora/20 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-aurora animate-ping" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-aurora">בינה בזמן אמת</span>
                            </div>
                            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">Node: Analytics_SRV_04</span>
                        </div>
                        <h1 className="text-7xl font-black uppercase tracking-tighter italic leading-none text-right">
                            מודיעין <span className="text-gradient-lumina">מרכזי</span>
                        </h1>
                        <p className="text-white/40 max-w-xl text-sm font-medium leading-relaxed text-right">
                            עיבוד זרם נתונים בזמן אמת ממנועי הזמנות גלובליים ווקטורי חיפוש.
                            ניטור פעיל של תנודות בשוק וזיהוי דילים אלגוריתמי.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] text-right">זמן פעילות מערכת</div>
                        <div className="text-2xl font-mono text-white tracking-widest text-right">99.98<span className="text-aurora">%</span></div>
                    </div>
                </div>

                {/* Primary Data Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
                    {/* Main Stats Panel */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Economic Impact Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="md:col-span-2 glass-lumina rounded-[3rem] p-10 relative overflow-hidden group border border-white/10"
                        >
                            <div className="absolute inset-0 scanline opacity-5" />
                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12">
                                <div className="flex-1 space-y-8">
                                    <div className="flex items-center justify-end gap-4 text-gold">
                                        <h2 className="text-2xl font-black uppercase tracking-tight italic text-right">השפעה כלכלית</h2>
                                        <BarChart3 className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="text-8xl font-black text-white italic tracking-tighter tabular-nums text-right">
                                            ${Math.round(stats.totalSavings).toLocaleString()}
                                        </div>
                                        <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] ml-2 text-right">סה"כ הון שנחסך</div>
                                    </div>
                                </div>
                                <div className="w-full md:w-72 space-y-6 pt-4">
                                    {(['FLIGHT', 'HOTEL'] as const).map(type => {
                                        const typeDeals = deals.filter(d => d.type === type);
                                        const pct = deals.length > 0 ? Math.round((typeDeals.length / deals.length) * 100) : 0;
                                        return (
                                            <div key={type} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{type === 'FLIGHT' ? 'תעופה' : 'לינה'}</span>
                                                    <span className="text-sm font-black text-gold">{pct}%</span>
                                                </div>
                                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${pct}%` }}
                                                        transition={{ duration: 1.5, ease: "circOut" }}
                                                        className={`h-full ${type === 'FLIGHT' ? 'bg-gold' : 'bg-aurora'} shadow-xl`}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* KPI Mini Cards */}
                        {[
                            { icon: Zap, label: 'שיעור הצלחה', value: stats.successRate, suffix: '%', color: 'text-aurora', bg: 'bg-aurora/5' },
                            { icon: TrendingDown, label: 'דילים חמים', value: stats.hotDeals, suffix: '', color: 'text-gold', bg: 'bg-gold/5' },
                        ].map(({ icon: Icon, label, value, suffix, color, bg }, idx) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`glass-lumina rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between group hover:border-white/20 transition-all ${bg}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-4 rounded-2xl bg-black border border-white/5 ${color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <ArrowUpRight className="w-5 h-5 text-white/10 group-hover:text-white/40 transition-colors" />
                                </div>
                                <div>
                                    <div className="text-5xl font-black text-white mb-1 italic">
                                        {value}<span className="text-xl opacity-30 ml-1 font-bold">{suffix}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] text-right">{label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Live Feed Sidebar */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="glass-lumina rounded-[3rem] border border-white/10 p-10 flex flex-col h-full bg-gradient-to-br from-white/5 to-transparent">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center justify-end gap-4">
                                    <h3 className="text-sm font-black uppercase tracking-[0.2em] italic text-right">אותות בזמן אמת</h3>
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                </div>
                                <Activity className="w-4 h-4 text-white/20" />
                            </div>

                            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                                {searchLogs.map((log, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative pl-6 border-l border-white/5 group hover:border-aurora/50 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-[10px] font-black text-white/20 group-hover:text-white transition-colors">{new Date(log.createdAt).toLocaleTimeString()}</span>
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded outline outline-1 outline-offset-2 ${log.status === 'COMPLETED' ? 'outline-green-500/30 text-green-500' : 'outline-orange-500/30 text-orange-500'}`}>
                                                {log.status === 'COMPLETED' ? 'Signal.OK' : 'Signal.LATENCY'}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-bold text-white/60 truncate group-hover:text-white transition-colors">{log.query}</p>
                                    </motion.div>
                                ))}
                            </div>

                            <button className="mt-8 py-4 w-full bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-widest transition-all text-right px-8">
                                הרחב יומן אותות
                            </button>
                        </div>
                    </div>
                </div>

                {/* Popular Destinations - Visual Grid */}
                <div className="mb-20">
                    <div className="flex items-center justify-between mb-12 px-2">
                        <div className="space-y-2">
                            <div className="flex items-center justify-end gap-3 text-white/30 text-right">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em]">התפלגות נכסים</span>
                                <Globe className="w-5 h-5" />
                            </div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter italic text-right">מוקדי עניין <span className="text-gradient-lumina">גלובליים</span></h2>
                        </div>
                        <Link href="/deals" className="hidden md:flex px-8 py-4 glass-lumina border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold hover:text-black transition-all">
                            צפה בכל הנכסים
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stats.destDealCount.map((dest, idx) => (
                            <motion.div
                                key={dest.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group relative aspect-[14/11] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                            >
                                <img src={dest.imageUrl} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                    <div className="space-y-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-3 h-3 text-gold" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{dest.country}</span>
                                        </div>
                                        <h3 className="text-3xl font-black text-white italic tracking-tighter mb-4 leading-none uppercase">{dest.name}</h3>

                                        <div className="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            <div className="px-4 py-2 bg-gold text-black text-[10px] font-black rounded-xl italic">
                                                {dest.avgPrice}$ מחיר ממוצע
                                            </div>
                                            <div className="px-4 py-2 glass-lumina text-white text-[10px] font-black rounded-xl italic border border-white/10">
                                                {dest.dealCount} דילים פעילים
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute top-6 right-6 p-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <ArrowUpRight className="w-5 h-5 text-white" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* System Infrastructure Monitor */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 hover:opacity-100 transition-opacity duration-1000">
                    {[
                        { icon: Database, label: 'שיהוי נתונים', value: '14ms', status: 'אופטימלי' },
                        { icon: Shield, label: 'כספת-אבטחה', value: 'פעיל', status: 'מוצפן' },
                        { icon: ZapOff, label: 'צומת גיבוי', value: 'בהמתנה', status: 'מוכן' }
                    ].map((item, idx) => (
                        <div key={idx} className="p-6 border border-white/5 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <item.icon className="w-5 h-5 text-white/40" />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-xs font-mono text-white italic">{item.value}</span>
                                </div>
                            </div>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20">{item.status}</div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
