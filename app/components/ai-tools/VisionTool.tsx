"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, Upload, Sparkles, Target, BarChart, ShieldCheck, MapPin, Zap } from 'lucide-react';
import { visualSearchAction } from '@/app/actions/visual-search';

export function VisionTool() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
            setAnalysis(null);
        }
    };

    const runScan = async () => {
        if (!file) return;
        setIsScanning(true);

        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await visualSearchAction(formData);
            if (res.success) {
                setAnalysis(res.analysis);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="h-full flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white text-right">
                        סריקת <span className="text-red-500">ראייה</span> נוירונית
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mt-1 text-right">חילוץ יעד מבוסס ראייה ממוחשבת v2.0</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 flex-1">
                {/* ── UPLOAD / PREVIEW ── */}
                <div className="flex flex-col gap-6">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border-2 border-dashed rounded-[3rem] relative overflow-hidden transition-all duration-500 cursor-pointer flex items-center justify-center p-4 ${preview ? 'border-red-500/30 bg-black' : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
                            }`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                        {preview ? (
                            <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                                <img src={preview} className="w-full h-full object-contain" alt="Scan target" />
                                <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />

                                {isScanning && (
                                    <motion.div
                                        initial={{ top: '-10%' }}
                                        animate={{ top: '110%' }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.8)] z-20"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 mx-auto w-fit">
                                    <Upload className="w-8 h-8 text-white/20" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-white/40 text-right">גרור נכס טקטי או לחץ להעלאה</p>
                            </div>
                        )}

                        {/* HUD Corners */}
                        <div className="absolute top-6 left-6 w-8 h-8 border-l-2 border-t-2 border-white/10" />
                        <div className="absolute top-6 right-6 w-8 h-8 border-r-2 border-t-2 border-white/10" />
                        <div className="absolute bottom-6 left-6 w-8 h-8 border-l-2 border-b-2 border-white/10" />
                        <div className="absolute bottom-6 right-6 w-8 h-8 border-r-2 border-b-2 border-white/10" />
                    </div>

                    <button
                        onClick={runScan}
                        disabled={!file || isScanning}
                        className="w-full bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest py-6 rounded-[2rem] transition-all shadow-[0_10px_40px_rgba(239,68,68,0.2)] disabled:opacity-50 flex items-center justify-center gap-4"
                    >
                        <Scan className={`w-5 h-5 ${isScanning ? 'animate-pulse' : ''}`} />
                        {isScanning ? 'מנתח דפוסים נוירוניים...' : 'התחל ניתוח חזותי'}
                    </button>
                </div>

                {/* ── ANALYSIS OUTPUT ── */}
                <div className="glass-tactical rounded-[3rem] border border-white/5 overflow-hidden flex flex-col relative">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center justify-end gap-2 mb-1">
                            <span className="text-[8px] font-black text-red-500 uppercase tracking-widest text-right">פלט נוירוני</span>
                            <Sparkles className="w-3 h-3 text-red-500" />
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest text-right">דוח מודיעין</h3>
                    </div>

                    <div className="flex-1 p-10 relative overflow-y-auto custom-scrollbar">
                        {!analysis && !isScanning && (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
                                <BarChart className="w-16 h-16 mb-6" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Data Signal</p>
                            </div>
                        )}

                        {isScanning && (
                            <div className="space-y-8 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="space-y-3">
                                        <div className="h-2 w-24 bg-white/10 rounded-full" />
                                        <div className="h-8 w-full bg-white/5 rounded-2xl" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {analysis && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest flex items-center justify-end gap-2 italic text-right">
                                            אזור מזוהה <MapPin className="w-3 h-3" />
                                        </span>
                                        <div className="text-2xl font-black text-white uppercase italic text-right">{analysis.destination}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[8px] font-black text-white/30 uppercase tracking-widest flex items-center justify-end gap-2 italic text-right">
                                            דיוק אזורי <ShieldCheck className="w-3 h-3" />
                                        </span>
                                        <div className="text-2xl font-black text-red-500 italic text-right">{analysis.country}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest italic flex items-center justify-end gap-2 text-right">
                                        מאפיינים מזוהים <Zap className="w-3 h-3 text-red-500" />
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {analysis.vibes?.map((v: string) => (
                                            <span key={v} className="px-4 py-2 bg-white/[0.04] border border-white/5 rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-tight">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <p className="text-sm font-medium text-white/40 leading-relaxed italic text-right">
                                        "הליבה הנוירונית זיהתה בהצלחה את הוקטורים החזותיים עבור {analysis.destination}. המלצת ארכיטקט: המשך לחיפוש טקטי."
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Bottom HUD line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0" />
                </div>
            </div>
        </div>
    );
}
