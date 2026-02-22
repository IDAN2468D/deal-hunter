'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellRing, Eye } from 'lucide-react';
import { PriceAlertModal } from '@/app/components/alerts/PriceAlertModal';
import { incrementWatchCount } from '@/app/actions/price-alerts';

interface WatchButtonProps {
    destinationId: string;
    destinationName: string;
    currentPrice: number;
    watchCount?: number;
}

export const WatchButton: React.FC<WatchButtonProps> = ({
    destinationId,
    destinationName,
    currentPrice,
    watchCount = 0,
}) => {
    const [isWatching, setIsWatching] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayCount, setDisplayCount] = useState(watchCount);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleAlertSet = async () => {
        setIsWatching(true);
        setDisplayCount((prev) => prev + 1);
        // Fire-and-forget the watchCount increment — UX doesn't wait for it
        await incrementWatchCount(destinationId).catch(() => {
            // Silently ignore — optimistic UI is already updated
        });
    };

    return (
        <>
            {/* Watch Button — pill style with count, absolutely positioned on card */}
            <motion.button
                onClick={handleClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={isWatching ? 'Watching — click to update alert' : 'Watch this deal for price alerts'}
                className={`
                    relative flex items-center gap-1.5 px-3 py-2 rounded-full
                    border backdrop-blur-xl transition-all duration-300 select-none
                    ${isWatching
                        ? 'bg-[#d4af37] border-[#d4af37]/80 text-black shadow-lg shadow-[#d4af37]/30'
                        : 'bg-black/60 border-white/15 text-white hover:bg-[#d4af37]/15 hover:border-[#d4af37]/50'
                    }
                `}
            >
                {/* Bell icon */}
                <AnimatePresence mode="wait">
                    {isWatching ? (
                        <motion.span
                            key="active"
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                            <BellRing className="w-3.5 h-3.5" />
                        </motion.span>
                    ) : (
                        <motion.span key="idle" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Bell className="w-3.5 h-3.5" />
                        </motion.span>
                    )}
                </AnimatePresence>

                {/* Label */}
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                    {isWatching ? 'Watching' : 'Watch'}
                </span>

                {/* Watch count */}
                {displayCount > 0 && (
                    <motion.span
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`
                            flex items-center gap-0.5 text-[8px] font-black leading-none
                            pl-1.5 border-l
                            ${isWatching ? 'border-black/20 text-black/60' : 'border-white/15 text-white/50'}
                        `}
                    >
                        <Eye className="w-2.5 h-2.5" />
                        {displayCount}
                    </motion.span>
                )}

                {/* Active pulse ring */}
                <AnimatePresence>
                    {isWatching && (
                        <motion.span
                            className="absolute inset-0 rounded-full bg-[#d4af37]/40"
                            initial={{ scale: 1, opacity: 0.5 }}
                            animate={{ scale: 1.6, opacity: 0 }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                        />
                    )}
                </AnimatePresence>
            </motion.button>

            <PriceAlertModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAlertSet={handleAlertSet}
                destinationId={destinationId}
                destinationName={destinationName}
                currentPrice={currentPrice}
            />
        </>
    );
};
