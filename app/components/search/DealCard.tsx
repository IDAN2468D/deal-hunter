'use client';

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, Activity, TrendingUp, ShieldCheck, Repeat, ArrowRight, Compass, Sparkles } from 'lucide-react';
import { AgentTask } from '@/types/agents';
import { WatchButton } from '@/app/components/alerts/WatchButton';
import { ItineraryDrawer } from '@/app/components/ItineraryDrawer';

import { getDestinationImage, deriveDestinationId } from '@/lib/destinations';

interface DealCardProps {
    task: AgentTask;
    index: number;
}

export const DealCard: React.FC<DealCardProps> = ({ task, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [view, setView] = useState<'PACKAGE' | 'FLIGHT' | 'HOTEL'>('PACKAGE');
    const [isItineraryOpen, setIsItineraryOpen] = useState(false);
    const destinationId = deriveDestinationId(task.destination);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const timeTheme = useMemo(() => {
        const dest = task.destination.toLowerCase();
        if (dest.includes('tokyo') || dest.includes('sydney') || dest.includes('bali')) return 'NIGHT';
        if (dest.includes('paris') || dest.includes('london') || dest.includes('rome')) return 'SUNSET';
        return 'DAY';
    }, [task.destination]);

    const themeGradients = {
        DAY: 'from-blue-900/20 via-black/40 to-transparent',
        NIGHT: 'from-indigo-950/40 via-black/60 to-black/20',
        SUNSET: 'from-orange-900/20 via-purple-900/40 to-black/20'
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'flight': return <Plane className="w-4 h-4" />;
            case 'hotel': return <Hotel className="w-4 h-4" />;
            case 'activity': return <Activity className="w-4 h-4" />;
            default: return <TrendingUp className="w-4 h-4" />;
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const rotateX = isHovered && !isMobile ? (mousePosition.y / 450 - 0.5) * -15 : 0;
    const rotateY = isHovered && !isMobile ? (mousePosition.x / 350 - 0.5) * 15 : 0;

    const destinationImage = getDestinationImage(task.destination);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
                opacity: 1,
                y: 0,
                rotateX,
                rotateY,
                scale: isHovered ? 1.01 : 1
            }}
            transition={{
                delay: index * 0.05,
                duration: isHovered ? 0.2 : 0.8,
                ease: [0.23, 1, 0.32, 1]
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setMousePosition({ x: 0, y: 0 });
            }}
            style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
            className="group relative h-[520px] w-full bg-[#050505] rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-aurora/30 transition-all duration-700 shadow-3xl"
        >
            {/* Immersive Visual Layer */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    src={destinationImage}
                    alt={task.destination}
                    animate={{
                        scale: isHovered ? 1.05 : 1.1,
                        filter: isHovered ? 'blur(0px) brightness(0.6)' : 'blur(4px) brightness(0.4)'
                    }}
                    className="w-full h-full object-cover transition-all duration-1000"
                />
                <div className={`absolute inset-0 bg-gradient-to-t via-black/40 ${themeGradients[timeTheme]} z-10`} />
                <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />
            </div>

            {/* Tactical Status Bar */}
            <div className="relative z-30 p-10 flex justify-between items-start">
                <div className="flex flex-col gap-4">
                    <motion.div
                        animate={{ x: isHovered ? 10 : 0 }}
                        className="glass-lumina px-5 py-2.5 rounded-2xl flex items-center gap-3 w-fit"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-aurora animate-pulse shadow-[0_0_12px_var(--accent-aurora)]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">Lumina Live</span>
                    </motion.div>

                    <div className="flex gap-2">
                        <div className="glass-lumina text-gold text-[9px] font-black px-4 py-2 rounded-full border border-gold/10 tracking-widest uppercase">
                            MATCH SCORE: 98
                        </div>
                    </div>
                </div>

                <div className="p-4 glass-lumina rounded-2xl border border-white/10 text-white group-hover:border-aurora/40 transition-colors">
                    {getIcon(task.type)}
                </div>
            </div>

            {/* Core Narrative Panel */}
            <div className="absolute bottom-0 left-0 right-0 p-10 z-30">
                <div className="flex flex-col gap-8">
                    <div className="space-y-2">
                        <motion.h3
                            animate={{ opacity: isHovered ? 1 : 0.8, x: isHovered ? 10 : 0 }}
                            className="text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl"
                        >
                            {task.destination}
                        </motion.h3>
                        <div className="flex items-center gap-3 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
                            <Compass className="w-3.5 h-3.5" /> High-Asset Discovery
                        </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                        <span className="text-2xl font-black text-gold/40">$</span>
                        <span className="text-7xl font-black text-white tracking-tighter leading-none text-gradient-lumina">
                            {view === 'FLIGHT' ? Math.floor(task.budget * 0.45) : task.budget}
                        </span>
                    </div>

                    <div className="flex flex-col gap-5 mt-4">
                        <div className="flex gap-3 p-2 bg-white/5 border border-white/10 rounded-[2rem] glass-lumina">
                            <button
                                onClick={() => setView('PACKAGE')}
                                className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'PACKAGE' ? 'bg-white text-black shadow-2xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                Full Package
                            </button>
                            <button
                                onClick={() => setView('FLIGHT')}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${view === 'FLIGHT' ? 'bg-gold text-black shadow-2xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                            >
                                <Plane className="w-4 h-4" /> Flight Only
                            </button>
                        </div>

                        <button
                            onClick={() => setIsItineraryOpen(true)}
                            className="group/btn relative w-full overflow-hidden bg-aurora/80 hover:bg-aurora p-[1.5px] rounded-[2rem] transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-aurora-glow"
                        >
                            <div className="relative h-16 bg-[#020202] group-hover/btn:bg-transparent rounded-[2rem] transition-colors duration-500 flex items-center justify-center gap-4">
                                <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white transition-colors duration-500">
                                    Architect Itinerary
                                </span>
                                <ArrowRight className="w-5 h-5 text-aurora group-hover/btn:text-white transition-all duration-500 group-hover/btn:translate-x-2" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Interaction Glow */}
            <motion.div
                animate={{
                    opacity: isHovered && !isMobile ? 0.4 : 0,
                    background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--accent-aurora-glow), transparent 60%)`
                }}
                className="absolute inset-0 pointer-events-none z-40 transition-opacity duration-500"
            />

            {/* Portals */}
            {isItineraryOpen && typeof window !== 'undefined' && createPortal(
                <ItineraryDrawer
                    isOpen={isItineraryOpen}
                    onClose={() => setIsItineraryOpen(false)}
                    destination={task.destination}
                    destinationId={destinationId}
                    budget={task.budget}
                    startDate={task.startDate}
                    endDate={task.endDate}
                />,
                document.body
            )}
        </motion.div>
    );
};

