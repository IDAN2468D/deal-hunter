import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/app/components/auth/AuthProvider';
import { PageTransition } from '@/app/components/ui/PageTransition';
import { FloatingConcierge } from '@/app/components/ai/FloatingConcierge';
import { LiveActivityFeed } from '@/app/components/ui/LiveActivityFeed';

import { TacticalNav } from '@/app/components/ui/TacticalNav';
import { TacticalFooter } from '@/app/components/ui/TacticalFooter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealHunter | מצא טיסות ומלונות במחירים נמוכים",
  description: "גלה עסקאות חופשה בלעדיות, טיסות ומלונות ברחבי העולם. הזמן את ההרפתקה הבאה שלך עם DealHunter.",
  openGraph: {
    title: "DealHunter | מצא טיסות ומלונות במחירים נמוכים",
    description: "גלה עסקאות חופשה בלעדיות, טיסות ומלונות ברחבי העולם. הזמן את ההרפתקה הבאה שלך עם DealHunter.",
    type: "website",
    locale: "he_IL",
    siteName: "DealHunter",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#d4af37]/30 selection:text-white bg-[#050505]`}
      >
        <AuthProvider>
          {/* Global Background Systems */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#050505]">
            <div className="absolute top-[-20%] right-[-10%] w-[1200px] h-[1200px] bg-gold/5 blur-[180px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-bronze/5 blur-[150px] rounded-full" />

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            <div className="absolute inset-0 cyber-grid opacity-[0.07]" />
            <div className="absolute inset-0 scanline opacity-[0.1] pointer-events-none" />
          </div>

          <TacticalNav />

          <main className="relative z-10 pt-24 min-h-screen">
            <PageTransition>
              {children}
            </PageTransition>
          </main>

          <TacticalFooter />

          <FloatingConcierge />
          <LiveActivityFeed />
        </AuthProvider>
      </body>
    </html>
  );
}
