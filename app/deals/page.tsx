import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, TrendingDown, Sparkles, Trophy, Zap, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'כל העסקאות — DealHunter',
    description: 'גלוש עסקאות טיול נבחרות, שדרגו ידי AI ונבחרו עבורך.',
};

export default async function DealsPage() {
    const deals = await prisma.deal.findMany({
        orderBy: { createdAt: 'desc' },
        include: { destination: true },
    });

    const savings = deals.reduce((acc, d) => acc + (d.originalPrice - d.price), 0);
    const hotDeals = deals.filter(d => d.aiRating === 'SUPER_HOT').length;
    const avgDiscount = deals.length > 0
        ? Math.round(deals.reduce((acc, d) => acc + ((d.originalPrice - d.price) / d.originalPrice) * 100, 0) / deals.length)
        : 0;

    return (
        <main className="min-h-screen text-neutral-200 pb-32 font-sans">
            <div className="relative z-10 tactical-container">

                {/* ─── PAGE HEADER ─── */}
                <section className="pt-16 pb-20">
                    {/* Sub-label */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 text-right">
                            סך הכל {deals.length} אותות מודיעין פעילים
                        </span>
                    </div>

                    {/* Giant Headline */}
                    <h1 className="text-[15vw] md:text-[10rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic mb-10">
                        כל ה<span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#f3e5ab] to-bronze">
                            עסקאות
                        </span>
                    </h1>

                    {/* Stat Bento Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { icon: BarChart3, label: 'מבצעי שטח', value: deals.length.toString(), color: 'text-gold', bg: 'bg-gold/10 border-gold/20' },
                            { icon: TrendingDown, label: 'הון שנחסך', value: `$${Math.round(savings / 1000)}K`, color: 'text-white', bg: 'bg-white/5 border-white/10' },
                            { icon: Zap, label: 'סופר חם', value: hotDeals.toString(), color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                            { icon: Sparkles, label: 'הנחה ממוצעת', value: `${avgDiscount}%`, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                        ].map(({ icon: Icon, label, value, color, bg }) => (
                            <div key={label} className={`p-6 glass-tactical ${bg} border rounded-[2rem] flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-500 text-right`}>
                                <div className="flex justify-end">
                                    <Icon className={`w-5 h-5 ${color}`} />
                                </div>
                                <div className={`text-4xl font-black ${color}`}>{value}</div>
                                <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30">{label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ─── DEAL GRID ─── */}
                <section>
                    {deals.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-48 glass-tactical rounded-[4rem] border border-white/5">
                            <Trophy className="w-16 h-16 text-white/10 mb-8" />
                            <p className="text-white/20 text-xl font-black uppercase tracking-tighter mb-8 italic">ממתין לפריסת אותות חדשים.</p>
                            <Link href="/" className="bg-gold text-black font-black text-[10px] uppercase tracking-[0.4em] px-10 py-5 rounded-full hover:bg-gold-bright transition-all shadow-xl shadow-gold/20">
                                הפעל סריקת מודיעין
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {deals.map((deal) => {
                                const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
                                const isHot = deal.aiRating === 'SUPER_HOT';
                                return (
                                    <Link
                                        key={deal.id}
                                        href={`/deals/${deal.id}`}
                                        className={`group block relative rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] ${isHot ? 'border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border border-white/8 glass-tactical'}`}
                                    >
                                        {/* Image Frame */}
                                        <div className="relative h-60 overflow-hidden">
                                            <img
                                                src={deal.imageUrl}
                                                alt={deal.title}
                                                className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100 group-hover:saturate-150"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                                            {/* Discount Badge */}
                                            <div className="absolute top-5 right-5">
                                                <div className={`${isHot ? 'bg-gold text-black shadow-lg shadow-gold/30' : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'} text-[9px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1.5`}>
                                                    <TrendingDown className="w-2.5 h-2.5" />
                                                    -{discount}%
                                                </div>
                                            </div>

                                            {isHot && (
                                                <div className="absolute top-5 left-5 bg-black/50 backdrop-blur-xl text-white text-[9px] font-black px-3 py-1.5 rounded-xl border border-gold/30 flex items-center gap-2">
                                                    <Sparkles className="w-2.5 h-2.5 text-gold" />
                                                    🔥 סופר חם
                                                </div>
                                            )}

                                            {/* Live pulse */}
                                            <div className="absolute bottom-5 right-5 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                                                <span className="text-[8px] font-mono text-white/50 uppercase">פעיל</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-gold mb-3 text-right">
                                                {deal.destination?.name ?? 'מיקום לא ידוע'}
                                            </div>
                                            <h3 className="text-white font-black text-base leading-tight mb-5 line-clamp-2 group-hover:text-gold transition-colors duration-500 text-right">
                                                {deal.title}
                                            </h3>
                                            <div className="flex items-end justify-between pt-4 border-t border-white/5">
                                                <div className="text-right">
                                                    <div className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-1">ערך שוק</div>
                                                    <div className="flex flex-row-reverse items-baseline gap-2">
                                                        <span className="text-gold text-2xl font-black">{deal.currency}{deal.price.toLocaleString()}</span>
                                                        <span className="text-white/20 text-xs line-through font-bold">{deal.currency}{deal.originalPrice.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold group-hover:text-black transition-all duration-500">
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
