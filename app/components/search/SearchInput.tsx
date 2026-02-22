'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

interface SearchInputProps {
    onSearch: (query: string) => void;
    isLoading: boolean;
}

const TRENDING = ['חורף בסאפו', 'חוף בבאלי', 'לונדון בתקציב', 'טוקיו יוקרתי', 'ניו יורק 5 ימים'];

export const SearchInput: React.FC<SearchInputProps> = ({ onSearch, isLoading }) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() && !isLoading) onSearch(query);
    };

    const handleTrending = (tag: string) => {
        setQuery(tag);
        inputRef.current?.focus();
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="relative group">
                {/* Glow ring when focused or loading */}
                <motion.div
                    animate={{
                        opacity: isFocused || isLoading ? 1 : 0,
                        scale: isFocused || isLoading ? 1 : 0.95,
                    }}
                    className="absolute -inset-[3px] rounded-[1.75rem] bg-gradient-to-r from-gold/60 via-bronze/40 to-gold/60 blur-md pointer-events-none"
                />

                <div className="relative flex items-center rounded-[1.5rem] overflow-hidden border border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl">
                    {/* Search Icon */}
                    <div className="pl-6 pr-3 shrink-0">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div key="loading" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                                    <Loader2 className="w-5 h-5 text-gold animate-spin" />
                                </motion.div>
                            ) : (
                                <motion.div key="search" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0 }}>
                                    <Search className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-gold' : 'text-white/30'}`} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="לאן? (למשל: 'טיול יוקרתי לטוקיו ב-5000$')"
                        disabled={isLoading}
                        dir="rtl"
                        className="flex-1 bg-transparent py-5 px-4 text-white placeholder:text-white/20 outline-none text-sm font-medium disabled:opacity-50"
                    />

                    {/* Submit Button */}
                    <div className="pr-2.5 py-2.5 shrink-0">
                        <AnimatePresence>
                            {query.length > 0 && !isLoading && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8, x: 10 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: 10 }}
                                    type="submit"
                                    className="flex items-center gap-2 bg-gold text-black font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-[1rem] shadow-lg shadow-gold/30 hover:scale-105 active:scale-95 transition-transform"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    חפש
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </form>

            {/* Trending Tags */}
            <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-2"
            >
                <div className="flex items-center gap-1.5 text-white/20">
                    <TrendingUp className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Trending</span>
                </div>
                {TRENDING.map((tag) => (
                    <button
                        key={tag}
                        onClick={() => handleTrending(tag)}
                        className="text-[10px] font-bold text-white/30 hover:text-gold bg-white/[0.03] hover:bg-gold/10 border border-white/8 hover:border-gold/30 px-3 py-1.5 rounded-xl transition-all duration-300"
                    >
                        {tag}
                    </button>
                ))}
            </motion.div>
        </div>
    );
};
