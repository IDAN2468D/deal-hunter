'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { DealCard } from './DealCard';
import { AgentTask } from '@/types/agents';
import { PersonaType } from '@/lib/ai-persona';

type DealFeedType = 'FLIGHT' | 'HOTEL';

interface FeedDeal {
    id: string;
    type: DealFeedType;
    price: number;
    originalPrice?: number;
    title?: string;
    imageUrl?: string;
    startDate: Date;
    endDate: Date;
    aiRating: string | null;
    destination: { name: string } | null;
}

function toDealCardType(raw: DealFeedType): AgentTask['type'] {
    if (raw === 'HOTEL') return 'hotel';
    return 'flight';
}

function FeedDealToTask(deal: FeedDeal): AgentTask {
    return {
        type: toDealCardType(deal.type),
        destination: deal.destination?.name ?? 'Unknown',
        budget: deal.price,
        startDate: typeof deal.startDate === 'string' ? deal.startDate : deal.startDate.toISOString(),
        endDate: typeof deal.endDate === 'string' ? deal.endDate : deal.endDate.toISOString(),
        requirements: deal.aiRating ? [`Rating: ${deal.aiRating}`] : [],
    };
}

// Generic UI (Neutral)
function NeutralGrid({ deals }: { deals: FeedDeal[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal, idx) => (
                <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.1, ease: 'easeOut' }}
                >
                    <DealCard task={FeedDealToTask(deal)} index={idx} />
                </motion.div>
            ))}
        </div>
    );
}

// Luxury UI (Premium feel, large images, elegant font)
function LuxuryGrid({ deals }: { deals: FeedDeal[] }) {
    return (
        <div className="flex flex-col gap-16 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                className="text-center space-y-3 mb-8"
            >
                <h2 className="text-4xl font-serif text-[#d4af37] tracking-wide uppercase">Curated Premium Experiences</h2>
                <p className="text-white/50 font-light tracking-widest text-sm uppercase">Handpicked for your exquisite taste.</p>
            </motion.div>
            {deals.map((deal, idx) => {
                const task = FeedDealToTask(deal);
                // Luxury layout uses Framer motion for parallax-like entry
                return (
                    <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative group overflow-hidden rounded-[2rem] shadow-2xl bg-neutral-900 border border-white/10"
                    >
                        {/* Fallback pattern if imageUrl wasn't fetched on FeedDeal */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black via-neutral-900 to-[#4a3728] opacity-50 z-0"></div>

                        <div className="relative z-10 p-12 text-white flex flex-col md:flex-row justify-between items-center gap-12">
                            <div className="flex-1">
                                <div className="uppercase tracking-[0.3em] font-black text-xs text-[#d4af37] mb-4">First Class Selection</div>
                                <h3 className="text-5xl font-serif mb-6">{task.destination}</h3>
                                <div className="flex gap-6 text-sm font-sans tracking-widest text-white/60 uppercase">
                                    <span>{new Date(task.startDate).toLocaleDateString()}</span>
                                    <span>—</span>
                                    <span>{new Date(task.endDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="text-right border-l border-white/10 pl-12">
                                <div className="text-sm font-black text-white/40 uppercase tracking-widest mb-2">Exquisite Price</div>
                                <div className="text-6xl font-serif text-[#d4af37]">${task.budget}</div>
                                <button className="mt-8 px-8 py-3 bg-[#d4af37] text-black font-black uppercase tracking-[0.2em] rounded-full hover:bg-white transition-colors">
                                    Secure Booking
                                </button>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

// Backpacker UI (Densified, list-heavy, focus on savings)
function BackpackerList({ deals }: { deals: FeedDeal[] }) {
    return (
        <div className="space-y-4 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-500/10 text-orange-400 p-4 rounded-xl font-mono text-sm uppercase tracking-wider mb-8 border border-orange-500/20 shadow-sm flex items-center justify-between"
            >
                <span className="flex items-center gap-2">⚡ Ultra-Budget Hacks Active</span>
                <span className="bg-orange-500 text-black px-2 py-1 rounded">Sort: Max Savings</span>
            </motion.div>
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left font-mono text-xs md:text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-white/40 uppercase tracking-widest">
                            <th className="p-4 md:p-6">Dest</th>
                            <th className="p-4 md:p-6 hidden sm:table-cell">Dates</th>
                            <th className="p-4 md:p-6 text-right">MSRP</th>
                            <th className="p-4 md:p-6 text-right text-orange-400">Hack Price</th>
                            <th className="p-4 md:p-6"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {deals.map((deal, idx) => {
                            const task = FeedDealToTask(deal);
                            const originalPrice = deal.originalPrice || deal.price * 1.4; // Fallback mock savings
                            const savings = Math.round(((originalPrice - deal.price) / originalPrice) * 100);
                            return (
                                <motion.tr
                                    key={deal.id}
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4 md:p-6 font-black text-white truncate max-w-[150px] uppercase">{task.destination}</td>
                                    <td className="p-4 md:p-6 text-white/50 hidden sm:table-cell">
                                        {new Date(task.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </td>
                                    <td className="p-4 md:p-6 text-right text-white/30 line-through">${originalPrice.toFixed(0)}</td>
                                    <td className="p-4 md:p-6 text-right font-black text-green-400 flex items-center justify-end gap-2">
                                        ${deal.price} <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">-{savings}%</span>
                                    </td>
                                    <td className="p-4 md:p-6 text-right">
                                        <button className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition-colors text-xs font-black uppercase tracking-wider">
                                            Snag
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Generative RSC Wrapper
export function DynamicGenerativeUI({ deals, persona }: { deals: FeedDeal[], persona: PersonaType }) {
    // Act as a Factory based on AI Persona
    switch (persona) {
        case "luxury":
            return <LuxuryGrid deals={deals} />;
        case "backpacker":
            return <BackpackerList deals={deals} />;
        case "neutral":
        case "family":
        default:
            return <NeutralGrid deals={deals} />;
    }
}
