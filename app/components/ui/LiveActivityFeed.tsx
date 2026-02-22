'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Zap, Plane } from 'lucide-react';

interface ActivityEvent {
    id: string;
    user: string;
    action: string;
    destination: string;
    timeAgo: string;
    type: 'purchase' | 'save' | 'level';
}

const mockEvents: Omit<ActivityEvent, 'id' | 'timeAgo'>[] = [
    { user: 'דוד מתל אביב', action: 'הרגע הזמין טיסה ל', destination: 'לונדון', type: 'purchase' },
    { user: 'שרית מחיפה', action: 'הצילה 40% על חופשה ב', destination: 'זנזיבר', type: 'save' },
    { user: 'צייד אנונימי', action: 'שמר את המלצת ה-AI ל', destination: 'טוקיו', type: 'save' },
    { user: 'רועי נ.', action: 'הזמין חבילה של הרגע האחרון ל', destination: 'סנטוריני', type: 'purchase' },
    { user: 'מאיה ש.', action: 'הגיעה לרמה 3 אחרי שהזמינה ל', destination: 'פריז', type: 'level' },
];

export const LiveActivityFeed: React.FC = () => {
    const [currentEvent, setCurrentEvent] = useState<ActivityEvent | null>(null);

    useEffect(() => {
        // Trigger a fake event every 15-45 seconds
        const triggerRandomEvent = () => {
            const randomMock = mockEvents[Math.floor(Math.random() * mockEvents.length)];
            const timeAgoStr = `${Math.floor(Math.random() * 59) + 1} שניות`;

            const newEvent: ActivityEvent = {
                ...randomMock,
                id: Math.random().toString(36).substring(7),
                timeAgo: `לפני ${timeAgoStr}`
            };

            setCurrentEvent(newEvent);

            // Hide the toast after 6 seconds
            setTimeout(() => {
                setCurrentEvent(null);
            }, 6000);

            // Schedule next event
            const nextDelay = Math.floor(Math.random() * 30000) + 15000;
            setTimeout(triggerRandomEvent, nextDelay);
        };

        // Start the cycle after an initial delay
        const initialTimer = setTimeout(triggerRandomEvent, 5000);

        return () => clearTimeout(initialTimer);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'purchase': return <ShoppingBag className="w-4 h-4 text-green-400" />;
            case 'save': return <Star className="w-4 h-4 text-[#d4af37]" />;
            case 'level': return <Zap className="w-4 h-4 text-purple-400" />;
            default: return <Plane className="w-4 h-4 text-white" />;
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[90] pointer-events-none">
            <AnimatePresence>
                {currentEvent && (
                    <motion.div
                        key={currentEvent.id}
                        initial={{ opacity: 0, x: -50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex items-start gap-3 max-w-xs pointer-events-auto cursor-pointer group"
                    >
                        <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 group-hover:bg-white/10 transition-colors">
                            {getIcon(currentEvent.type)}
                        </div>
                        <div className="flex-1">
                            <p className="text-white/90 text-sm font-medium leading-tight mb-1">
                                <span className="font-black text-white">{currentEvent.user}</span>{' '}
                                {currentEvent.action}{' '}
                                <span className="text-[#d4af37] font-black">{currentEvent.destination}</span>
                            </p>
                            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">
                                {currentEvent.timeAgo}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
