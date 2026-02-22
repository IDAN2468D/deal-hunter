'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react';

export const FloatingConcierge: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: 'שלום! אני סוכן הנסיעות האישי שלך. ראיתי שאתה מחפש יעד מעניין. איך אוכל לעזור?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userText }]);
        setIsLoading(true);

        // Simple hardcoded fallback logic to simulate the AI conversation 
        // without making another complex API route for this specific task
        setTimeout(() => {
            let reply = "מעניין מאוד! אבדוק אילו עסקאות זמינות שיתאימו לזה.";
            if (userText.includes("לונדון") || userText.includes("paris") || userText.includes("אירופה")) {
                reply = "אירופה קלאסית! יש לנו עכשיו ירידת מחירים מטורפת לבירות אירופה לסוף השבוע. כדאי להסתכל על רשת המלונות שאנחנו ממליצים עליהם בפורטל.";
            } else if (userText.includes("חם") || userText.includes("שמש") || userText.includes("בטן גב")) {
                reply = "מחפש לברוח לשמש? מצאתי שהמלדיביים וזנזיבר מציגים 'ערך עמוק' כרגע עם 40% הנחה על ריזורטים. רוצה שארכיב לך מסלול?";
            } else if (userText.includes("תקציב") || userText.includes("זול")) {
                reply = "אתה מדבר עם המומחה! המערכת שלנו סורקת שגיאות מחיר. אם תגדיר 'התראה חכמה' (Smart Alert) לעיר מסוימת - תקבל הודעה ברגע שיש קריסת מחיר.";
            }

            setMessages(prev => [...prev, { role: 'ai', content: reply }]);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] shadow-2xl w-[350px] mb-4 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-[#d4af37]/10 border-b border-[#d4af37]/20 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#d4af37] rounded-xl">
                                    <Sparkles className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">קונסיירז' Elite</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] text-white/50 uppercase tracking-widest">מחובר</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Window */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                                ? 'bg-[#d4af37] text-black font-medium border border-[#d4af37]/20 rounded-br-sm'
                                                : 'bg-white/5 text-white/90 border border-white/10 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm p-3 text-sm flex items-center gap-2">
                                        <Loader2 className="w-3.5 h-3.5 text-[#d4af37] animate-spin" />
                                        <span className="text-white/40 text-xs">מקליד...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-[#0a0a0a]">
                            <form onSubmit={handleSend} className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="שאל אותי משהו..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute left-1.5 p-2 bg-[#d4af37] text-black rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f3e5ab] transition-colors"
                                >
                                    <Send className="w-4 h-4 ml-[-2px] mb-[-2px]" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-colors border ${isOpen
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-[#d4af37] text-black border-[#d4af37]'
                    }`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
};
