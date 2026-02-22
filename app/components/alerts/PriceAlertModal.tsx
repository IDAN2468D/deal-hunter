'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BellRing, CheckCircle, AlertCircle, Loader2, Sparkles, TrendingDown, Info, TrendingUp } from 'lucide-react';
import { createPriceAlert, analyzePriceTrend, predictPriceEvolution } from '@/app/actions/price-alerts';
import { PriceAlertFormSchema } from '@/lib/validations';

const MOCK_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';

interface PriceAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAlertSet: () => void;
    destinationId: string;
    destinationName: string;
    currentPrice: number;
}

type ModalStatus = 'idle' | 'loading' | 'success' | 'error';

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
    isOpen,
    onClose,
    onAlertSet,
    destinationId,
    destinationName,
    currentPrice,
}) => {
    const [targetPrice, setTargetPrice] = useState('');
    const [status, setStatus] = useState<ModalStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationError, setValidationError] = useState('');
    const [priceAnalysis, setPriceAnalysis] = useState<{ recommendation: string; target: number; confidence: string } | null>(null);
    const [pricePrediction, setPricePrediction] = useState<{ points: { day: string; price: number }[]; summary: string; risk: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // AI Price Analysis & Prediction Effect
    React.useEffect(() => {
        if (isOpen && !priceAnalysis && !isAnalyzing) {
            setIsAnalyzing(true);
            Promise.all([
                analyzePriceTrend(destinationName, currentPrice),
                predictPriceEvolution(destinationName, currentPrice)
            ]).then(([analysis, prediction]) => {
                setPriceAnalysis(analysis);
                if (prediction.success) {
                    setPricePrediction(prediction.data);
                }
                setIsAnalyzing(false);
            });
        }
    }, [isOpen, destinationName, currentPrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');
        setErrorMessage('');

        // Client-side Sentinel validation
        const parsed = PriceAlertFormSchema.safeParse({ targetPrice });
        if (!parsed.success) {
            // Use flatten() which always returns string[] — works across Zod versions
            const flatErrors = parsed.error.flatten();
            const firstMsg =
                flatErrors.formErrors[0] ??
                Object.values(flatErrors.fieldErrors).flat()[0] ??
                'Invalid input';
            setValidationError(firstMsg);
            return;
        }

        const price = Math.floor(Number(targetPrice));
        if (price >= currentPrice) {
            setValidationError(`Target price must be below the current price ($${currentPrice})`);
            return;
        }

        setStatus('loading');

        const result = await createPriceAlert({
            userId: MOCK_USER_ID,
            destinationId,
            targetPrice: price,
        });

        if (result.success) {
            setStatus('success');
            onAlertSet();
            setTimeout(() => {
                onClose();
                setStatus('idle');
                setTargetPrice('');
                setPriceAnalysis(null); // Reset AI analysis on close
                setPricePrediction(null); // Reset AI prediction on close
            }, 1800);
        } else {
            setStatus('error');
            setErrorMessage(result.error ?? 'Failed to set alert. Please try again.');
        }
    };

    const handleClose = () => {
        if (status === 'loading') return;
        onClose();
        setStatus('idle');
        setTargetPrice('');
        setValidationError('');
        setErrorMessage('');
        setPriceAnalysis(null); // Reset AI analysis on close
        setPricePrediction(null); // Reset AI prediction on close
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-neutral-900/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 p-8 shadow-2xl shadow-black/80">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/20">
                                        <BellRing className="w-5 h-5 text-[#d4af37]" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-black text-white uppercase tracking-tight">
                                            Price Alert
                                        </h2>
                                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                            {destinationName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* AI Price Analysis & Prediction */}
                            <div className="mb-6 space-y-4">
                                <AnimatePresence mode="wait">
                                    {isAnalyzing ? (
                                        <motion.div
                                            key="analyzing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="bg-white/5 rounded-2xl p-4 border border-white/5 flex items-center gap-3"
                                        >
                                            <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Market Pulse...</span>
                                        </motion.div>
                                    ) : (
                                        <>
                                            {priceAnalysis && (
                                                <motion.div
                                                    key="analysis"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl p-4 border border-[#d4af37]/20"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37]">AI Recommendation</span>
                                                    </div>
                                                    <p className="text-white text-xs font-medium leading-relaxed mb-3">
                                                        {priceAnalysis.recommendation}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                                        <div className="flex flex-col">
                                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Target Price</span>
                                                            <span className="text-sm font-black text-white">${priceAnalysis.target.toLocaleString()}</span>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Confidence</span>
                                                            <span className="text-[10px] font-black text-[#d4af37] uppercase">{priceAnalysis.confidence}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {pricePrediction && (
                                                <motion.div
                                                    key="prediction"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white/5 rounded-2xl p-4 border border-white/5"
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp className="w-3.5 h-3.5 text-white/40" />
                                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/40">7-Day Projection</span>
                                                        </div>
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${pricePrediction.risk === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                            {pricePrediction.risk} RISK
                                                        </span>
                                                    </div>

                                                    {/* Mini SVG Chart */}
                                                    <div className="h-20 w-full flex items-end justify-between gap-1 mb-3">
                                                        {pricePrediction.points.map((p: { day: string; price: number }, i: number) => {
                                                            const min = Math.min(...pricePrediction.points.map((pt: { price: number }) => pt.price));
                                                            const max = Math.max(...pricePrediction.points.map((pt: { price: number }) => pt.price));
                                                            const range = max - min || 1;
                                                            const height = ((p.price - min) / range) * 100;
                                                            return (
                                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                                    <motion.div
                                                                        initial={{ height: 0 }}
                                                                        animate={{ height: `${Math.max(20, height)}%` }}
                                                                        transition={{ delay: i * 0.05 }}
                                                                        className="w-full bg-[#d4af37]/20 rounded-t-sm border-t border-[#d4af37]/30"
                                                                    />
                                                                    <span className="text-[6px] font-bold text-white/20">{p.day}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-[10px] text-white/60 font-medium italic">
                                                        &ldquo;{pricePrediction.summary}&rdquo;
                                                    </p>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Current Price Display */}
                            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">
                                        Current Price
                                    </p>
                                    <p className="text-3xl font-black text-white">
                                        <span className="text-lg opacity-40">$</span>
                                        {currentPrice.toLocaleString()}
                                    </p>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <TrendingDown className="w-5 h-5 text-white/20" />
                                </div>
                            </div>

                            {/* Success State */}
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center py-6 gap-3"
                                    >
                                        <div className="p-4 bg-green-500/10 rounded-full border border-green-500/20">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <p className="text-white font-black text-lg uppercase tracking-tight">
                                            Alert Set!
                                        </p>
                                        <p className="text-white/40 text-xs text-center">
                                            We&apos;ll notify you when {destinationName} drops
                                            below ${Number(targetPrice).toLocaleString()}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">
                                                Alert me when price drops below
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-white/30">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={targetPrice}
                                                    onChange={(e) => {
                                                        setTargetPrice(e.target.value);
                                                        setValidationError('');
                                                    }}
                                                    placeholder={String(
                                                        Math.floor(currentPrice * 0.85)
                                                    )}
                                                    className="w-full bg-white/5 border border-white/10 focus:border-[#d4af37]/50 rounded-2xl pl-10 pr-4 py-4 text-2xl font-black text-white outline-none transition-all placeholder:text-white/20"
                                                    disabled={status === 'loading'}
                                                    min={1}
                                                    max={50000}
                                                />
                                            </div>
                                            {validationError && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-2 text-[10px] text-red-400 font-black flex items-center gap-1.5"
                                                >
                                                    <AlertCircle className="w-3 h-3" />
                                                    {validationError}
                                                </motion.p>
                                            )}
                                            {errorMessage && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -4 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-2 text-[10px] text-red-400 font-black flex items-center gap-1.5"
                                                >
                                                    <AlertCircle className="w-3 h-3" />
                                                    {errorMessage}
                                                </motion.p>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading' || !targetPrice}
                                            className="w-full bg-[#d4af37] hover:bg-[#f3e5ab] disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-[11px] uppercase tracking-[0.2em] px-6 py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Setting Alert...
                                                </>
                                            ) : (
                                                <>
                                                    <BellRing className="w-4 h-4" />
                                                    Set Price Alert
                                                </>
                                            )}
                                        </button>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
