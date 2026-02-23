'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Package, Sparkles } from 'lucide-react';
import { generateItinerary, saveItinerary } from '@/app/actions/ai-features';
import { architectItinerary } from '@/app/actions/itinerary-architect';
import { exportToPdf } from '@/lib/pdf-generator';
import { AIPackingList } from './ai/AIPackingList';
import { FutureMemories } from './ai/FutureMemories';
import { ItineraryHeader } from './itinerary/ItineraryHeader';
import { ActivityCard } from './itinerary/ActivityCard';

type Activity = {
    time: string;
    title: string;
    description: string;
    location: string;
};

type ItineraryDay = {
    day: number;
    theme: string;
    tips: string;
    activities: Activity[];
};

interface ItineraryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    destination: string;
    destinationId: string;
    budget: number;
    startDate: string;
    endDate: string;
    initialPlan?: ItineraryDay[];
}

function calcDays(start: string, end: string): number {
    try {
        const s = new Date(start);
        const e = new Date(end);
        const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(1, Math.min(diff, 10));
    } catch {
        return 3;
    }
}

export const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
    isOpen,
    onClose,
    destination,
    destinationId,
    budget,
    startDate,
    endDate,
    initialPlan,
}) => {
    const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(initialPlan || null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>(initialPlan ? 'done' : 'idle');
    const [activeDay, setActiveDay] = useState(0);
    const [activeTab, setActiveTab] = useState<'ITINERARY' | 'PACKING' | 'MEMORIES'>('ITINERARY');
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isArchitecting, setIsArchitecting] = useState(false);
    const [intelNarrative, setIntelNarrative] = useState<string | null>(null);

    const daysCount = calcDays(startDate, endDate);

    useEffect(() => {
        if (!isOpen) return;
        if (itinerary) return;

        setStatus('loading');
        generateItinerary(destination, daysCount, budget)
            .then((data) => {
                if (data && Array.isArray(data)) {
                    setItinerary(data as ItineraryDay[]);
                    setStatus('done');
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));
    }, [isOpen, destination, daysCount, budget, itinerary]);

    const handleSave = async () => {
        if (!itinerary || isSaving || isSaved) return;
        setIsSaving(true);
        const result = await saveItinerary(destinationId, itinerary);
        if (result.success) setIsSaved(true);
        setIsSaving(false);
    };

    const handleArchitect = async () => {
        if (!itinerary || isArchitecting) return;
        setIsArchitecting(true);
        const result = await architectItinerary(destination, itinerary);
        if (result.success && result.plan) {
            setItinerary(result.plan);
            setIntelNarrative(result.narrative || null);
        }
        setIsArchitecting(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-0 left-0 right-0 z-[301] max-h-[95vh] overflow-hidden rounded-t-[4rem] bg-[#020202] border-t border-white/10 shadow-[0_-30px_100px_rgba(0,0,0,0.9)]"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                    >
                        <div className="flex justify-center pt-6 pb-2">
                            <div className="w-16 h-1.5 rounded-full bg-white/10" />
                        </div>

                        <ItineraryHeader
                            destination={destination}
                            daysCount={daysCount}
                            budget={budget}
                            status={status}
                            isSaving={isSaving}
                            isSaved={isSaved}
                            isArchitecting={isArchitecting}
                            onExport={() => itinerary && exportToPdf(destination, itinerary)}
                            onSave={handleSave}
                            onArchitect={handleArchitect}
                            onClose={onClose}
                        />

                        <div className="overflow-y-auto max-h-[75vh] px-10 py-8 custom-scrollbar">
                            {status === 'loading' && (
                                <div className="flex flex-col items-center justify-center py-40 gap-8">
                                    <div className="relative">
                                        <div className="w-20 h-20 border-4 border-aurora/10 border-t-aurora rounded-full animate-spin" />
                                        <div className="absolute inset-0 blur-3xl bg-aurora/30 rounded-full animate-pulse" />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-white font-black text-lg uppercase tracking-[0.4em] mb-3">Architecting Your Escape</h3>
                                        <p className="text-white/30 text-xs font-medium max-w-sm mx-auto">Our Lumina agent is crunching local data to weave the perfect high-end narrative... </p>
                                    </div>
                                </div>
                            )}

                            {status === 'done' && itinerary && activeTab === 'ITINERARY' && (
                                <div className="space-y-12">
                                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                                        {itinerary.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveDay(idx)}
                                                className={`flex-shrink-0 min-w-[140px] px-8 py-5 rounded-[2rem] transition-all border ${activeDay === idx
                                                    ? 'bg-gold text-black border-gold shadow-[0_15px_40px_rgba(229,195,102,0.4)]'
                                                    : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="text-[10px] font-bold uppercase tracking-widest mb-1">Passage</div>
                                                <div className="text-3xl font-black">{idx + 1}</div>
                                            </button>
                                        ))}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {itinerary[activeDay] && (
                                            <motion.div
                                                key={activeDay}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                className="space-y-10"
                                            >
                                                <div className="flex flex-col gap-6">
                                                    <h3 className="text-5xl font-black text-white uppercase tracking-tighter italic">
                                                        {itinerary[activeDay].theme}
                                                    </h3>

                                                    {intelNarrative && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            className="bg-aurora/10 border border-aurora/30 rounded-2xl p-4 flex items-center gap-3 text-aurora text-[10px] font-black uppercase tracking-widest text-right"
                                                        >
                                                            <div className="w-2 h-2 rounded-full bg-aurora animate-pulse shrink-0" />
                                                            {intelNarrative}
                                                        </motion.div>
                                                    )}

                                                    <div className="flex flex-row-reverse items-center gap-4 bg-white/5 border border-white/10 rounded-[2.5rem] p-6 max-w-3xl glass-lumina">
                                                        <Sparkles className="w-6 h-6 text-aurora flex-shrink-0" />
                                                        <p className="text-white/80 text-sm leading-relaxed text-right">
                                                            <span className="text-aurora font-black uppercase text-[10px] tracking-[0.2em] ml-3">מודיעין עילאי:</span>
                                                            {itinerary[activeDay].tips}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
                                                    {(itinerary[activeDay].activities || []).map((activity, aIdx) => (
                                                        <ActivityCard key={aIdx} activity={activity} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {status === 'done' && itinerary && activeTab === 'PACKING' && (
                                <div className="py-4">
                                    <AIPackingList destination={destination} daysCount={daysCount} />
                                </div>
                            )}

                            {status === 'done' && itinerary && activeTab === 'MEMORIES' && (
                                <div className="py-8">
                                    <FutureMemories destination={destination} theme={itinerary[0]?.theme || 'Amazing Trip'} />
                                </div>
                            )}
                        </div>

                        {status === 'done' && (
                            <div className="bg-[#050505] border-t border-white/5 px-10 py-6 flex justify-center gap-6">
                                <button
                                    onClick={() => setActiveTab('ITINERARY')}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'ITINERARY' ? 'bg-white text-black shadow-[0_10px_30px_rgba(255,255,255,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Calendar className="w-4 h-4" /> Timeline
                                </button>
                                <button
                                    onClick={() => setActiveTab('PACKING')}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'PACKING' ? 'bg-gold text-black shadow-[0_10px_30px_rgba(229,195,102,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Package className="w-4 h-4" /> Prep
                                </button>
                                <button
                                    onClick={() => setActiveTab('MEMORIES')}
                                    className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'MEMORIES' ? 'bg-aurora text-white shadow-[0_10px_30px_rgba(139,92,246,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                                >
                                    <Sparkles className="w-4 h-4" /> Vision
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
