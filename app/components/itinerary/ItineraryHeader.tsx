'use client';

import React from 'react';
import { Sparkles, Calendar, MapPin, X, FileText, Bookmark, Loader2 } from 'lucide-react';

interface ItineraryHeaderProps {
    destination: string;
    daysCount: number;
    budget: number;
    status: string;
    isSaving: boolean;
    isSaved: boolean;
    isArchitecting: boolean;
    onExport: () => void;
    onSave: () => void;
    onArchitect: () => void;
    onClose: () => void;
}

export const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({
    destination,
    daysCount,
    budget,
    status,
    isSaving,
    isSaved,
    isArchitecting,
    onExport,
    onSave,
    onArchitect,
    onClose,
}) => {
    return (
        <div className="flex items-center justify-between px-10 pt-4 pb-8 border-b border-white/5">
            <div className="flex-1">
                <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="p-2 bg-gold/10 rounded-xl border border-gold/20 shadow-[0_0_15px_rgba(229,195,102,0.1)]">
                        <Sparkles className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/80">
                        תוכנית מודיעין לומינה
                    </span>
                </div>
                <h2 className="text-4xl font-black text-white uppercase tracking-tight leading-none mb-3 text-right">
                    {destination}
                </h2>
                <div className="flex flex-row-reverse items-center gap-5">
                    <span className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {daysCount} ימים
                    </span>
                    <span className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin className="w-3.5 h-3.5" />
                        ${budget.toLocaleString()} בסיס
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onArchitect}
                    disabled={isArchitecting || status !== 'done'}
                    className="group relative px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2.5 bg-aurora/10 text-aurora border border-aurora/20 hover:bg-aurora/20 disabled:opacity-50 overflow-hidden"
                >
                    {isArchitecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
                    )}
                    <span>{isArchitecting ? 'מחשב מסלול...' : 'אדריכלות בזמן אמת'}</span>

                    {/* Scan line effect */}
                    {!isArchitecting && (
                        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-aurora/10 to-transparent skew-x-12 animate-shimmer" />
                    )}
                </button>

                <button
                    onClick={onExport}
                    disabled={status !== 'done'}
                    className="px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2.5 bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 disabled:opacity-50"
                >
                    <FileText className="w-4 h-4" />
                    PDF
                </button>
                <button
                    onClick={onSave}
                    disabled={isSaving || isSaved || status !== 'done'}
                    className={`px-6 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2.5 ${isSaved
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                        }`}
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />}
                    {isSaved ? 'נשמר' : 'שמור'}
                </button>
                <button
                    onClick={onClose}
                    className="p-3.5 rounded-2xl text-white/30 hover:text-white hover:bg-white/5 transition-all bg-white/5 border border-white/5"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};
