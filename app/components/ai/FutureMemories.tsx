'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Image as ImageIcon, Loader2, Heart, Download } from 'lucide-react';
import { generateFutureMemory } from '@/app/actions/memories'; // We will create this

interface FutureMemoriesProps {
    destination: string;
    theme: string;
}

export const FutureMemories: React.FC<FutureMemoriesProps> = ({ destination, theme }) => {
    const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'DONE' | 'ERROR'>('IDLE');
    const [memoryData, setMemoryData] = useState<{ imageUrl: string; caption: string } | null>(null);
    const [isLiked, setIsLiked] = useState(false);

    const handleGenerate = async () => {
        setStatus('LOADING');
        try {
            const result = await generateFutureMemory(destination, theme);
            if (result.success && result.data) {
                setMemoryData(result.data);
                setStatus('DONE');
            } else {
                setStatus('ERROR');
            }
        } catch (e) {
            setStatus('ERROR');
        }
    };

    if (status === 'IDLE') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border border-white/5 bg-white/[0.02] rounded-[2rem]">
                <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-6">
                    <Camera className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">תמונת זיכרון עתידית</h3>
                <p className="text-white/40 text-sm mb-8 max-w-sm">
                    סוכן ה-AI ידמיין רגע קסום מהחופשה שלך ב{destination} וישלח לך "גלויה מהעתיד".
                </p>
                <button
                    onClick={handleGenerate}
                    className="bg-purple-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-purple-600 shadow-lg shadow-purple-500/20"
                >
                    צלם את העתיד עכשיו
                </button>
            </div>
        );
    }

    if (status === 'LOADING') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <Loader2 className="w-8 h-8 text-purple-400 mb-4 animate-spin" />
                <p className="text-white/40 text-sm">ה-AI מצייר את הרגע המושלם שלך...</p>
            </div>
        );
    }

    if (status === 'ERROR') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-red-400">
                <p>העדשה הייתה מטושטשת. נסה לצלם שוב.</p>
                <button onClick={handleGenerate} className="mt-4 text-purple-400 underline text-sm">נסה שוב</button>
            </div>
        );
    }

    if (status === 'DONE' && memoryData) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white p-3 pb-8 rounded-md shadow-2xl rotate-2 max-w-sm mx-auto group"
            >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={memoryData.imageUrl}
                        alt="Future Memory"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors"
                            >
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                            </button>
                            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-colors">
                                <Download className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-center font-serif text-black/80 text-sm italic px-4 leading-relaxed line-clamp-3">
                    {memoryData.caption}
                </p>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#d4af37]/80 rounded-full shadow-md z-10 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                </div>
            </motion.div>
        );
    }

    return null;
};
