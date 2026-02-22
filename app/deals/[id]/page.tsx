import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, TrendingDown, Sparkles, Calendar, Map } from 'lucide-react';
import { generateItinerary } from '@/app/actions/ai-features';

import { BookingButton } from '@/app/components/BookingButton';
import AIInsight from '@/app/components/AIInsight';
import { SniperToggle } from '@/app/components/ui/SniperToggle';

export const dynamic = 'force-dynamic';

export default async function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const deal = await prisma.deal.findUnique({
        where: { id },
        include: { destination: true },
    });

    if (!deal) notFound();

    const itinerary = deal.destination
        ? await generateItinerary(deal.destination.name, 3).catch(() => null)
        : null;

    const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
    const savings = deal.originalPrice - deal.price;

    return (
        <main className="min-h-screen bg-[#050505] text-neutral-200 pb-32 overflow-x-hidden font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#4a3728]/20 to-transparent" />
                <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link
                    href="/deals"
                    className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">כל העסקאות</span>
                </Link>
                {deal.aiRating && (
                    <span className="flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        {deal.aiRating === 'SUPER_HOT' ? '🔥 סופר חם' : deal.aiRating}
                    </span>
                )}
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Hero Image */}
                <div className="relative w-full h-[50vh] rounded-[2.5rem] overflow-hidden mb-12">
                    <img
                        src={deal.imageUrl}
                        alt={deal.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                    <div className="absolute bottom-8 left-8">
                        <div className="bg-[#d4af37] text-black text-[10px] font-black px-4 py-2 rounded-full inline-flex items-center gap-1.5 mb-3">
                            <TrendingDown className="w-3 h-3" />
                            -{discount}% הנחה
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-tight max-w-2xl">
                            {deal.title}
                        </h1>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Left — Price + Booking */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Price Card */}
                        <div className="bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 p-6">
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-4">מחיר עסקאה</p>
                            <div className="flex items-end gap-3 mb-4">
                                <p className="text-5xl font-black text-[#d4af37]">
                                    <span className="text-2xl opacity-50">{deal.currency}</span>
                                    {deal.price.toLocaleString()}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 mb-6">
                                <p className="text-white/25 text-base line-through">
                                    {deal.currency}{deal.originalPrice.toLocaleString()}
                                </p>
                                <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black px-2.5 py-1 rounded-full">
                                    חסכון {deal.currency}{savings.toLocaleString()}
                                </span>
                            </div>

                            <BookingButton dealId={deal.id} />

                            <div className="mt-8">
                                <SniperToggle
                                    dealId={deal.id}
                                    currentPrice={deal.price}
                                    targetPrice={Math.floor(deal.price * 0.85)}
                                />
                            </div>
                        </div>

                        {/* Meta */}
                        {deal.destination && (
                            <div className="bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Map className="w-4 h-4 text-[#d4af37]" />
                                    <div>
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">יעד</p>
                                        <p className="text-white font-black">{deal.destination.name}, {deal.destination.country}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                                    <div>
                                        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">פורסם</p>
                                        <p className="text-white font-black">
                                            {new Date(deal.createdAt).toLocaleDateString('he-IL', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — AI Analysis */}
                    <div className="lg:col-span-2">
                        <div className="bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/20">
                                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                                </div>
                                <h2 className="text-[11px] font-black uppercase tracking-widest text-[#d4af37]">
                                    ניתוח עסקאה עם AI
                                </h2>
                            </div>
                            <AIInsight
                                dealTitle={deal.title}
                                price={deal.price}
                                originalPrice={deal.originalPrice}
                            />
                        </div>
                    </div>
                </div>

                {/* Itinerary */}
                {itinerary && Array.isArray(itinerary) && itinerary.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-[#d4af37]/10 rounded-xl border border-[#d4af37]/20">
                                <Map className="w-4 h-4 text-[#d4af37]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                                    המסלול שלך
                                </h2>
                                <p className="text-white/30 text-xs">תוכנית 3 ימים מונחי AI ל{deal.destination?.name}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {itinerary.map((day: { day: number; tips: string; activities: string[] }, idx: number) => (
                                <div
                                    key={idx}
                                    className="bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 p-6"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-[#d4af37] text-black text-[10px] font-black px-3 py-1.5 rounded-full">
                                            יום {day.day}
                                        </span>
                                    </div>
                                    {day.tips && (
                                        <p className="text-white/50 text-xs mb-4 leading-relaxed border-l-2 border-[#d4af37]/40 pl-3">
                                            {day.tips}
                                        </p>
                                    )}
                                    <ul className="space-y-4">
                                        {(day.activities ?? []).map((act: string | { title?: string; time?: string; description?: string }, aIdx: number) => {
                                            const isObj = typeof act !== 'string';
                                            const title = typeof act === 'string' ? act : (act.title || 'Activity');
                                            const time = isObj ? act.time : undefined;
                                            const description = isObj ? act.description : undefined;
                                            return (
                                                <li key={aIdx} className="flex flex-col gap-1 text-white/70">
                                                    <div className="flex items-start gap-2 text-sm">
                                                        <span className="text-[#d4af37] mt-1 flex-shrink-0">›</span>
                                                        <span className="font-bold text-white">
                                                            {title}
                                                        </span>
                                                        {time && (
                                                            <span className="text-[9px] px-1.5 py-0.5 bg-white/5 rounded text-white/40 uppercase">
                                                                {time}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {description && (
                                                        <p className="text-[11px] text-white/40 pl-5 leading-relaxed">
                                                            {description}
                                                        </p>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
