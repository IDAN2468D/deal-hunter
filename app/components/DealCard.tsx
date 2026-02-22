'use client';

import Image from 'next/image';
import Link from 'next/link';
import AIInsight from './AIInsight';
import { useState, useRef, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Leaf } from 'lucide-react';
import { calculateCarbonFootprint, getEcoRating } from '@/lib/eco';

interface DealCardProps {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    currency: string;
    imageUrl: string;
    aiRating?: string | null;
}

export default function DealCard({ id, title, price, originalPrice, currency, imageUrl, aiRating }: DealCardProps) {
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    const cardRef = useRef<HTMLDivElement>(null);

    // Mock flight hours based on price for heuristic demo
    const flightHours = Math.max(1, Math.floor(price / 100));
    const stops = price > 500 ? 1 : 0;
    const footprint = calculateCarbonFootprint(flightHours, stops);
    const ecoRating = getEcoRating(footprint);

    // Mouse tracking for the glow effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            whileHover={{ y: -8 }}
            className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500 h-full flex flex-col"
        >
            {/* Hover Glow Overlay */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
                    ),
                }}
            />

            <div className="relative h-48 md:h-64 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {aiRating === "SUPER_HOT" && (
                        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white font-black px-4 py-1.5 rounded-full text-[10px] shadow-lg flex items-center gap-1.5 ring-2 ring-white/20">
                            <span className="animate-pulse">🔥</span> סופר חם!
                        </div>
                    )}
                    {aiRating === "GOOD" && (
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-4 py-1.5 rounded-full text-[10px] shadow-lg ring-2 ring-white/20">
                            ✅ עסקאה טובה
                        </div>
                    )}
                    {aiRating === "AI Rating Unavailable" && (
                        <div className="bg-gray-800/80 backdrop-blur-md text-white/90 font-medium px-4 py-1.5 rounded-full text-[10px] shadow-sm italic ring-1 ring-white/10">
                            ☁️ ניתוח AI באמצע...
                        </div>
                    )}
                </div>

                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-900 font-black px-3 py-1.5 rounded-2xl text-xs shadow-xl scale-110 group-hover:scale-125 transition-transform">
                    {discount}% הנחה
                </div>

                <div className="absolute bottom-4 left-4">
                    <p className="text-white font-medium text-sm drop-shadow-md">החל מ</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white drop-shadow-lg leading-none">${price}</span>
                        <span className="text-white/60 line-through text-sm decoration-red-400/50">${originalPrice}</span>
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-2 leading-tight">
                    {title}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                    <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${ecoRating.color}`}>
                        <Leaf className="w-3 h-3" />
                        {ecoRating.label} ({footprint}kg CO₂)
                    </span>
                </div>

                <div className="flex-grow">
                    <AIInsight
                        dealTitle={title}
                        price={price}
                        originalPrice={originalPrice}
                    />
                </div>

                <div className="mt-6">
                    <Link
                        href={`/deals/${id}`}
                        className="block w-full text-center bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        צפייה בפרטים
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
