import { LoginForm } from '@/app/components/auth/LoginForm';
import { Compass } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'כניסה — DealHunter',
    description: 'התחבר אל חשבון DealHunter לניהול התראות מחיר ומסלולים.',
};

export default function LoginPage() {
    return (
        <main className="min-h-screen flex font-sans overflow-hidden">
            {/* ── LEFT: Decorative Panel ── */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden bg-[#060606]">
                {/* Background Orbs */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/8 blur-[150px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-bronze/6 blur-[120px] rounded-full" />
                    <div className="absolute inset-0 cyber-grid opacity-5" />
                </div>

                {/* Central Brand */}
                <div className="relative z-10 text-center px-12">
                    <div className="text-[10vw] font-black text-white/5 uppercase italic tracking-tighter leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                        DEAL<br />HUNTER
                    </div>
                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <div className="p-5 bg-gradient-to-br from-gold to-bronze rounded-[2rem] shadow-[0_0_60px_rgba(212,175,55,0.3)]">
                            <Compass className="w-10 h-10 text-black" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                                DEAL<span className="text-gold">HUNTER</span>
                            </h2>
                            <p className="text-white/30 text-xs uppercase tracking-[0.4em] font-black">
                                Tactical Division · Elite Intelligence
                            </p>
                        </div>

                        {/* Feature Bullets */}
                        <div className="mt-8 space-y-3 text-right">
                            {[
                                'מנוע AI לאיתור עסקאות בזמן אמת',
                                'התראות מחיר חכמות',
                                'ניתוח מסלולים ויצירת אינטינררי',
                                'מפת ערך גלובלית אינטראקטיבית',
                            ].map((f) => (
                                <div key={f} className="flex items-center gap-3 justify-end">
                                    <span className="text-[11px] text-white/50 font-medium">{f}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT: Login Form ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-16 bg-[#050505] relative">
                {/* Subtle bg gradient */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/4 blur-[150px] rounded-full" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-bronze/4 blur-[120px] rounded-full" />
                </div>

                <div className="relative z-10 w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-10 group">
                        <div className="p-2.5 bg-gradient-to-br from-gold to-bronze rounded-[1rem] shadow-lg group-hover:scale-105 transition-transform">
                            <Compass className="w-5 h-5 text-black" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
                            DEAL<span className="text-gold">HUNTER</span>
                        </span>
                    </Link>

                    {/* Card */}
                    <div className="relative">
                        <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-gold/30 via-transparent to-bronze/20 pointer-events-none" />
                        <div className="relative bg-black/60 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl border border-white/8">
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase italic">ברוך השב</h1>
                                <p className="text-white/30 text-sm">התחבר לחשבונך לגשת לעסקאות והתראות.</p>
                            </div>
                            <LoginForm />
                            <div className="mt-6 pt-6 border-t border-white/5 text-center">
                                <p className="text-white/30 text-xs">
                                    אין לך חשבון?{' '}
                                    <Link href="/register" className="text-gold hover:underline font-bold transition-colors">הצטרף עכשיו</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
