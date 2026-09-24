import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | EnglishFlow',
  description: 'EnglishFlow Privacy Policy and Data Handling',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50/40 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="mt-2 text-xs text-slate-500">Last updated: March 2026</p>

        <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs text-sm text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900">1. Information We Collect</h2>
            <p className="mt-1 text-xs sm:text-sm">
              We collect information provided directly when you register an account, subscribe to our daily English lessons newsletter, or interact with quizzes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">2. How We Use Your Data</h2>
            <p className="mt-1 text-xs sm:text-sm">
              Your email is used exclusively to send your subscribed daily lesson and important platform updates. We never sell or rent your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900">3. Cookies & Local Storage</h2>
            <p className="mt-1 text-xs sm:text-sm">
              We use secure, HTTP-only authentication session cookies to maintain your login status securely.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
