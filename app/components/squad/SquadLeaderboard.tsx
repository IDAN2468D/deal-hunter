import { Trophy, ArrowUp, ArrowDown } from "lucide-react";
import type { Deal } from "@prisma/client";

interface LeaderboardProps {
    deals: { deal: Deal, score: number }[];
}

export function SquadLeaderboard({ deals }: LeaderboardProps) {
    if (!deals || deals.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>No votes cast yet. Start swiping on deals!</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-gradient-to-r from-amber-50 to-orange-50 flex items-center gap-3">
                <div className="p-2.5 bg-white text-amber-500 rounded-xl shadow-sm border border-amber-100">
                    <Trophy className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Squad Leaderboard</h2>
                    <p className="text-xs font-medium text-slate-500">Top voted deals for this trip</p>
                </div>
            </div>

            <div className="divide-y max-h-[400px] overflow-y-auto custom-scrollbar">
                {deals.map((item, index) => (
                    <div key={item.deal.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm
                ${index === 0 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                    index === 1 ? "bg-slate-100 text-slate-700 border border-slate-200" :
                                        index === 2 ? "bg-orange-100 text-orange-800 border border-orange-200" :
                                            "bg-gray-50 text-gray-400 border border-gray-100"}
              `}>
                                {index + 1}
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                    <img src={item.deal.imageUrl} alt={item.deal.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">{item.deal.title}</h3>
                                    <p className="text-emerald-600 font-bold text-sm">${item.deal.price}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 font-bold text-xl text-slate-700">
                                {item.score > 0 ? <ArrowUp className="w-4 h-4 text-emerald-500" /> :
                                    item.score < 0 ? <ArrowDown className="w-4 h-4 text-rose-500" /> : null}
                                {item.score}
                            </div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
