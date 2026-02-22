"use client";

import { useChat } from "@ai-sdk/react";
import { ChatMessage, ToolInvocation } from "@/types";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function FloatingAgent() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as unknown as {
        messages: ChatMessage[];
        input: string;
        handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
        isLoading: boolean;
    };
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.9, rotate: -2 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: 30, scale: 0.9, rotate: 2 }}
                        className="fixed bottom-28 right-8 w-[420px] h-[650px] max-h-[85vh] glass-lumina rounded-[3rem] shadow-3xl border border-white/10 flex flex-col z-[500] overflow-hidden"
                    >
                        {/* Lumina Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between relative bg-black/40">
                            <div className="absolute inset-0 bg-aurora/5 blur-2xl pointer-events-none" />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="relative">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 glass-lumina shadow-aurora-glow">
                                        <Bot className="w-7 h-7 text-aurora" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-aurora border-2 border-black animate-pulse shadow-[0_0_10px_var(--accent-aurora)]" />
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-white tracking-tighter uppercase italic">Lumina <span className="text-aurora">Concierge</span></h3>
                                    <div className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-aurora" />
                                        Sublink Active
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-3 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10 text-white/40 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Immersive Chat Stream */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-transparent relative">
                            <div className="absolute inset-0 scanline opacity-5 pointer-events-none" />

                            {messages.length === 0 && (
                                <div className="text-center py-20 px-8">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-3xl">
                                        <Sparkles className="w-10 h-10 text-gold/40" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-3">Architect Your Journey</h3>
                                    <p className="text-white/30 text-xs font-medium leading-relaxed tracking-wider">I am your high-performance interface. Ask me to discover exclusive destinations or optimize your itinerary.</p>
                                </div>
                            )}

                            {messages.map((m: ChatMessage) => (
                                <motion.div
                                    initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={m.id}
                                    className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10 glass-lumina ${m.role === "user" ? "text-gold" : "text-aurora"}`}>
                                        {m.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                    </div>
                                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed relative ${m.role === "user"
                                        ? "bg-gold text-black font-bold rounded-tr-none shadow-[0_10px_30px_rgba(229,195,102,0.2)]"
                                        : "glass-lumina border border-white/10 text-white/80 rounded-tl-none shadow-2xl"
                                        }`}>
                                        {m.content}

                                        {m.toolInvocations?.map((tool: ToolInvocation) => (
                                            <div key={tool.toolCallId} className="mt-5 glass-lumina border border-white/10 p-5 rounded-[1.5rem] bg-black/40">
                                                {(tool.state === 'call' || tool.state === 'partial-call') ? (
                                                    <div className="flex items-center gap-3 text-[10px] text-white/40 font-black uppercase tracking-widest">
                                                        <span className="w-4 h-4 border-2 border-aurora border-t-transparent rounded-full animate-spin" />
                                                        Retrieving Assets...
                                                    </div>
                                                ) : tool.state === 'result' ? (
                                                    <div className="space-y-4">
                                                        <div className="text-[10px] font-black text-aurora uppercase tracking-[0.3em] mb-2">Discovery Verified</div>
                                                        {Array.isArray(tool.result) ? (tool.result as { title: string, price: number, link: string }[]).map((deal, i: number) => (
                                                            <Link key={i} href={deal.link} className="block group">
                                                                <div className="flex items-center justify-between p-4 glass-lumina rounded-2xl border border-white/5 group-hover:border-aurora/40 transition-all duration-300">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="p-2 bg-aurora/10 text-aurora rounded-xl">
                                                                            <MapPin className="w-4 h-4" />
                                                                        </div>
                                                                        <p className="text-xs font-bold text-white/90 line-clamp-1">{deal.title}</p>
                                                                    </div>
                                                                    <span className="font-black text-gold text-sm tracking-tighter">${deal.price}</span>
                                                                </div>
                                                            </Link>
                                                        )) : <p className="text-xs text-white/40 italic">{String(tool.result)}</p>}
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl glass-lumina border border-white/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-5 h-5 text-aurora" />
                                    </div>
                                    <div className="glass-lumina border border-white/10 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-2 shadow-3xl">
                                        <span className="w-2 h-2 bg-aurora rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <span className="w-2 h-2 bg-aurora rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <span className="w-2 h-2 bg-aurora rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Lumina Input Area */}
                        <div className="p-8 border-t border-white/5 bg-black/40 relative z-10">
                            <form onSubmit={handleSubmit} className="relative flex items-center group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-aurora/0 via-aurora/10 to-aurora/0 opacity-0 group-focus-within:opacity-100 transition-opacity blur-lg pointer-events-none" />
                                <input
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                    placeholder="Execute Command..."
                                    className="w-full pl-6 pr-14 py-5 glass-lumina border-white/10 focus:border-aurora/40 rounded-[1.5rem] transition-all outline-none text-white text-sm placeholder:text-white/20 font-medium"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !input.trim()}
                                    className="absolute right-3 p-3 bg-aurora text-white rounded-xl hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-aurora-glow active:scale-95"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-10 right-10 w-20 h-20 glass-lumina border border-white/10 text-white rounded-3xl shadow-3xl flex items-center justify-center z-[501] group overflow-hidden"
                aria-label="Toggle Lumina"
            >
                <div className="absolute inset-0 bg-aurora/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                {isOpen ? (
                    <X className="w-8 h-8 text-white relative z-10" />
                ) : (
                    <div className="relative z-10">
                        <MessageCircle className="w-9 h-9 text-aurora group-hover:scale-110 transition-transform" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-aurora rounded-full animate-ping" />
                    </div>
                )}
            </motion.button>
        </>
    );
}
