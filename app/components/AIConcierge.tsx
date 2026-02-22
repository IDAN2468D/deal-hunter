'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, Sparkles, AlertCircle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { SENTINEL_ERRORS } from '@/lib/validations';
import { AgentResult, SwarmResults } from '@/types';

interface AgentResultProps {
    type: 'flight' | 'hotel';
    result: AgentResult;
}

const ERROR_MESSAGES: Record<string, string> = {
    [SENTINEL_ERRORS.HALLUCINATION]: "נתוני ה-AI היו לא עקביים. מרענן...",
    [SENTINEL_ERRORS.INVALID_RANGE]: "תקציב או תאריכים מחוץ לטווח מותר.",
    [SENTINEL_ERRORS.TIMEOUT]: "שרת AI לוקח זמן רב מדי. מנסה שוב...",
};

function AgentCard({ type, result }: AgentResultProps) {
    if (!result.success) {
        const errorCode = result.error as string;
        const message = ERROR_MESSAGES[errorCode] || "הסוכן כרגע לא זמין";
        const isHallucination = errorCode === SENTINEL_ERRORS.HALLUCINATION;

        return (
            <div className={`p-6 ${isHallucination ? 'bg-amber-50/50 border-amber-100/50' : 'bg-red-50/50 border-red-100/50'} rounded-[2rem] border flex flex-col items-center justify-center text-center`}>
                {isHallucination ? (
                    <RefreshCw className="w-8 h-8 text-amber-400 mb-2 animate-spin-slow" />
                ) : (
                    <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
                )}
                <p className={`text-sm font-bold ${isHallucination ? 'text-amber-600' : 'text-red-600'}`}>
                    {isHallucination ? 'סנכרון לוגיקה...' : 'אבד קשר'}
                </p>
                <p className={`text-xs ${isHallucination ? 'text-amber-400' : 'text-red-400'} mt-1`}>{message}</p>
            </div>
        );
    }

    const flightData = type === 'flight' ? result.data as { airline: string, estimatedPrice: number, matchReason: string } : null;
    const hotelData = type === 'hotel' ? result.data as { name: string, nightlyRate: number, stars: number, perks: string[] } : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/50 shadow-xl"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl ${type === 'flight' ? 'bg-blue-600' : 'bg-indigo-600'} shadow-lg`}>
                    {type === 'flight' ? <Plane className="w-5 h-5 text-white" /> : <Hotel className="w-5 h-5 text-white" />}
                </div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    {type === 'flight' ? 'הצעת טיסה' : 'התאמת מלון'}
                </h3>
            </div>

            {type === 'flight' ? (
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-black text-gray-900">{flightData?.airline}</p>
                        <p className="text-xl font-bold text-blue-600">${flightData?.estimatedPrice}</p>
                    </div>
                    <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/30">
                        <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">נימוק מומחה</p>
                        <p className="text-sm text-gray-600 italic">"{flightData?.matchReason}"</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <p className="text-3xl font-black text-gray-900">{hotelData?.name}</p>
                        <p className="text-xl font-bold text-indigo-600">${hotelData?.nightlyRate}<span className="text-sm text-gray-400">/nt</span></p>
                    </div>
                    <div className="flex gap-1">
                        {[...Array(hotelData?.stars || 0)].map((_, i) => (
                            <Sparkles key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hotelData?.perks?.map((perk: string) => (
                            <span key={perk} className="px-3 py-1 bg-white rounded-full text-[10px] font-bold text-gray-500 border border-gray-100">
                                {perk}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

interface AIConciergeProps {
    results: SwarmResults | null;
    isLoading: boolean;
}

export default function AIConcierge({ results, isLoading }: AIConciergeProps) {
    if (isLoading) {
        return (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 animate-pulse" />
                </div>
                <p className="text-lg font-black text-gray-900 uppercase tracking-widest animate-pulse">
                    מתאמן סוכנים...
                </p>
                <div className="flex gap-2">
                    <span className="text-xs font-bold text-blue-400">סוכן טיסות: חושב...</span>
                    <span className="text-xs font-bold text-indigo-400">סוכן מלון: מחפש...</span>
                </div>
            </div>
        );
    }

    if (!results) return null;

    return (
        <div className="mt-12 space-y-8">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h2 className="text-3xl font-black text-gray-900">תגובת הקונסיירז האישי AI</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AgentCard type="flight" result={results.flights} />
                <AgentCard type="hotel" result={results.hotels} />
            </div>

            <div className="p-6 bg-gradient-to-r from-gray-900 to-blue-900 rounded-[2rem] text-white flex items-center justify-between shadow-2xl overflow-hidden relative">
                <motion.div
                    className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
                <div className="relative z-10">
                    <p className="text-xl font-black italic">"Total combined estimate package for your trip is around ${
                        ((results.flights.data as { estimatedPrice?: number })?.estimatedPrice || 0) + ((results.hotels.data as { totalStayPrice?: number })?.totalStayPrice || 0)
                    }"</p>
                    <p className="text-xs text-white/50 mt-1 uppercase tracking-widest font-bold">נוצר דרך מערכת Gemini 2.5-Flash</p>
                </div>
                <button className="relative z-10 px-8 py-4 bg-white text-gray-900 font-black rounded-2xl hover:bg-blue-50 transition-all active:scale-95 shadow-xl">
                    יצור מסלול
                </button>
            </div>
        </div>
    );
}
