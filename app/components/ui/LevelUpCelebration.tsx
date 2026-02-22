'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LevelUpCelebrationProps {
    level: number;
    isVisible: boolean;
    onComplete: () => void;
}

export const LevelUpCelebration: React.FC<LevelUpCelebrationProps> = ({ level, isVisible, onComplete }) => {

    useEffect(() => {
        if (isVisible) {
            // Trigger Confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#d4af37', '#ffffff', '#f3e5ab']
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#d4af37', '#ffffff', '#f3e5ab']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };
            frame();

            // Auto-close after 5 seconds
            const timer = setTimeout(() => {
                onComplete();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Dark Overlay */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Golden Radial Glow */}
                    <motion.div
                        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.2)_0%,transparent_60%)]"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    />

                    {/* Main Content */}
                    <div className="relative flex flex-col items-center pointer-events-auto">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="bg-gradient-to-br from-[#d4af37] to-[#8a7322] p-6 rounded-full shadow-[0_0_100px_rgba(212,175,55,0.6)] mb-8 border-4 border-white/20 relative"
                        >
                            <Trophy className="w-16 h-16 text-black" />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-[-20px] rounded-full border border-dashed border-[#d4af37]/50"
                            />
                        </motion.div>

                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-white text-xl md:text-2xl font-black uppercase tracking-[0.5em] mb-4 text-center"
                        >
                            רמה חדשה נפתחה!
                        </motion.h2>

                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f3e5ab] to-[#d4af37] mb-8"
                        >
                            צייד רמה {level}
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full border border-white/20"
                        >
                            <Sparkles className="w-4 h-4 text-[#d4af37]" />
                            <span className="text-white/80 font-medium text-sm">הטבות עילית חדשות עודכנו בחשבונך.</span>
                            <Star className="w-4 h-4 text-[#d4af37]" />
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            onClick={onComplete}
                            className="mt-12 text-white/50 hover:text-white uppercase tracking-widest text-xs font-black transition-colors"
                        >
                            המשך לפורטל ←
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
