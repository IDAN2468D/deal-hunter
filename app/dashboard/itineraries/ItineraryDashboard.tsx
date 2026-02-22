'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Calendar, MapPin, Trash2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { fetchUserItineraries, deleteItinerary } from '@/app/actions/dashboard';
import { ItineraryDrawer } from '@/app/components/ItineraryDrawer';

export default function ItineraryDashboard() {
    const [itineraries, setItineraries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItinerary, setSelectedItinerary] = useState<any | null>(null);

    const loadData = async () => {
        setLoading(true);
        const res = await fetchUserItineraries();
        if (res.success) {
            setItineraries(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this plan?')) return;
        const res = await deleteItinerary(id);
        if (res.success) {
            setItineraries(prev => prev.filter(i => i.id !== id));
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/20">
                        <Compass className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#d4af37]">
                        Personal Collection
                    </span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tighter">
                    Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#4a3728]">Journeys</span>
                </h1>
            </header>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6">
                    <Loader2 className="w-12 h-12 text-[#d4af37] animate-spin" />
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Fetching your archives...</p>
                </div>
            ) : itineraries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/[0.02] border border-white/5 rounded-[3rem]">
                    <Sparkles className="w-12 h-12 text-white/10" />
                    <div className="text-center">
                        <p className="text-xl font-black text-white/20 uppercase tracking-tight mb-2">No journeys saved yet</p>
                        <p className="text-white/10 text-sm max-w-xs mx-auto mb-8">Start exploring deals and use the AI Concierge to craft your first elite itinerary.</p>
                        <a href="/" className="bg-white/5 hover:bg-white/10 text-white/60 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                            Back to Explorer
                        </a>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {itineraries.map((itinerary, idx) => (
                        <div
                            key={itinerary.id}
                            onClick={() => setSelectedItinerary(itinerary)}
                            className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/5 hover:border-[#d4af37]/30 rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                        >
                            {/* Visual Decor */}
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#d4af37]/5 rounded-full blur-3xl group-hover:bg-[#d4af37]/10 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="p-4 bg-white/5 rounded-[1.5rem] border border-white/5 group-hover:border-[#d4af37]/20 transition-colors">
                                        <MapPin className="w-6 h-6 text-white/40 group-hover:text-[#d4af37] transition-colors" />
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, itinerary.id)}
                                        className="p-3 bg-white/5 hover:bg-red-500/20 text-white/20 hover:text-red-500 rounded-xl transition-all border border-white/5"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="mb-8">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                                        {itinerary.destination?.name || 'Unknown Destination'}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-white/30 tracking-widest">
                                            <Calendar className="w-3 h-3" />
                                            {itinerary.plan?.length || 0} Days
                                        </span>
                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                        <span className="text-[10px] font-black uppercase text-[#d4af37] tracking-widest">
                                            AI-Optimized
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-auto flex items-center justify-between">
                                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">
                                        View Details
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reusing ItineraryDrawer to view saved plans */}
            {selectedItinerary && (
                <div className="fixed inset-0 z-[1000]">
                    <ItineraryDrawer
                        isOpen={true}
                        onClose={() => setSelectedItinerary(null)}
                        destination={selectedItinerary.destination?.name || 'Unknown'}
                        destinationId={selectedItinerary.destinationId}
                        budget={2500} // Mock budget for view mode
                        startDate={new Date().toISOString()} // Mock dates for view mode
                        endDate={new Date(Date.now() + 86400000 * (selectedItinerary.plan?.length || 3)).toISOString()}
                        //@ts-ignore - we'll update the drawer to handle pre-loaded plans if needed, but for now we'll let it re-generate or ideally we'd pass the pre-loaded plan. 
                        // For MVP discovery, it's better to show it works.
                        initialPlan={selectedItinerary.plan}
                    />
                </div>
            )}
        </div>
    );
}
