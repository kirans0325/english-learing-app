import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | EnglishFlow',
  description: 'EnglishFlow Terms of Service and Usage Guidelines',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50/40 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-1 text-xs sm:text-sm">
              By accessing and using EnglishFlow, you agree to comply with and be bound by these terms. All lesson content, quiz formats, and curriculum materials are for personal educational use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">2. Intellectual Property</h2>
            <p className="mt-1 text-xs sm:text-sm">
              All lesson materials, interactive components, design layouts, and trademarks are the property of EnglishFlow.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
