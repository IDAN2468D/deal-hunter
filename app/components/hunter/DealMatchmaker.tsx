'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Sparkles, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface Deal {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    destinationName: string;
}

interface DealMatchmakerProps {
    deals: Deal[];
    onMatch: (dealId: string) => void;
}

export const DealMatchmaker: React.FC<DealMatchmakerProps> = ({ deals, onMatch }) => {
    const [cards, setCards] = useState<Deal[]>(deals);
    const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

    const activeIndex = cards.length - 1;

    const handleRemove = (direction: 'left' | 'right') => {
        setSwipeDirection(direction);
        if (direction === 'right' && cards[activeIndex]) {
            onMatch(cards[activeIndex].id);
        }
        setTimeout(() => {
            setCards((prev) => prev.slice(0, -1));
            setSwipeDirection(null);
        }, 200);
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 border border-white/10 rounded-[2rem] h-[500px]">
                <Sparkles className="w-12 h-12 text-[#d4af37] mb-4" />
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">נגמרו העסקאות</h3>
                <p className="text-white/40 text-sm">ה-AI שלנו מחפש עסקאות חדשות שיתאימו לטעם שלך. חזור בקרוב!</p>
            </div>
        );
    }

    return (
        <div className="relative h-[500px] w-full max-w-sm mx-auto perspective-1000">
            <AnimatePresence>
                {cards.map((deal, index) => {
                    const isTop = index === activeIndex;
                    return (
                        <SwipeableCard
                            key={deal.id}
                            deal={deal}
                            isTop={isTop}
                            onRemove={handleRemove}
                            index={index}
                        />
                    );
                })}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-50">
                <button
                    onClick={() => handleRemove('left')}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white/50 border border-white/10 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 transition-all shadow-xl group"
                >
                    <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
                <div className="p-2 bg-[#d4af37]/10 rounded-full border border-[#d4af37]/30">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                </div>
                <button
                    onClick={() => handleRemove('right')}
                    className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white/50 border border-white/10 hover:bg-green-500/20 hover:text-green-500 hover:border-green-500/50 transition-all shadow-xl group"
                >
                    <Heart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </div>
    );
};

const SwipeableCard = ({ deal, isTop, onRemove, index }: { deal: Deal, isTop: boolean, onRemove: (dir: 'left' | 'right') => void, index: number }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

    // Overlay colors based on swipe direction
    const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
    const likeOpacity = useTransform(x, [0, 100], [0, 1]);

    const handleDragEnd = (_e: unknown, info: { offset: { x: number }, velocity: { x: number } }) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 500) {
            onRemove('right');
        } else if (offset < -100 || velocity < -500) {
            onRemove('left');
        }
    };

    return (
        <motion.div
            style={{
                x: isTop ? x : 0,
                rotate: isTop ? rotate : 0,
                opacity: isTop ? opacity : 1,
                zIndex: index,
            }}
            drag={isTop ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : (20 - index * 5), opacity: 1 }}
            exit={{ x: 0, opacity: 0, transition: { duration: 0.2 } }}
            className={`absolute inset-0 bg-neutral-900 rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
        >
            <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 pointer-events-none" />

            {/* Like/Nope Feedback Overlays */}
            {isTop && (
                <>
                    <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 text-green-500 font-black text-4xl uppercase px-4 py-2 rounded-xl rotate-[-15deg] pointer-events-none z-10">
                        אהבתי
                    </motion.div>
                    <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 text-red-500 font-black text-4xl uppercase px-4 py-2 rounded-xl rotate-[15deg] pointer-events-none z-10">
                        פס!
                    </motion.div>
                </>
            )}

            <div className="absolute bottom-10 left-6 right-6 pointer-events-none">
                <div className="flex items-center gap-2 text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{deal.destinationName}</span>
                </div>
                <h3 className="text-3xl font-black text-white leading-tight uppercase tracking-tight mb-2 drop-shadow-md">
                    {deal.title}
                </h3>
                <div className="flex items-center justify-between mt-4">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                        <span className="text-[#d4af37] font-black text-2xl">${deal.price}</span>
                    </div>
                    {isTop && (
                        <Link
                            href={`/deals/${deal.id}`}
                            onPointerDownCapture={e => e.stopPropagation()} // Prevent drag when clicking link
                            className="bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white hover:text-black transition-all pointer-events-auto cursor-pointer"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </Link>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
