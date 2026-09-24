'use client';

import React, { useState } from 'react';
import { Sparkles, Zap, SlidersHorizontal, Volume2, Filter } from 'lucide-react';
import { TONGUE_TWISTERS, TongueTwister } from '@/lib/data/tongue-twisters';
import { TongueTwisterCard } from '@/components/learning/TongueTwisterCard';

export function TongueTwisterStudio() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filtered = TONGUE_TWISTERS.filter((t) => {
    if (filterDifficulty !== 'all' && t.difficulty.toLowerCase() !== filterDifficulty.toLowerCase()) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.text.toLowerCase().includes(q) ||
        t.focus.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <section className="rounded-3xl border border-sky-100 bg-linear-to-b from-sky-50/50 via-white to-slate-50/30 p-6 sm:p-10 shadow-sm my-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-sky-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-800 uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5" />
            <span>Interactive Fluency Studio</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tongue Twister Articulation Drills
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Train your mouth muscles, speech rhythm, and motor control. Listen at{' '}
            <strong className="text-emerald-700">Slow (0.7x)</strong> to master tongue placement,{' '}
            <strong className="text-sky-700">Normal (1.0x)</strong> for conversational pace, and{' '}
            <strong className="text-indigo-700">Speed (1.3x)</strong> for native reflex training!
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          {['all', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setFilterDifficulty(diff)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition active:scale-95 ${
                filterDifficulty === diff
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {diff === 'all' ? 'All Difficulties' : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tongue Twisters */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <TongueTwisterCard
            key={item.id}
            title={item.title}
            text={item.text}
            focus={item.focus}
            difficulty={item.difficulty}
          />
        ))}
      </div>
    </section>
  );
}
