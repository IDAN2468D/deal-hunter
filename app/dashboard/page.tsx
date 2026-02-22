'use client';

import { motion } from 'framer-motion';
import AgentSidebar from '@/app/components/dashboard/AgentSidebar';
import ItineraryDashboard from './itineraries/ItineraryDashboard';
import Link from 'next/link';
import { UserMenu } from '@/app/components/auth/UserMenu';
import { Coffee } from 'lucide-react';

export default function DashboardPage() {
    return (
        <main className="h-screen w-full bg-[#050510] flex overflow-hidden selection:bg-[#d4af37]/30">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            </div>

            <div className="relative z-10 flex w-full h-full">
                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Top Bar */}
                    <header className="h-24 px-12 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-3xl">
                        <div className="flex items-center gap-4">
                            <Link href="/" className="p-2.5 bg-[#d4af37] rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                                <Coffee className="w-5 h-5 text-black" />
                            </Link>
                            <span className="font-black text-xl text-white tracking-tighter uppercase italic">DEAL<span className="text-[#d4af37]">HUNTER</span> Central</span>
                        </div>

                        <div className="flex items-center gap-12">
                            <nav className="hidden md:flex items-center gap-10">
                                {['מסלולים', 'מעקב מחירים', 'נתונים'].map((item, idx) => (
                                    <Link
                                        key={item}
                                        href={item === 'מסלולים' ? '/dashboard' : '#'}
                                        className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${idx === 0 ? 'text-[#d4af37]' : 'text-white/30 hover:text-white'}`}
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </nav>
                            <div className="h-8 w-px bg-white/10" />
                            <UserMenu />
                        </div>
                    </header>

                    <ItineraryDashboard />
                </div>

                {/* Sidebar */}
                <AgentSidebar />
            </div>
        </main>
    );
}
