'use client';

import React from 'react';
import { Clock, ExternalLink, MapPin } from 'lucide-react';

interface Activity {
    time: string;
    title: string;
    description: string;
    location: string;
}

interface ActivityCardProps {
    activity: Activity;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
    return (
        <div className="group flex flex-col bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[2rem] p-7 transition-all duration-500 hover:-translate-y-2 cursor-pointer">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-black/40 rounded-full border border-white/5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                        {typeof activity.time === 'string' ? activity.time : 'Scheduled'}
                    </span>
                </div>
                <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/5 hover:bg-gold hover:text-black rounded-xl transition-all border border-white/5"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>
            <h4 className="text-xl font-black text-white mb-3 uppercase tracking-tight leading-tight group-hover:text-gold transition-colors">
                {activity.title}
            </h4>
            <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium">
                {activity.description}
            </p>
            <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5 opacity-50 text-[10px] font-black uppercase tracking-widest">
                <MapPin className="w-3 h-3" />
                {activity.location}
            </div>
        </div>
    );
};
