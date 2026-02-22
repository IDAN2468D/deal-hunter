"use client";

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useState } from "react";
import { recordDealSwipe } from "@/app/actions/ai-ux-actions";
import { MapPin, Calendar, Check, X } from "lucide-react";
import type { Deal } from "@prisma/client";

interface SwipeableDealProps {
    deal: Deal;
    userId: string;
    onSwipe: () => void;
    style?: React.CSSProperties;
}

export function SwipeableDeal({ deal, userId, onSwipe, style }: SwipeableDealProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const discardOpacity = useTransform(x, [-10, -100], [0, 1]);
    const controls = useAnimation();

    const [swiped, setSwiped] = useState(false);

    const handleDragEnd = async (event: unknown, info: { offset: { x: number } }) => {
        const swipeThreshold = 100;
        const isLike = info.offset.x > swipeThreshold;
        const isDiscard = info.offset.x < -swipeThreshold;

        if (isLike || isDiscard) {
            setSwiped(true);
            const actionType = isLike ? "LIKE" : "DISCARD";

            // Animate card off screen securely
            await controls.start({
                x: isLike ? 500 : -500,
                opacity: 0,
                transition: { duration: 0.3 }
            });

            // Background action
            const fd = new FormData();
            fd.append("userId", userId);
            fd.append("dealId", deal.id);
            fd.append("action", actionType);
            recordDealSwipe(fd);

            onSwipe();
        } else {
            // Spring back to center
            controls.start({ x: 0, transition: { type: "spring", stiffness: 300, damping: 20 } });
        }
    };

    const handleButtonSwipe = async (direction: "left" | "right") => {
        setSwiped(true);
        const isLike = direction === "right";

        await controls.start({
            x: isLike ? 500 : -500,
            opacity: 0,
            transition: { duration: 0.3 }
        });

        const fd = new FormData();
        fd.append("userId", userId);
        fd.append("dealId", deal.id);
        fd.append("action", isLike ? "LIKE" : "DISCARD");
        recordDealSwipe(fd);

        onSwipe();
    };

    if (swiped) return null;

    return (
        <motion.div
            style={{ x, rotate, opacity, ...style }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            className="absolute top-0 w-full h-full max-w-sm mx-auto cursor-grab active:cursor-grabbing will-change-transform"
        >
            <div className="relative w-full h-[600px] bg-white rounded-[32px] overflow-hidden shadow-xl border border-gray-100 flex flex-col">
                {/* Indicators */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 z-20 border-4 border-emerald-500 text-emerald-500 font-bold text-3xl px-4 py-1 rounded-xl uppercase tracking-widest rotate-[-15deg]">
                    LIKE
                </motion.div>

                <motion.div style={{ opacity: discardOpacity }} className="absolute top-8 right-8 z-20 border-4 border-rose-500 text-rose-500 font-bold text-3xl px-4 py-1 rounded-xl uppercase tracking-widest rotate-[15deg]">
                    PASS
                </motion.div>

                {/* Image */}
                <div className="relative flex-1 bg-gray-100">
                    <img src={deal.imageUrl} alt={deal.title} draggable={false} className="w-full h-full object-cover select-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />

                    <div className="absolute inset-x-0 bottom-0 p-6 text-white text-left pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                            <MapPin className="w-3.5 h-3.5" /> Destination Match
                        </div>
                        <h2 className="text-3xl font-black mb-1 drop-shadow-md">{deal.title}</h2>
                        <div className="flex items-end gap-3 font-semibold pb-2">
                            <span className="text-4xl shadow-sm text-emerald-400 drop-shadow-md">${deal.price}</span>
                            {deal.originalPrice > deal.price && (
                                <span className="text-xl text-white/70 line-through pb-1">
                                    ${deal.originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Info & Buttons */}
                <div className="bg-white p-6 pb-8 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-gray-500 text-sm font-medium px-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-emerald-500" />
                            {new Date(deal.startDate).toLocaleDateString()} - {new Date(deal.endDate).toLocaleDateString()}
                        </div>
                        {deal.aiRating && (
                            <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md font-bold text-xs uppercase">
                                {deal.aiRating.replace("_", " ")}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-2">
                        <button
                            onClick={() => handleButtonSwipe("left")}
                            className="w-16 h-16 rounded-full bg-white border-2 border-rose-100 text-rose-500 flex items-center justify-center shadow-sm hover:bg-rose-50 transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        <button
                            onClick={() => handleButtonSwipe("right")}
                            className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 text-emerald-500 flex items-center justify-center shadow-sm hover:bg-emerald-50 transition-colors z-10"
                        >
                            <Check className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
