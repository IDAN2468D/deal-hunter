'use client';

import { motion } from 'framer-motion';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function CommandCenter() {
    const [query, setQuery] = useState('');

    return (
        <div className="flex-1 p-12 flex flex-col items-center justify-center max-w-5xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-12"
            >
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest"
                    >
                        <Sparkles className="w-3 h-3" />
                        Next-Gen Discovery
                    </motion.div>
                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-none">
                        What's your next <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Adventure?</span>
                    </h1>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[3rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                    <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-4 flex items-center shadow-2xl">
                        <div className="pl-6 text-white/40">
                            <Command className="w-6 h-6" />
                        </div>

                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g., 'A luxury escape to Bali under $3000'..."
                            className="flex-1 bg-transparent border-none text-2xl text-white placeholder-white/20 focus:ring-0 px-6 py-6 font-medium"
                        />

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white text-black px-10 py-6 rounded-[2rem] font-black text-lg flex items-center gap-3 hover:bg-blue-50 transition-colors shadow-xl"
                        >
                            RUN AGENTS
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>

                    <div className="absolute -bottom-10 left-8 flex gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            <div className="w-1 h-1 rounded-full bg-blue-500" />
                            Semantic Search
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            <div className="w-1 h-1 rounded-full bg-purple-500" />
                            Price Prediction
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                            <div className="w-1 h-1 rounded-full bg-pink-500" />
                            Real-time Availability
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12">
                    {['Tulum, Mexico', 'Kyoto, Japan', 'Swiss Alps', 'Santorini'].map((dest, i) => (
                        <button
                            key={dest}
                            className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all text-left group"
                        >
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Trending</p>
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{dest}</p>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
