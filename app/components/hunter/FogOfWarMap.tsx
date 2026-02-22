'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Lock, Unlock } from 'lucide-react';

interface MapRegion {
    id: string;
    name: string;
    isUnlocked: boolean;
    style: React.CSSProperties;
}

const regions: MapRegion[] = [
    { id: 'eu', name: 'אירופה הקלאסית', isUnlocked: true, style: { top: '30%', left: '45%' } },
    { id: 'asia', name: 'המזרח הרחוק', isUnlocked: false, style: { top: '40%', left: '75%' } },
    { id: 'na', name: 'צפון אמריקה', isUnlocked: true, style: { top: '35%', left: '15%' } },
    { id: 'sa', name: 'דרום אמריקה', isUnlocked: false, style: { top: '70%', left: '25%' } },
    { id: 'af', name: 'אפריקה הפראית', isUnlocked: false, style: { top: '65%', left: '50%' } },
    { id: 'oc', name: 'אוקיאניה', isUnlocked: false, style: { top: '80%', left: '85%' } },
];

export const FogOfWarMap: React.FC = () => {
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    return (
        <section className="bg-white/5 border border-white/10 rounded-[3rem] p-8 overflow-hidden relative min-h-[500px]">
            <div className="absolute top-8 left-8 z-10">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">מפת התגליות</h2>
                <p className="text-white/40 text-sm max-w-sm">
                    המשך לחפש עסקאות כדי לחשוף אזורים חדשים במפה האינטראקטיבית. אזורים חסומים יפתחו ברמות מתקדמות.
                </p>
                <div className="mt-4 flex gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                        <Unlock className="w-4 h-4" /> <span>2 אזורים פתוחים</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/30">
                        <Lock className="w-4 h-4" /> <span>4 אזורים חסומים</span>
                    </div>
                </div>
            </div>

            {/* Simulated World Map Background Grid / Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

            {/* The Map Container */}
            <div className="absolute inset-0 top-24 pointer-events-none flex items-center justify-center">
                <div className="relative w-[90%] h-[80%] border border-white/5 rounded-[2rem] bg-[#030308] overflow-hidden pointer-events-auto">

                    {/* Render Regions */}
                    {regions.map((region) => (
                        <motion.div
                            key={region.id}
                            className="absolute"
                            style={region.style}
                            onHoverStart={() => setHoveredRegion(region.id)}
                            onHoverEnd={() => setHoveredRegion(null)}
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="relative group cursor-pointer">
                                {/* Glow if unlocked */}
                                {region.isUnlocked && (
                                    <div className="absolute inset-[-20px] bg-[#d4af37]/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                                )}

                                <div className={`relative p-3 rounded-2xl flex items-center gap-2 border transition-colors ${region.isUnlocked
                                        ? 'bg-[#d4af37]/10 border-[#d4af37]/30 text-[#d4af37]'
                                        : 'bg-black/80 border-white/5 text-white/20 backdrop-blur-md'
                                    }`}>
                                    <MapPin className={`w-5 h-5 ${region.isUnlocked ? 'fill-[#d4af37]/20' : ''}`} />
                                    {region.isUnlocked ? (
                                        <span className="font-black text-xs uppercase tracking-widest">{region.name}</span>
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                </div>

                                {/* Tooltip for locked regions */}
                                {!region.isUnlocked && hoveredRegion === region.id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl z-50"
                                    >
                                        דורש רמה מתקדמת
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {/* Discovery Scanner Animation */}
                    <motion.div
                        className="absolute inset-0 border-t-2 border-[#d4af37]/30 bg-gradient-to-b from-[#d4af37]/5 to-transparent h-32 w-full"
                        initial={{ top: '-40%' }}
                        animate={{ top: '120%' }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>
        </section>
    );
};
