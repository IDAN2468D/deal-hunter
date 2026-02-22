'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchInput } from './components/search/SearchInput';
import { AgentStatusBoard } from './components/search/AgentStatusBoard';
import { DealFeed } from './components/search/DealFeed';
import { FlexCalendar } from './components/search/FlexCalendar';
import { performAgenticSearch } from './actions/search';
import { Coffee, Shield, Zap, Sparkles, Calendar, Compass, Plane, Hotel, Trophy } from 'lucide-react';
import { AgentSearchResult } from '@/types/agents';
import { UserMenu } from './components/auth/UserMenu';
import { MagneticWrapper } from './components/ui/MagneticWrapper';
import { AutoHaggler } from './components/deals/AutoHaggler';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'FEED' | 'CALENDAR'>('FEED');
  const [selectedMonth, setSelectedMonth] = useState('2026-08');
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<'FLIGHT_HOTEL' | 'FLIGHT_ONLY'>('FLIGHT_HOTEL');
  const [searchStatus, setSearchStatus] = useState<AgentSearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      // Using a valid userId from the local DB
      const userId = "6995af5576e5d37aa9617051";
      const result = await performAgenticSearch(query, userId);
      setSearchStatus(result);
      if (result.success) {
        setActiveTab('FEED');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const vibes = ["רומנטיקה", "הרפתקה משפחתית", "גב סולו", "בריחה יוקרתית", "חוף ושירותים"];
  const months = ["יולי", "אוגוסט", "ספטמבר", "דצמבר"];

  return (
    <main className="min-h-screen text-neutral-200 font-sans pb-32 overflow-x-hidden">
      {/* Immersive Background Canvas Container */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] opacity-30 filter blur-[150px] animate-pulse">
          <div className="w-full h-full bg-aurora/40 rounded-full" />
        </div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] opacity-20 filter blur-[120px]">
          <div className="w-full h-full bg-gold/30 rounded-full" />
        </div>
        <div className="absolute top-[15%] right-[-5%] w-[500px] h-[500px] opacity-40">
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0)_0%,rgba(2,2,2,1)_100%)]" />
      </div>

      {/* Hero: Tactical Command Center */}
      <section className="relative z-10 pt-32 pb-48">
        <div className="tactical-container">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/5 backdrop-blur-3xl px-6 py-2.5 rounded-full mb-12 aurora-glowScale"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-aurora animate-pulse shadow-[0_0_10px_var(--accent-aurora)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50">Lumina Intelligence v6.0</span>
            </motion.div>

            <div className="relative mb-20 text-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-12 -left-12 text-[150px] font-black text-white/[0.02] uppercase tracking-tighter leading-none select-none italic pointer-events-none"
              >
                DISCOVER
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100, delay: 0.5 }}
                className="text-[14vw] md:text-[13rem] font-black text-white mb-4 tracking-tighter leading-[0.75] uppercase italic"
              >
                CHASE <br />
                <span className="text-gradient-lumina drop-shadow-[0_0_80px_rgba(139,92,246,0.5)]">
                  ULTIMA
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-white/40 text-xs md:text-sm font-medium uppercase tracking-[0.3em] max-w-xl mx-auto leading-relaxed"
              >
                סוכן ה-AI שלך מוכן לאיתור הדילים החמים ביותר בעולם בזמן אמת. <br />
                <span className="text-gold">התחל את המסע שלך עכשיו.</span>
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
              className="w-full max-w-4xl relative group"
            >
              <div className="absolute -inset-8 bg-aurora/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="glass-lumina p-5 rounded-[3rem] border border-white/10 shadow-3xl relative overflow-hidden group-hover:border-aurora/20 transition-all duration-500">
                <div className="absolute inset-0 scanline opacity-10 pointer-events-none" />
                <SearchInput onSearch={handleSearch} isLoading={isSearching} />
              </div>
            </motion.div>

            {/* Premium Navigation Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-16 flex flex-wrap justify-center gap-6"
            >
              <div className="flex gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md">
                {vibes.slice(0, 4).map((vibe, i) => (
                  <button
                    key={vibe}
                    onClick={() => {
                      const newVibe = vibe === selectedVibe ? null : vibe;
                      setSelectedVibe(newVibe);
                      if (newVibe) handleSearch(`${newVibe}`);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest ${vibe === selectedVibe ? 'bg-gold text-black shadow-lg shadow-gold/20' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Operational Feed Below</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </section>

      {/* Epic 5: Auto-Haggler AI Broker */}
      <section className="relative z-20 tactical-container mb-24">
        <AutoHaggler />
      </section>

      {/* Main Content Area */}
      <section className="relative z-10 tactical-container">
        {/* Toggle Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 border-b border-white/5 pb-12">
          <div className="text-right">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">מודיעין עסקאות</h2>
            <div className="flex items-center gap-3 justify-end opacity-40">
              <div className="h-[1px] w-12 bg-white" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Live Intelligence Feed</p>
            </div>
          </div>

          <div className="flex bg-neutral-900/80 p-1.5 rounded-2xl border border-white/5">
            <MagneticWrapper strength={10}>
              <button
                onClick={() => setActiveTab('FEED')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'FEED' ? 'bg-[#d4af37] text-black shadow-xl' : 'text-neutral-500 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4" /> עדכון עסקאות
              </button>
            </MagneticWrapper>
            <MagneticWrapper strength={10}>
              <button
                onClick={() => setActiveTab('CALENDAR')}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === 'CALENDAR' ? 'bg-[#d4af37] text-black shadow-xl' : 'text-neutral-500 hover:text-white'}`}
              >
                <Calendar className="w-4 h-4" /> מטריצת מחירים
              </button>
            </MagneticWrapper>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {(isSearching || searchStatus?.success || searchStatus?.error) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="w-full max-w-4xl mx-auto mb-16"
            >
              <AgentStatusBoard status={
                isSearching ? 'PENDING' :
                  searchStatus?.success ? 'COMPLETED' :
                    searchStatus?.error ? 'FAILED' : 'IDLE'
              } />
            </motion.div>
          )}

          {activeTab === 'FEED' ? (
            <motion.div
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DealFeed
                searchResults={searchStatus?.success ? searchStatus.data?.tasks : undefined}
                filterMode={searchMode}
              />
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto"
            >
              <FlexCalendar initialMonth="2026-08" />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

    </main>
  );
}
