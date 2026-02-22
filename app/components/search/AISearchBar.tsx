'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Loader2 } from 'lucide-react';
import { searchDealsWithGemini, DealSuggestion } from '@/app/actions/ai-search';
import { orchestrateSearch } from '@/app/actions/agent-swarm';
import { SwarmResults } from '@/types';
import AIConcierge from '../AIConcierge';

export default function AISearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<DealSuggestion[]>([]);
    const [agentResults, setAgentResults] = useState<SwarmResults | null>(null);
    const [isAgentLoading, setIsAgentLoading] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleSearch = () => {
        if (!query.trim()) return;

        setIsOpen(true);
        setAgentResults(null);

        // 1. Trigger Quick Suggestions (standard flow)
        startTransition(async () => {
            const results = await searchDealsWithGemini(query);
            setSuggestions(results);
        });

        // 2. Trigger Deep Agent Swarm (New Parallel Flow)
        setIsAgentLoading(true);
        orchestrateSearch(query, 2000).then(res => {
            setAgentResults(res);
            setIsAgentLoading(false);
        }).catch(() => {
            setIsAgentLoading(false);
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleSelect = (city: string) => {
        setIsOpen(false);
        router.push(`/search?dest=${encodeURIComponent(city)}`);
    };

    return (
        <div className="w-full max-w-5xl mx-auto mb-8 relative z-50">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl">
                    <span className="pl-4 text-2xl animate-pulse">✨</span>
                    <input
                        type="text"
                        placeholder="Describe your dream trip... (e.g., 'Luxury weekend in Paris')"
                        className="w-full bg-transparent border-none text-white text-lg placeholder-white/70 focus:ring-0 focus:outline-none px-4 py-4"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isPending || isAgentLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-xl font-black transition-all disabled:opacity-50 shadow-xl shadow-blue-500/20"
                    >
                        {isPending || isAgentLoading ? (
                            <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        ) : (
                            'ASK AI CONCIERGE'
                        )}
                    </button>
                </div>
            </div>

            {/* Combined Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-6 bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-white/30 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-6 duration-500 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-black text-xl text-gray-900 tracking-tight">
                                AI Intelligence Hub
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Suggestions Column */}
                        <div className="space-y-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Quick Recommendations</p>
                            <div className="space-y-4">
                                {suggestions.map((deal, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelect(deal.city)}
                                        className="p-5 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-gray-100 cursor-pointer transition-all border border-transparent hover:border-blue-100 group"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {deal.city}, {deal.country}
                                            </span>
                                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-black">
                                                {deal.matchScore}% MATCH
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                            {deal.description}
                                        </p>
                                    </div>
                                ))}
                                {isPending && suggestions.length === 0 && (
                                    <div className="py-12 flex justify-center">
                                        <Loader2 className="w-8 h-8 text-blue-200 animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Agency Swarm Column */}
                        <div className="border-l border-gray-100 pl-12">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Deep Agent Analysis</p>
                            <AIConcierge results={agentResults} isLoading={isAgentLoading} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
