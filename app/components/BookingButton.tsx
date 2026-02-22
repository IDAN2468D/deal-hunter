'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrderAction } from '@/app/actions/checkout';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingButtonProps {
    dealId: string;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ dealId }) => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleBooking = async () => {
        setLoading(true);
        setStatus('idle');

        try {
            const result = await createOrderAction(dealId);

            if (result.success) {
                setStatus('success');
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    router.push('/dashboard/orders');
                }, 1500);
            } else {
                setStatus('error');
                setMessage(result.error || 'משהו השתבש');
            }
        } catch (error) {
            setStatus('error');
            setMessage('הזמנה נכשלה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full space-y-3">
            <button
                onClick={handleBooking}
                disabled={loading || status === 'success'}
                className={`w-full font-black text-[11px] uppercase tracking-[0.2em] py-5 rounded-2xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 ${status === 'success'
                    ? 'bg-emerald-500 text-white cursor-default shadow-emerald-500/20'
                    : 'bg-[#d4af37] hover:bg-[#f3e5ab] text-black shadow-[#d4af37]/20 disabled:opacity-50 disabled:grayscale'
                    }`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4" />
                ) : null}

                {status === 'success' ? 'הוזמן בהצלחה!' : loading ? 'מעבד...' : 'הזמן את ההרפתקה'}
            </button>

            <AnimatePresence>
                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-400 text-[10px] font-bold uppercase tracking-wider text-center"
                    >
                        {message}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
};
