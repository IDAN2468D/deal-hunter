'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DealCard } from './DealCard';
import { fetchFeedDeals } from '@/app/actions/deals';
import { Loader2, Sparkles, SearchX } from 'lucide-react';
import { AgentTask } from '@/types/agents';
import { DynamicGenerativeUI } from './DynamicGenerativeUI';
import { getUserPersonaAction } from '@/app/actions/user';
import { PersonaType } from '@/lib/ai-persona';

/**
 * 🕵️ The Critic: Removed <any> from deal.type.toLowerCase() cast.
 * Using a type-safe helper to map DealType enum to AgentTask type.
 */
type DealFeedType = 'FLIGHT' | 'HOTEL';

function toDealCardType(raw: DealFeedType): AgentTask['type'] {
    if (raw === 'HOTEL') return 'hotel';
    return 'flight';
}

interface FeedDeal {
    id: string;
    type: DealFeedType;
    price: number;
    startDate: Date;
    endDate: Date;
    aiRating: string | null;
    destination: { name: string } | null;
}

interface DealFeedProps {
    // Optional search results from AI — when provided, these are shown instead of DB deals
    searchResults?: AgentTask[];
    // Filter mode from the Bundles/Flights toggle
    filterMode?: 'FLIGHT_ONLY' | 'FLIGHT_HOTEL';
}

export const DealFeed: React.FC<DealFeedProps> = ({ searchResults, filterMode = 'FLIGHT_HOTEL' }) => {
    const [dbDeals, setDbDeals] = useState<FeedDeal[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [persona, setPersona] = useState<PersonaType>('neutral');
    const observerTarget = useRef<HTMLDivElement>(null);

    // Initial persona fetch
    useEffect(() => {
        // Assume default dummy user ID exists since we don't have NextAuth session available here without heavy refactor
        getUserPersonaAction("6995af5576e5d37aa9617051").then(setPersona).catch(() => setPersona('neutral'));
    }, []);

    // If we have search results, show those instead of DB deals
    const rawSearchResults = searchResults && searchResults.length > 0 ? searchResults : null;
    const showSearchResults = rawSearchResults !== null;

    // Apply Bundles/Flights filter
    const filteredSearchResults = rawSearchResults?.filter(task =>
        filterMode === 'FLIGHT_ONLY' ? task.type === 'flight' : true
    );

    const loadDeals = async () => {
        if (loading || !hasMore || showSearchResults) return;
        setLoading(true);
        const result = await fetchFeedDeals(page);

        if (result.success && result.data) {
            if (result.data.length === 0) {
                setHasMore(false);
            } else {
                setDbDeals(prev => [...prev, ...(result.data as FeedDeal[])]);
                setPage(prev => prev + 1);
            }
        }
        setLoading(false);
        setIsFirstLoad(false);
    };

    useEffect(() => {
        if (showSearchResults) return;
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0]?.isIntersecting) {
                    loadDeals();
                }
            },
            { threshold: 0.5 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, loading, hasMore, showSearchResults]);

    // ── SEARCH RESULTS MODE ──
    if (showSearchResults) {
        const visibleResults = filteredSearchResults ?? [];
        return (
            <div className="space-y-12">
                <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                        {visibleResults.length} תוצאות מתאימות AI
                        {filterMode === 'FLIGHT_ONLY' && (
                            <span className="ml-2 text-[#d4af37]">ו טיסות בלבד</span>
                        )}
                    </span>
                </div>
                {visibleResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <p className="text-white/20 text-sm font-black uppercase tracking-widest">
                            לא נמצאו טיסות בתוצאות אלו.
                        </p>
                        <p className="text-white/15 text-xs">עבור לחבילות כדי לראות חבילות מלון.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {visibleResults.map((task, idx) => (
                                <motion.div
                                    key={`${task.destination}-${idx}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (idx % 3) * 0.1 }}
                                >
                                    <DealCard task={task} index={idx} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        );
    }

    // ── DB FEED MODE ──
    return (
        <div className="space-y-12">

            <DynamicGenerativeUI deals={dbDeals} persona={persona} />

            {loading && (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
                </div>
            )}

            <div ref={observerTarget} className="h-4 w-full" />

            {!hasMore && dbDeals.length > 0 && (
                <div className="text-center py-12 text-neutral-500 text-xs font-bold uppercase tracking-[0.3em]">
                    <Sparkles className="w-4 h-4 mx-auto mb-2 opacity-20" />
                    הגעת לסוף הרשימה
                </div>
            )}

            {/* Empty state — no DB deals yet, prompt user to search */}
            {dbDeals.length === 0 && !loading && !isFirstLoad && (
                <div className="flex flex-col items-center justify-center py-24 gap-6">
                    <div className="p-6 bg-white/3 rounded-[2rem] border border-white/5">
                        <SearchX className="w-12 h-12 text-white/20" />
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-black text-white/20 uppercase tracking-tight mb-2">
                            אין עסקאות עדיין
                        </p>
                        <p className="text-white/20 text-sm">
                            השתמש בשורת החיפוש למעלה כדי למצוא עסקאות עם AI.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
