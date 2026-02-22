'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Search, CheckCircle2, AlertCircle, Loader2, Zap } from 'lucide-react';

type StepStatus = 'waiting' | 'active' | 'completed' | 'failed';

interface AgentStatusBoardProps {
    status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'IDLE';
}

export const AgentStatusBoard: React.FC<AgentStatusBoardProps> = ({ status }) => {
    const getStepStatus = (step: 'alpha' | 'beta' | 'gamma'): StepStatus => {
        if (status === 'IDLE') return 'waiting';
        if (status === 'FAILED') return 'failed';
        if (step === 'alpha') return status === 'PENDING' ? 'active' : 'completed';
        if (step === 'beta') return status === 'PENDING' ? 'waiting' : 'completed';
        if (step === 'gamma') return status === 'COMPLETED' ? 'completed' : 'waiting';
        return 'waiting';
    };

    const steps = [
        { id: 'alpha', label: 'סוכן אלפא', desc: 'פירוק בקשה', icon: Cpu },
        { id: 'beta', label: 'סוכן בטא', desc: 'סריקת שוק', icon: Search },
        { id: 'gamma', label: 'סוכן גמא', desc: 'אימות נתונים', icon: CheckCircle2 },
    ];

    if (status === 'IDLE') return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-xl mx-auto py-2"
        >
            <div className="relative flex items-center gap-2 p-2 glass-tactical rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">

                {/* Scanning shimmer */}
                {status === 'PENDING' && (
                    <motion.div
                        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-gold/8 to-transparent skew-x-12 pointer-events-none"
                        animate={{ left: ['-60%', '150%'] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
                    />
                )}

                {/* Left: Status Pill */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 shrink-0">
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gold whitespace-nowrap">
                        {status === 'PENDING' ? 'סורק...' : status === 'COMPLETED' ? 'הושלם' : 'שגיאה'}
                    </span>
                </div>

                {/* Steps */}
                <div className="flex-1 flex items-center gap-1.5">
                    {steps.map((step, idx) => {
                        const stepStatus = getStepStatus(step.id as 'alpha' | 'beta' | 'gamma');
                        const Icon = step.icon;
                        const isCompleted = stepStatus === 'completed';
                        const isActive = stepStatus === 'active';
                        const isFailed = stepStatus === 'failed';

                        return (
                            <React.Fragment key={idx}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-500 border ${isActive
                                            ? 'bg-gold/15 border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                            : isCompleted
                                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                                : isFailed
                                                    ? 'bg-red-500/10 border-red-500/20'
                                                    : 'bg-transparent border-transparent opacity-30'
                                        }`}
                                >
                                    <div className={`shrink-0 transition-colors duration-500 ${isActive ? 'text-gold' : isCompleted ? 'text-emerald-400' : isFailed ? 'text-red-400' : 'text-white/30'
                                        }`}>
                                        {isFailed ? <AlertCircle className="w-3.5 h-3.5" /> :
                                            isActive ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
                                                <Icon className="w-3.5 h-3.5" />}
                                    </div>
                                    <div className="hidden sm:flex flex-col overflow-hidden">
                                        <span className={`text-[8px] font-black uppercase tracking-widest truncate ${isActive ? 'text-gold' : isCompleted ? 'text-emerald-400' : 'text-white/50'
                                            }`}>
                                            {step.label}
                                        </span>
                                        <span className="text-[7px] text-white/25 uppercase tracking-wider truncate">{step.desc}</span>
                                    </div>
                                </motion.div>

                                {idx < steps.length - 1 && (
                                    <div className={`w-4 h-[1px] shrink-0 transition-all duration-700 ${isCompleted ? 'bg-emerald-500/40' : 'bg-white/10'
                                        }`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};
