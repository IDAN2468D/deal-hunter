"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Star, CreditCard, ArrowRight, Sparkles, CheckCircle2,
    Zap, Target, Activity, LucideIcon, Crown
} from 'lucide-react';

interface HunterStats {
    level: number;
    points: number;
    progress: number;
    pointHistory: { id: string; reason: string; amount: number }[];
}

interface RecommendedDeal {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    destination?: { name: string };
}

interface OrderItem {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: Date | string;
    deal: { title: string };
}

import { getUserHunterStatsAction } from '@/app/actions/gamification';
import { getPersonalizedDealsAction } from '@/app/actions/personalization';
import { getMyOrders, processPaymentAction } from '@/app/actions/checkout';
import { LevelUpCelebration } from '../components/ui/LevelUpCelebration';
import { FogOfWarMap } from '../components/hunter/FogOfWarMap';
import { DealMatchmaker } from '../components/hunter/DealMatchmaker';
import { HuntSquad } from '../components/hunter/HuntSquad';
import Link from 'next/link';

export default function HunterPortalPage() {
    const [stats, setStats] = useState<HunterStats | null>(null);
    const [recommended, setRecommended] = useState<RecommendedDeal[]>([]);
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [prevLevel, setPrevLevel] = useState(1);
    const [showLevelUp, setShowLevelUp] = useState(false);

    useEffect(() => {
        async function load() {
            const [s, r, o] = await Promise.all([
                getUserHunterStatsAction(),
                getPersonalizedDealsAction(),
                getMyOrders()
            ]);
            setStats(s);
            if (s?.level) setPrevLevel(s.level);
            setRecommended(r);
            setOrders(o);
            setIsLoading(false);
        }
        load();
    }, []);

    const handlePay = async (orderId: string) => {
        await processPaymentAction(orderId);
        const [updatedOrders, updatedStats] = await Promise.all([getMyOrders(), getUserHunterStatsAction()]);
        setOrders(updatedOrders);
        setStats(updatedStats);
        if (updatedStats?.level && updatedStats.level > prevLevel) {
            setShowLevelUp(true);
            setPrevLevel(updatedStats.level);
        }
    };

    if (isLoading) return <LoadingScreen />;

    return (
        <main className="min-h-screen text-white font-sans pb-24">
            <LevelUpCelebration
                level={stats?.level ?? 1}
                isVisible={showLevelUp}
                onComplete={() => setShowLevelUp(false)}
            />

            <div className="relative z-10 tactical-container mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── LEFT: PROFILE PANEL ── */}
                <aside className="lg:col-span-4 space-y-6">

                    {/* Profile Card */}
                    <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10">
                        {/* Gold gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-black/80 to-black" />
                        <div className="absolute inset-0 cyber-grid opacity-5" />
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="relative z-10 p-8">
                            {/* Avatar */}
                            <div className="flex items-center gap-5 mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gold/40 blur-xl rounded-full" />
                                    <div className="relative w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-gold/30 to-bronze/20 border-2 border-gold/40 flex items-center justify-center text-4xl shadow-2xl">
                                        🕵️
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black shadow-lg" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight italic">צייד מקצועי</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gold/70">Active · Elite Status</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-8">
                                <StatCard label="נקודות XP" value={stats?.points ?? 0} icon={Zap} color="text-gold" />
                                <StatCard label="רמת צייד" value={stats?.level ?? 1} icon={Crown} color="text-white" />
                            </div>

                            {/* XP Progress Bar */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">Progress to Next Level</span>
                                    <span className="text-[8px] font-mono text-gold/60">{stats?.progress ?? 0}%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stats?.progress ?? 0}%` }}
                                        transition={{ duration: 1.5, ease: 'easeOut' }}
                                        className="h-full rounded-full bg-gradient-to-r from-gold to-bronze"
                                    />
                                </div>
                            </div>

                            {/* Point History */}
                            <div className="space-y-2 border-t border-white/5 pt-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20">Activity Log</span>
                                    <Activity className="w-3 h-3 text-white/20" />
                                </div>
                                {stats?.pointHistory?.slice(0, 5).map((tx) => (
                                    <div key={tx.id} className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-[9px] text-white/40 font-medium">{tx.reason}</span>
                                        <span className="text-[9px] font-black text-gold">+{tx.amount} XP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'לוח מחוונים', href: '/dashboard', icon: Target, color: 'text-gold' },
                            { label: 'מעקב מחירים', href: '/price-watch', icon: Activity, color: 'text-green-400' },
                        ].map(({ label, href, icon: Icon, color }) => (
                            <Link
                                key={href}
                                href={href}
                                className="p-5 glass-tactical rounded-2xl border border-white/8 hover:border-white/15 flex flex-col gap-3 transition-all hover:-translate-y-1 duration-300"
                            >
                                <Icon className={`w-5 h-5 ${color}`} />
                                <span className="text-[9px] font-black uppercase tracking-wider text-white/60">{label}</span>
                            </Link>
                        ))}
                    </div>
                </aside>

                {/* ── RIGHT: CONTENT ── */}
                <div className="lg:col-span-8 space-y-16">

                    {/* Section: AI Matchmaker */}
                    <section>
                        <SectionHeader title="התאמת" highlight="AI אישית" sub="Neural Match Engine v5.0" />
                        <div className="glass-tactical rounded-[2.5rem] p-6 lg:p-10 border border-white/5 relative overflow-hidden mb-12">
                            <div className="absolute top-6 left-10 opacity-5"><Target className="w-24 h-24" /></div>
                            <DealMatchmaker
                                deals={recommended.slice(0, 5).map(r => ({
                                    id: r.id,
                                    title: r.title,
                                    price: r.price,
                                    imageUrl: r.imageUrl,
                                    destinationName: r.destination?.name ?? 'יעד הפתעה'
                                }))}
                                onMatch={async (id) => { console.log('Liked:', id); }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {recommended.map((deal, idx) => (
                                <RecommendedCard key={deal.id} deal={deal} index={idx} />
                            ))}
                        </div>
                    </section>

                    {/* Section: Orders */}
                    <section>
                        <SectionHeader title="מרכז" highlight="רכישות" sub="Transaction Intelligence Log" />
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <OrderRow key={order.id} order={order} onPay={handlePay} />
                            ))}
                            {orders.length === 0 && <EmptyState text="טרם בוצעו רכישות. התחל לחפש!" />}
                        </div>
                    </section>

                    {/* Section: Widgets */}
                    <section>
                        <SectionHeader title="כלים" highlight="מתקדמים" sub="Tactical Augmentation Suite" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-tactical p-7 rounded-[2.5rem] border border-white/5"><HuntSquad /></div>
                            <div className="glass-tactical p-7 rounded-[2.5rem] border border-white/5 overflow-hidden"><FogOfWarMap /></div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

// ─── Sub-components ───

function SectionHeader({ title, highlight, sub }: { title: string; highlight: string; sub: string }) {
    return (
        <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                {title} <span className="text-gold">{highlight}</span>
            </h2>
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 hidden sm:block">{sub}</span>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: LucideIcon; color: string }) {
    return (
        <div className="p-5 bg-white/[0.03] rounded-[1.5rem] border border-white/8 group hover:bg-white/[0.06] transition-all">
            <Icon className={`w-4 h-4 mb-3 ${color} group-hover:scale-110 transition-transform`} />
            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-white/25 mb-1">{label}</div>
            <div className="text-2xl font-black text-white">{value.toLocaleString()}</div>
        </div>
    );
}

function RecommendedCard({ deal, index }: { deal: RecommendedDeal; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="group relative h-72 rounded-[2rem] overflow-hidden border border-white/10 hover:border-gold/30 cursor-pointer transition-all duration-500 hover:-translate-y-2"
        >
            <img src={deal.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 scale-105 group-hover:scale-100 group-hover:saturate-125" alt={deal.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute top-5 right-5">
                <span className="bg-gold text-black text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">AI Match</span>
            </div>

            <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-base font-black uppercase leading-tight mb-3 line-clamp-2">{deal.title}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gold">${deal.price}</span>
                    <Link href={`/deals/${deal.id}`} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl hover:bg-gold hover:text-black transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}

function OrderRow({ order, onPay }: { order: OrderItem; onPay: (id: string) => Promise<void> }) {
    const isPaid = order.status === 'PAID';
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayClick = async () => {
        setIsProcessing(true);
        await onPay(order.id);
        setIsProcessing(false);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-6 glass-tactical rounded-[2rem] border border-white/8 hover:border-white/15 transition-all">
            <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${isPaid ? 'bg-green-500/10 border border-green-500/20' : 'bg-gold/10 border border-gold/20'}`}>
                    <CreditCard className={`w-5 h-5 ${isPaid ? 'text-green-400' : 'text-gold'}`} />
                </div>
                <div>
                    <h4 className="font-black uppercase tracking-tight text-white">{order.deal.title}</h4>
                    <p className="text-[9px] text-white/30 uppercase tracking-widest font-black mt-1">
                        #{order.id.slice(-8)} · {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-right">
                    <div className="text-xl font-black text-white">${order.totalAmount}</div>
                    <div className={`text-[9px] font-black uppercase tracking-widest ${isPaid ? 'text-green-500' : 'text-gold'}`}>
                        {isPaid ? '✓ שולם' : order.status}
                    </div>
                </div>
                {!isPaid ? (
                    <button
                        onClick={handlePayClick}
                        disabled={isProcessing}
                        className="bg-gold hover:brightness-110 text-black px-7 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all shadow-lg shadow-gold/20 disabled:opacity-50 active:scale-95"
                    >
                        {isProcessing ? '...' : 'שלם'}
                    </button>
                ) : (
                    <div className="p-3 bg-green-500/15 rounded-full text-green-500 border border-green-500/20">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingScreen() {
    return (
        <div className="h-screen flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full animate-pulse" />
                <div className="relative w-16 h-16 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gold animate-pulse">מסנכרן פורטל</span>
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="py-16 border border-dashed border-white/8 rounded-[2.5rem] text-center">
            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">{text}</p>
        </div>
    );
}
