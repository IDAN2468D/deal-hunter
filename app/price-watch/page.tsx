import React from 'react';
import Link from 'next/link';
import { getUserAlerts } from '@/app/actions/price-alerts';
import { PriceWatchClient } from '@/app/price-watch/PriceWatchClient';
import { BellRing, ShieldCheck, Zap, Activity, ArrowLeft } from 'lucide-react';

const MOCK_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';

export const metadata = {
    title: 'מעקב מחירים — DealHunter',
    description: 'עקוב אחר העסקאות השמורות שלך וקבל התראות כשמחיריהן יורדים.',
};

export default async function PriceWatchPage() {
    const { data: alerts = [], success } = await getUserAlerts(MOCK_USER_ID);

    return (
        <main className="min-h-screen text-neutral-200 pb-32 font-sans">
            {/* ── HERO HEADER ── */}
            <section className="tactical-container pt-16 pb-20">

                {/* Back Link */}
                <Link href="/" className="inline-flex items-center gap-2 text-white/30 hover:text-white transition-colors group mb-12">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">חזרה לעסקאות</span>
                </Link>

                <div className="flex flex-col items-center text-center gap-8">
                    {/* Icon with glow */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/30 blur-3xl rounded-full scale-150" />
                        <div className="relative p-6 bg-gradient-to-br from-gold/20 to-bronze/10 border border-gold/30 rounded-[2rem]">
                            <BellRing className="w-12 h-12 text-gold" />
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Price Intelligence System v5.0</span>
                        </div>
                        <h1 className="text-[12vw] md:text-[8rem] font-black text-white uppercase tracking-tighter leading-[0.85] italic mb-4">
                            מעקב{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#f3e5ab] to-bronze">
                                מחירים
                            </span>
                        </h1>
                        <p className="text-white/30 text-sm max-w-md mx-auto">
                            התראות המחיר הפעילות שלך. נודיע לך ברגע שמחיר העסקה ירד מהיעד.
                        </p>
                    </div>

                    {/* Bento Stats */}
                    <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
                        {[
                            { icon: BellRing, value: alerts.length.toString(), label: 'התראות פעילות', color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
                            { icon: Activity, value: '24/7', label: 'מעקב רציף', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                            { icon: Zap, value: 'Instant', label: 'זמן תגובה', color: 'text-white', bg: 'bg-white/5 border-white/10' },
                        ].map(({ icon: Icon, value, label, color, bg }) => (
                            <div key={label} className={`p-5 glass-tactical ${bg} border rounded-[1.75rem] flex flex-col items-center gap-2`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                                <div className={`text-2xl font-black ${color}`}>{value}</div>
                                <div className="text-[8px] font-black uppercase tracking-[0.2em] text-white/25 text-center">{label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-5 py-2.5 rounded-full">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">System Active · V5.0</span>
                    </div>
                </div>
            </section>

            {/* ── CONTENT ── */}
            <section className="tactical-container max-w-4xl">
                {!success ? (
                    <div className="text-center py-20 glass-tactical rounded-[3rem] border border-white/5">
                        <p className="text-white/30 text-sm">שגיאה בטעינת התראות. אנא נסה שוב.</p>
                    </div>
                ) : (
                    <PriceWatchClient initialAlerts={alerts} />
                )}
            </section>
        </main>
    );
}
