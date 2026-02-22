'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, Coffee, Utensils, Star, Sun, Moon } from 'lucide-react';

interface ItineraryDay {
    day: number;
    activities: (string | { title?: string; time?: string; description?: string })[];
    tips?: string;
}

interface ItineraryGridProps {
    itinerary: ItineraryDay[];
}

export default function ItineraryGrid({ itinerary }: ItineraryGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {itinerary.map((day, index) => (
                <motion.div
                    key={day.day}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all group"
                >
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-6xl font-black text-blue-50/50 group-hover:text-blue-100/50 transition-colors">
                            0{day.day}
                        </span>
                    </div>

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900">Day {day.day}</h3>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {day.activities.map((activity, i) => {
                                const isObj = typeof activity !== 'string';
                                const title = typeof activity === 'string' ? activity : (activity.title || 'Activity');
                                const time = isObj ? activity.time : undefined;
                                const description = isObj ? activity.description : undefined;

                                return (
                                    <li key={i} className="flex flex-col gap-1 group/item">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 group-hover/item:scale-150 transition-transform" />
                                            <span className="text-gray-600 font-bold leading-relaxed group-hover/item:text-gray-900 transition-colors">
                                                {title}
                                            </span>
                                            {time && (
                                                <span className="text-[8px] mt-1 bg-gray-100 px-1.5 py-0.5 rounded text-gray-400 uppercase">
                                                    {time}
                                                </span>
                                            )}
                                        </div>
                                        {description && (
                                            <p className="text-[10px] text-gray-400 pl-4.5 leading-relaxed">
                                                {description}
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>

                        {day.tips && (
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                                <p className="text-xs font-black uppercase tracking-widest text-amber-600 mb-1 flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-amber-600" /> Traveler Tip
                                </p>
                                <p className="text-xs text-amber-800 leading-relaxed italic">
                                    "{day.tips}"
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
