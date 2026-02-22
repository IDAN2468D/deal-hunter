'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle } from 'lucide-react';
import { MagneticWrapper } from '../ui/MagneticWrapper';

export const LoginForm: React.FC = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        startTransition(async () => {
            // Use next-auth/react signIn directly from the client — avoids the
            // NEXT_REDIRECT issue that occurs when calling server-side signIn.
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (!result) {
                setFeedback({ type: 'error', message: 'משהו השתבש לא נכון. אנא נסה שוב.' });
                return;
            }

            if (result.error) {
                setFeedback({ type: 'error', message: 'אימייל או סיסמא לא נכונים.' });
            } else {
                setFeedback({ type: 'success', message: 'ברוך הבא! מעביר אותך...' });
                router.push('/');
                router.refresh();
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Feedback */}
            {feedback && (
                <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium ${feedback.type === 'error'
                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                    : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                    {feedback.type === 'error'
                        ? <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        : <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    }
                    {feedback.message}
                </div>
            )}

            {/* Email */}
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    placeholder="כתובת אימייל"
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                />
            </div>

            {/* Password */}
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="סיסמא"
                    autoComplete="current-password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-12 py-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {/* Submit */}
            <MagneticWrapper strength={15} className="w-full mt-2">
                <button
                    id="login-submit"
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-[#d4af37] hover:bg-[#f3e5ab] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-[11px] uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    {isPending ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                        <LogIn className="w-4 h-4" />
                    )}
                    {isPending ? 'מתחבר...' : 'כניסה'}
                </button>
            </MagneticWrapper>

            <p className="text-center text-white/30 text-sm">
                אין חשבון?{' '}
                <Link href="/register" className="text-[#d4af37] hover:text-[#f3e5ab] font-black transition-colors">
                    צור אחד עכשיו ←
                </Link>
            </p>
        </form>
    );
};
