'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Shield, Zap, Target, Star, Lock, Share2, Compass } from 'lucide-react';

const BADGES = [
    { id: '1', name: 'מגלה ארצות', desc: 'חיפשת יעדים ביותר מ-3 יבשות', icon: Compass, color: 'text-blue-400', earned: true },
    { id: '2', name: 'צייד השגיאות', desc: 'תפסת דיל עם הנחה של מעל 60%', icon: Zap, color: 'text-gold', earned: true },
    { id: '3', name: 'נכס עלית', desc: 'הזמנת מלון 5 כוכבים במחיר של אכסניה', icon: Shield, color: 'text-emerald-400', earned: false },
    { id: '4', name: 'מתכנן על', desc: 'ייצרת 10 מסלולים מותאמים אישית', icon: Target, color: 'text-purple-400', earned: true },
    { id: '5', name: 'הצייד המתמיד', desc: '7 ימים רצופים של חיפוש דילים', icon: Star, color: 'text-orange-400', earned: false },
];

export default function HunterVault() {
    return (
        <div className="min-h-screen bg-[#020202] py-24 px-10 relative overflow-hidden">
            {/* Immersive Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[1000px] h-[1000px] bg-gold/5 blur-[250px] rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-[1000px] h-[1000px] bg-aurora/5 blur-[250px] rounded-full" />
                <div className="absolute inset-0 cyber-grid opacity-[0.03]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                    <div className="text-right flex-1">
                        <div className="flex items-center justify-end gap-3 mb-4">
                            <span className="text-[10px] font-black text-gold uppercase tracking-[0.4em]">מועדון העלית של לומינה</span>
                            <div className="p-2 bg-gold/10 rounded-lg border border-gold/20">
                                <Trophy className="w-4 h-4 text-gold" />
                            </div>
                        </div>
                        <h1 className="text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
                            כספת <span className="text-gradient-lumina">הצייד</span>
                        </h1>
                        <p className="text-white/30 text-xs font-bold uppercase tracking-[0.5em] mt-6">הוכחת הציד // רמה 12 // צייד מורשה</p>
                    </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
                    {[
                        { label: 'תגים שנאספו', value: '14/25', icon: Shield },
                        { label: 'דירוג גלובלי', value: '#124', icon: Trophy },
                        { label: 'נקודות מוניטין', value: '8,450', icon: Zap },
                        { label: 'חיסכון מצטבר', value: '$12.4K', icon: Star },
                    ].map((stat, i) => (
                        <div key={i} className="glass-tactical p-8 rounded-[2.5rem] border border-white/5 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-white/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                            <stat.icon className="w-5 h-5 text-white/20 mb-4" />
                            <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {BADGES.map((badge, i) => (
                        <motion.div
                            key={badge.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className={`relative glass-tactical p-10 rounded-[3.5rem] border group transition-all duration-700 ${badge.earned ? 'border-white/10 hover:border-gold/40' : 'border-white/5 opacity-40 grayscale'}`}
                        >
                            <div className="flex justify-between items-start mb-10">
                                <div className={`p-5 rounded-[2rem] bg-white/5 border border-white/10 transition-all duration-700 ${badge.earned ? 'group-hover:scale-110 group-hover:bg-gold/10 group-hover:border-gold/20' : ''}`}>
                                    <badge.icon className={`w-8 h-8 ${badge.earned ? badge.color : 'text-white/20'}`} />
                                </div>
                                {!badge.earned && <Lock className="w-5 h-5 text-white/20" />}
                                {badge.earned && (
                                    <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                                        <Share2 className="w-4 h-4 text-white/40" />
                                    </button>
                                )}
                            </div>

                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-3 text-right">
                                {badge.name}
                            </h3>
                            <p className="text-white/30 text-[11px] font-bold uppercase tracking-widest leading-relaxed text-right">
                                {badge.desc}
                            </p>

                            {badge.earned && (
                                <div className="mt-8 flex items-center justify-end gap-3">
                                    <span className="text-[8px] font-mono text-gold/40 uppercase">הושלם ב-14.02.26</span>
                                    <div className="h-[1px] flex-1 bg-gold/10" />
                                </div>
                            )}

                            {/* Hover Status */}
                            {badge.earned && (
                                <div className="absolute bottom-6 left-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[8px] font-black text-gold uppercase tracking-[0.3em]">PROVEN_HUNT</span>
                                </div>
                            )}
                        </motion.div>
                    ))}

                    {/* Mystery Badge Placeholder */}
                    <div className="glass-tactical p-10 rounded-[3.5rem] border border-white/5 border-dashed flex flex-col items-center justify-center opacity-20">
                        <Lock className="w-10 h-10 text-white/20 mb-6" />
                        <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">אות מסתורין</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
