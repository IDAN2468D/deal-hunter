'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { registerUser } from '@/app/actions/register';

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
        { label: 'חלש מדי', color: 'bg-red-500' },
        { label: 'חלש', color: 'bg-orange-500' },
        { label: 'בינוני', color: 'bg-yellow-500' },
        { label: 'חזק', color: 'bg-green-500' },
        { label: 'חזק מאוד', color: 'bg-emerald-400' },
    ];
    return { score, ...levels[score] ?? levels[0] };
}

export const RegisterForm: React.FC = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

    const strength = getPasswordStrength(password);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await registerUser(formData);
            if (result.success) {
                setFeedback({ type: 'success', message: result.message });
                setTimeout(() => router.push('/login'), 1500);
            } else {
                setFeedback({ type: 'error', message: result.error });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Name */}
            <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    id="register-name"
                    name="name"
                    type="text"
                    required
                    placeholder="שם מלא"
                    autoComplete="name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                />
            </div>

            {/* Email */}
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    id="register-email"
                    name="email"
                    type="email"
                    required
                    placeholder="כתובת אימייל"
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                />
            </div>

            {/* Password */}
            <div className="space-y-2">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        id="register-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="סיסמא"
                        autoComplete="new-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
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

                {/* Strength meter */}
                {password.length > 0 && (
                    <div className="space-y-1">
                        <div className="flex gap-1">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength.score ? strength.color : 'bg-white/10'}`} />
                            ))}
                        </div>
                        <p className="text-[10px] text-white/30">{strength.label}</p>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="אמת סיסמא"
                    autoComplete="new-password"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-4 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/5 transition-all"
                />
            </div>

            {/* Submit */}
            <button
                id="register-submit"
                type="submit"
                disabled={isPending}
                className="w-full bg-[#d4af37] hover:bg-[#f3e5ab] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black text-[11px] uppercase tracking-[0.2em] py-4 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-95 mt-2"
            >
                {isPending ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                    <UserPlus className="w-4 h-4" />
                )}
                {isPending ? 'יוצר חשבון...' : 'צור חשבון'}
            </button>

            <p className="text-center text-white/30 text-sm">
                כבר יש לך חשבון?{' '}
                <Link href="/login" className="text-[#d4af37] hover:text-[#f3e5ab] font-black transition-colors">
                    כניסה ←
                </Link>
            </p>
        </form>
    );
};
