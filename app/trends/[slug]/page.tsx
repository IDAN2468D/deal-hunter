import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface Props {
    params: { slug: string };
}

interface SeoPage {
    id: string;
    slug: string;
    title: string;
    metaDesc: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const page = await (prisma as any).seoPage.findUnique({
        where: { slug: params.slug }
    }) as SeoPage | null;

    if (!page) {
        return { title: 'Not Found' };
    }

    return {
        title: `${page.title} | DealHunter`,
        description: page.metaDesc,
    };
}

export default async function TrendPage(props: Props) {
    const params = await props.params;
    const page = await (prisma as any).seoPage.findUnique({
        where: { slug: params.slug, status: "published" }
    }) as SeoPage | null;

    if (!page) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050505] text-neutral-200">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#d4af37]/10 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto px-6 py-24 relative z-10">
                <Link href="/" className="inline-flex items-center gap-2 text-[#d4af37] mb-12 hover:text-white transition-colors text-sm font-black uppercase tracking-widest">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </Link>

                <div className="mb-6 flex items-center gap-3">
                    <span className="bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#d4af37] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> AI Generated Trend
                    </span>
                    <span className="text-neutral-500 text-xs font-mono">{new Date(page.createdAt).toLocaleDateString()}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-16 leading-[0.9]">
                    {page.title}
                </h1>

                <article
                    className="prose prose-invert prose-lg max-w-none prose-headings:text-[#d4af37] prose-headings:font-serif prose-a:text-cyan-400 prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />

                <div className="mt-24 pt-12 border-t border-white/10 text-center">
                    <h3 className="text-2xl font-serif text-white mb-6">Ready to hunt for this trend?</h3>
                    <Link href="/" className="inline-block bg-[#d4af37] text-black px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-colors">
                        Start Search
                    </Link>
                </div>
            </div>
        </main>
    );
}
