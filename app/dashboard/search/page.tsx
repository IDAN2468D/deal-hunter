'use client';

import { motion } from 'framer-motion';
import AgentSidebar from '@/app/components/dashboard/AgentSidebar';
import CommandCenter from '@/app/components/dashboard/CommandCenter';

export default function SearchDashboard() {
    return (
        <main className="h-screen w-full bg-[#050510] flex overflow-hidden selection:bg-blue-500/30">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
            </div>

            <div className="relative z-10 flex w-full h-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    {/* Top Bar */}
                    <header className="h-20 px-12 flex items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20" />
                            <span className="font-black text-xl text-white tracking-tighter italic">DEALHUNTER</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <nav className="flex items-center gap-8">
                                {['Intelligence', 'Discovery', 'Analytics'].map((item) => (
                                    <a key={item} href="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">
                                        {item}
                                    </a>
                                ))}
                            </nav>
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 font-bold text-xs ring-offset-2 ring-offset-black transition-all hover:ring-2 ring-blue-500/50">
                                JD
                            </div>
                        </div>
                    </header>

                    <CommandCenter />
                </div>

                {/* Sidebar */}
                <AgentSidebar />
            </div>
        </main>
    );
}
