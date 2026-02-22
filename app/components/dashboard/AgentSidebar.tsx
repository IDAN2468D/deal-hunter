'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, Circle } from 'lucide-react';

const agents = [
    { id: 'alpha', name: 'אלפא', description: 'מודיעת בסיס', status: 'פעיל', color: 'text-blue-500' },
    { id: 'beta', name: 'בטא', description: 'ניתוח דפוסים', status: 'עובד', color: 'text-purple-500' },
    { id: 'gamma', name: 'גמא', description: 'אבטחה והזדהות', status: 'במתינה', color: 'text-emerald-500' },
];

export default function AgentSidebar() {
    return (
        <div className="w-80 h-full bg-white/5 backdrop-blur-2xl border-l border-white/10 p-8 flex flex-col gap-8">
            <div>
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6">
                    תזמורת המערכת
                </h3>

                <div className="space-y-6">
                    {agents.map((agent) => (
                        <motion.div
                            key={agent.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="group relative"
                        >
                            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 group-hover:bg-white/[0.06] transition-all duration-500">
                                <div className={`p-2 rounded-xl bg-white/5 ${agent.color}`}>
                                    {agent.id === 'alpha' ? <Cpu className="w-4 h-4" /> : agent.id === 'beta' ? <Zap className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-white">{agent.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <Circle className={`w-1.5 h-1.5 fill-current ${agent.status === 'active' || agent.status === 'working' ? 'animate-pulse text-emerald-500' : 'text-white/20'}`} />
                                            <span className="text-[10px] uppercase font-black tracking-widest text-white/30 truncate max-w-[50px]">
                                                {agent.status}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/40 font-medium">
                                        {agent.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="mt-auto">
                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden group">
                    <motion.div
                        className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"
                    />
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">פרוטוקול 4.2</p>
                    <p className="text-xs text-white/60 leading-relaxed font-medium">
                        מצב אוטונומי AI פעיל. כל הקלטות מטוהרות דרך השומר.
                    </p>
                </div>
            </div>
        </div>
    );
}
