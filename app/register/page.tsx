import { RegisterForm } from '@/app/components/auth/RegisterForm';
import { Coffee } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'יצירת חשבון — DealHunter',
    description: 'הצטרף ל-DealHunter למעקב עסקאות, הגדרת התראות מחיר וקבלת מסלולים מונחי AI.',
};

export default function RegisterPage() {
    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center px-4 py-12 font-sans">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#4a3728]/15 via-transparent to-[#d4af37]/5" />
                <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-[#d4af37]/8 blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-[#4a3728]/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-3 mb-10">
                    <div className="p-2.5 bg-[#d4af37] rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <Coffee className="w-5 h-5 text-black" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter text-white">
                        DEAL<span className="text-[#d4af37]">HUNTER</span>
                    </span>
                </Link>

                {/* Card */}
                <div className="bg-white/3 backdrop-blur-2xl border border-white/8 rounded-[2rem] p-8 shadow-2xl shadow-black/50">
                    <div className="mb-8">
                        <h1 className="text-3xl font-black text-white tracking-tighter mb-1">הצטרף ל-DealHunter</h1>
                        <p className="text-white/30 text-sm">צור חשבון לפתיחת התראות מחיר ומסלולי AI.</p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </main>
    );
}
