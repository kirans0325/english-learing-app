'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

interface NewsletterCTAProps {
  variant?: 'card' | 'inline' | 'banner';
}

export function NewsletterCTA({ variant = 'card' }: NewsletterCTAProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ text: data.message, type: 'success' });
        setEmail('');
      } else {
        setMessage({ text: data.message || 'Something went wrong.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Unable to subscribe right now. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'banner') {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-r from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-white shadow-md">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xs">
            <Mail className="h-6 w-6 text-emerald-200" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Get one useful English lesson every day.
          </h2>
          <p className="mt-2 text-sm text-emerald-100 sm:text-base">
            Join 35,000+ motivated learners. No spam, only practical vocabulary, grammar rules, and quick conversational tips.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder-emerald-200/80 backdrop-blur-xs focus:bg-white/20 focus:outline-hidden focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-95 disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Subscribe Free</span>}
            </button>
          </form>

          {message && (
            <p
              className={`mt-4 text-xs font-semibold ${
                message.type === 'success' ? 'text-emerald-200' : 'text-rose-200'
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <div className="my-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-base font-bold text-slate-900">
            Get one useful English lesson every day.
          </h4>
          <p className="text-xs text-slate-600">
            Direct to your inbox. Bite-sized grammar and vocabulary tips.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
        <input
          type="email"
          required
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <span>Subscribe</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      {message && (
        <div className="mt-3 flex items-center gap-2 text-xs font-medium">
          {message.type === 'success' && <CheckCircle className="h-4 w-4 text-emerald-600" />}
          <span className={message.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}>
            {message.text}
          </span>
        </div>
      )}
    </div>
  );
}
