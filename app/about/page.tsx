import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About EnglishFlow',
  description: 'Our mission is to help learners worldwide communicate in clear, natural English without fear or confusion.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50/40 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white mb-4">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            About EnglishFlow
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Making practical English simple, structured, and immediately usable for global learners and professionals.
          </p>
        </div>

        <div className="mt-12 space-y-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xs text-sm leading-relaxed text-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Why EnglishFlow?</h2>
            <p className="mt-2">
              Most traditional language resources force learners to memorize obscure rules or endless grammar tables out of context. EnglishFlow was designed around one guiding principle: <strong>direct clarity</strong>. Every lesson highlights the contrast between what sounds unnatural vs what sounds fluent, backed by concise formulas and memory hooks.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-xl font-bold text-slate-900">Our Core Pillars</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="font-bold text-slate-900 block">Practical Grammar</span>
                <p className="mt-1 text-xs text-slate-600">
                  Focused on real mistakes and daily usage, avoiding archaic rules.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="font-bold text-slate-900 block">Lexical Precision</span>
                <p className="mt-1 text-xs text-slate-600">
                  High-frequency collocations, business phrases, and pronunciation audio.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-slate-900 block">Ready to start?</span>
              <span className="text-xs text-slate-500">Explore our free lessons today.</span>
            </div>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
