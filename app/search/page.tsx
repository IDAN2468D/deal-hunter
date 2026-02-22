import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'חיפוש — DealHunter',
    description: 'חפש בין עסקאות נבחרות לחופשה שלך.',
};

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { dest: destParam } = await searchParams;
    const dest = typeof destParam === 'string' ? destParam : undefined;

    const deals = await prisma.deal.findMany({
        where: {
            OR: dest
                ? [
                    { title: { contains: dest, mode: 'insensitive' } },
                    { destination: { name: { contains: dest, mode: 'insensitive' } } },
                ]
                : undefined,
        },
        include: { destination: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <main className="min-h-screen bg-[#050505] text-neutral-200 pb-32 overflow-x-hidden font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-[#4a3728]/20 to-transparent" />
                <div className="absolute top-[10%] right-[5%] w-[500px] h-[500px] bg-[#d4af37]/5 blur-[120px] rounded-full" />
            </div>

            {/* Nav */}
            <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto">
                <Link
                    href="/"
                    className="flex items-center gap-3 text-white/50 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">חזרה לחיפוש</span>
                </Link>
                <span className="bg-white/5 border border-white/5 text-white/40 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    {deals.length} תוצאות
                </span>
            </nav>

            {/* Header */}
            <section className="relative z-10 pt-8 pb-16 px-6 max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-4">
                    <Search className="w-5 h-5 text-[#d4af37]" />
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        {dest ? `תוצאות עבור "${dest}"` : 'גולש בכל העסקאות'}
                    </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85]">
                    {dest
                        ? <>{dest}</>
                        : <>כל ה<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#4a3728]">עסקאות</span></>
                    }
                </h1>
            </section>

            {/* Results */}
            <section className="relative z-10 max-w-7xl mx-auto px-6">
                {deals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-6">
                        <div className="p-6 bg-white/3 rounded-[2rem] border border-white/5">
                            <Search className="w-12 h-12 text-white/20" />
                        </div>
                        <div className="text-center">
                            <p className="text-xl font-black text-white/20 uppercase tracking-tight mb-2">
                                לא נמצאו תוצאות{dest ? ` עבור "${dest}"` : ''}
                            </p>
                            <p className="text-white/15 text-sm mb-8">
                                נסה לשנות את מילת החיפוש או השתמש בסוכן ה-AI בעמוד הבית.
                            </p>
                            <Link
                                href="/"
                                className="bg-[#d4af37] hover:bg-[#f3e5ab] text-black font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-2xl transition-all inline-block"
                            >
                                נסה חיפוש בעזרת AI
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {deals.map((deal) => {
                            const discount = Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100);
                            return (
                                <Link
                                    key={deal.id}
                                    href={`/deals/${deal.id}`}
                                    className="group block bg-neutral-900/60 backdrop-blur-xl rounded-[1.5rem] border border-white/5 hover:border-[#d4af37]/30 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={deal.imageUrl}
                                            alt={deal.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute top-4 left-4 bg-[#d4af37] text-black text-[10px] font-black px-3 py-1.5 rounded-full">
                                            -{discount}%
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">
                                            {deal.destination?.name ?? 'Unknown'}
                                        </p>
                                        <h3 className="text-white font-black text-base leading-tight mb-4 line-clamp-2">
                                            {deal.title}
                                        </h3>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-[#d4af37] text-2xl font-black">
                                                    {deal.currency}{deal.price.toLocaleString()}
                                                </p>
                                                <p className="text-white/25 text-xs line-through">
                                                    {deal.currency}{deal.originalPrice.toLocaleString()}
                                                </p>
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/30 group-hover:text-[#d4af37] transition-colors">
                                                צפייה →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}
