'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, BellRing, Bell, MapPin, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deletePriceAlert } from '@/app/actions/price-alerts';

const MOCK_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';

// 🕵️ The Critic: Mirror the destination image map from DealCard for consistency
const DESTINATION_IMAGES: Record<string, string> = {
    'paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    'bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80',
    'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80',
    'dubai': 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80',
    'default': 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=80',
};

const getImage = (name: string): string => {
    const lower = name.toLowerCase();
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
        if (lower.includes(key)) return url;
    }
    return DESTINATION_IMAGES['default'];
};

interface Alert {
    id: string;
    targetPrice: number;
    createdAt: Date;
    destination: {
        id: string;
        name: string;
        country: string;
        imageUrl: string;
        slug: string;
    };
}

export const PriceWatchClient: React.FC<{ initialAlerts: Alert[] }> = ({ initialAlerts }) => {
    const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (alertId: string) => {
        setDeletingId(alertId);
        const result = await deletePriceAlert(alertId, MOCK_USER_ID);
        if (result.success) {
            setAlerts((prev) => prev.filter((a) => a.id !== alertId));
        }
        setDeletingId(null);
    };

    if (alerts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 gap-6"
            >
                <div className="p-6 bg-white/3 rounded-[2rem] border border-white/5">
                    <Bell className="w-12 h-12 text-white/20" />
                </div>
                <div className="text-center">
                    <p className="text-xl font-black text-white/20 uppercase tracking-tight mb-2">
                        אין עדיין התראות
                    </p>
                    <p className="text-white/20 text-sm mb-8">
                        התחל לעקוב אחרי מחירים כדי לקבל עדכון כשיש ירידת מחיר.
                    </p>
                    <Link
                        href="/"
                        className="bg-[#d4af37] hover:bg-[#f3e5ab] text-black font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all inline-flex items-center gap-2"
                    >
                        <ExternalLink className="w-4 h-4" />
                        חקור עסקאות
                    </Link>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="grid gap-4">
            <AnimatePresence>
                {alerts.map((alert, index) => {
                    const imgUrl = alert.destination.imageUrl ?? getImage(alert.destination.name);

                    return (
                        <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100, scale: 0.95 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative flex items-center gap-6 bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 hover:border-[#d4af37]/30 p-4 transition-all duration-300 overflow-hidden"
                        >
                            {/* Destination Image */}
                            <div className="relative w-24 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                                <img
                                    src={imgUrl}
                                    alt={alert.destination.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="bg-[#d4af37] text-black text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                        <BellRing className="w-2.5 h-2.5" />
                                        במעקב
                                    </div>
                                </div>
                                <h3 className="text-white font-black text-lg uppercase tracking-tight truncate">
                                    {alert.destination.name}
                                </h3>
                                <div className="flex items-center gap-1.5 text-white/40">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        {alert.destination.country}
                                    </span>
                                </div>
                            </div>

                            {/* Target Price */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">
                                    התראה מתחת ל
                                </p>
                                <p className="text-2xl font-black text-[#d4af37]">
                                    <span className="text-sm opacity-50">$</span>
                                    {alert.targetPrice.toLocaleString()}
                                </p>
                                <p className="text-[9px] text-white/20 mt-1">
                                    הוגדר ב- {new Date(alert.createdAt).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Delete Button */}
                            <motion.button
                                onClick={() => handleDelete(alert.id)}
                                disabled={deletingId === alert.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-3 rounded-2xl border border-white/5 text-white/20 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all disabled:opacity-40"
                            >
                                {deletingId === alert.id ? (
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </motion.button>

                            {/* Subtle hover glow */}
                            <div className="absolute inset-0 bg-[#d4af37]/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[1.5rem]" />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
