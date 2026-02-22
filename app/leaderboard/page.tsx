import { prisma } from '@/lib/prisma';
import { Trophy, Star, Crown, Medal, Zap } from 'lucide-react';

export const metadata = {
    title: 'Global Leaderboard | DealHunter Elite',
    description: 'See the top DealHunter Elite agents and their badges.',
};

export default async function LeaderboardPage() {
    const users = await prisma.user.findMany({
        take: 50,
        orderBy: { points: 'desc' },
        include: { userBadges: { include: { badge: true } } }
    });

    const top3 = users.slice(0, 3);
    const rest = users.slice(3);

    const rankColors: Record<number, string> = {
        0: 'text-gold border-gold/40 bg-gold/10 shadow-[0_0_30px_rgba(212,175,55,0.15)]',
        1: 'text-[#C0C0C0] border-[#C0C0C0]/40 bg-[#C0C0C0]/10',
        2: 'text-[#CD7F32] border-[#CD7F32]/40 bg-[#CD7F32]/10',
    };

    const RankIcon = ({ idx }: { idx: number }) => {
        if (idx === 0) return <Crown className="w-8 h-8 text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />;
        if (idx === 1) return <Medal className="w-8 h-8 text-[#C0C0C0]" />;
        if (idx === 2) return <Medal className="w-8 h-8 text-[#CD7F32]" />;
        return <span className="text-xl font-black text-white/20">#{idx + 1}</span>;
    };

    return (
        <div className="min-h-screen text-white pb-24 relative overflow-hidden">

            {/* ─── HEADER ─── */}
            <section className="tactical-container pt-16 pb-20 text-center">
                <div className="inline-flex items-center gap-3 bg-white/[0.03] border border-white/10 px-5 py-2 rounded-full mb-12">
                    <Zap className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Real-time Global Rankings</span>
                </div>

                <h1 className="text-[12vw] md:text-[9rem] font-black text-white uppercase tracking-tighter leading-[0.8] italic mb-6">
                    דירוג <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-[#f3e5ab] to-bronze">ציידים</span>
                </h1>
                <p className="text-white/30 text-xs font-black uppercase tracking-[0.4em] mb-20">Operational Command Array v5.0 · Live Update</p>

                {/* ─── TOP 3 PODIUM ─── */}
                {top3.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mb-16 items-end">
                        {/* 2nd place */}
                        {top3[1] && (
                            <div className={`glass-tactical border rounded-[2.5rem] p-6 flex flex-col items-center gap-4 ${rankColors[1]}`}>
                                <Medal className="w-8 h-8 text-[#C0C0C0]" />
                                <div className="w-14 h-14 rounded-2xl bg-[#C0C0C0]/10 border border-[#C0C0C0]/30 flex items-center justify-center text-2xl font-black text-[#C0C0C0]">
                                    {top3[1].name?.[0]?.toUpperCase() ?? 'U'}
                                </div>
                                <div className="text-center">
                                    <div className="font-black text-sm text-white truncate max-w-[120px]">{top3[1].name ?? 'Hunter'}</div>
                                    <div className="text-[9px] font-mono text-[#C0C0C0]/60 mt-1">{top3[1].points.toLocaleString()} XP</div>
                                </div>
                            </div>
                        )}
                        {/* 1st place */}
                        {top3[0] && (
                            <div className={`glass-tactical border rounded-[2.5rem] p-8 flex flex-col items-center gap-5 scale-105 ${rankColors[0]}`}>
                                <Crown className="w-10 h-10 text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gold/30 blur-xl rounded-full" />
                                    <div className="relative w-16 h-16 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-3xl font-black text-gold">
                                        {top3[0].name?.[0]?.toUpperCase() ?? 'U'}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="font-black text-base text-white truncate max-w-[140px]">{top3[0].name ?? 'Hunter'}</div>
                                    <div className="text-[10px] font-mono text-gold/80 mt-1">{top3[0].points.toLocaleString()} XP</div>
                                </div>
                            </div>
                        )}
                        {/* 3rd place */}
                        {top3[2] && (
                            <div className={`glass-tactical border rounded-[2.5rem] p-6 flex flex-col items-center gap-4 ${rankColors[2]}`}>
                                <Medal className="w-8 h-8 text-[#CD7F32]" />
                                <div className="w-14 h-14 rounded-2xl bg-[#CD7F32]/10 border border-[#CD7F32]/30 flex items-center justify-center text-2xl font-black text-[#CD7F32]">
                                    {top3[2].name?.[0]?.toUpperCase() ?? 'U'}
                                </div>
                                <div className="text-center">
                                    <div className="font-black text-sm text-white truncate max-w-[120px]">{top3[2].name ?? 'Hunter'}</div>
                                    <div className="text-[9px] font-mono text-[#CD7F32]/60 mt-1">{top3[2].points.toLocaleString()} XP</div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ─── REST OF LEADERBOARD ─── */}
            <section className="tactical-container">
                <div className="max-w-4xl mx-auto space-y-3">
                    {rest.map((user, idx) => (
                        <div
                            key={user.id}
                            className="group flex items-center gap-6 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
                        >
                            <div className="w-12 text-center">
                                <RankIcon idx={idx + 3} />
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-white/60 group-hover:scale-105 transition-transform shrink-0">
                                {user.name?.[0]?.toUpperCase() ?? 'U'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="font-black text-white text-base tracking-tight truncate">{user.name ?? 'Anonymous Hunter'}</div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gold/70 bg-gold/10 px-2.5 py-1 rounded-lg border border-gold/20">
                                        LVL {user.level ?? 1}
                                    </span>
                                    <span className="flex items-center gap-1 text-[9px] font-mono text-white/30">
                                        <Star className="w-3 h-3 text-gold/50 fill-gold/20" />
                                        {user.points.toLocaleString()} XP
                                    </span>
                                </div>
                            </div>

                            <div className="hidden sm:flex flex-wrap justify-end gap-1.5 max-w-[180px]">
                                {user.userBadges.slice(0, 4).map((ub) => (
                                    <div
                                        key={ub.id}
                                        title={ub.badge.name}
                                        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:scale-110 hover:bg-gold/10 hover:border-gold/30 transition-all cursor-help"
                                    >
                                        {ub.badge.iconUrl}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {users.length === 0 && (
                        <div className="text-center py-24 glass-tactical border border-white/5 rounded-[3rem]">
                            <Trophy className="w-16 h-16 text-white/5 mx-auto mb-6" />
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2 italic">No Hunters Deployed</h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Awaiting deployment for the current operational cycle.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
