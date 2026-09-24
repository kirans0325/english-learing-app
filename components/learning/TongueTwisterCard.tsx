'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Zap, Gauge, SlidersHorizontal, Check, Copy, Bot } from 'lucide-react';
import { speakWithPhilosopherVoice, stopSpeech } from '@/lib/utils/speech';

interface TongueTwisterCardProps {
  title?: string;
  text: string;
  focus?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export function TongueTwisterCard({
  title = 'Tongue Twister Challenge',
  text,
  focus,
  difficulty = 'Medium',
}: TongueTwisterCardProps) {
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const speakAtSpeed = async (rate: number) => {
    setPlayingSpeed(rate);
    await speakWithPhilosopherVoice(text, {
      rate,
      pitch: 0.89, // Signature Philosopher Android baritone
      onEnd: () => setPlayingSpeed(null),
      onError: () => setPlayingSpeed(null),
    });
  };

  const copyText = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const diffColor =
    difficulty === 'Easy'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : difficulty === 'Hard'
      ? 'bg-rose-50 text-rose-700 border-rose-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-sky-200/80 bg-linear-to-br from-white via-sky-50/20 to-white p-5 shadow-sm transition hover:shadow-md">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sky-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">{title}</h4>
            {focus && (
              <span className="text-xs font-medium text-sky-700">Focus: {focus}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${diffColor}`}>
            {difficulty}
          </span>
          <button
            type="button"
            onClick={copyText}
            title="Copy tongue twister"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Main Tongue Twister Text */}
      <div className="my-4 rounded-xl bg-sky-50/60 p-4 border border-sky-100/70">
        <p className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed italic">
          &ldquo;{text}&rdquo;
        </p>
      </div>

      {/* Pronouncing Speed Controls: Slow, Normal, Speed */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <SlidersHorizontal className="h-3.5 w-3.5 text-sky-600" />
            <span>Pronounce:</span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-100/80 px-2 py-0.5 text-[10px] font-semibold text-sky-800 border border-sky-200/60">
            <Bot className="h-3 w-3 text-sky-600" />
            <span>The Philosopher AI Voice</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Slow Button (0.7x) */}
          <button
            type="button"
            onClick={() => speakAtSpeed(0.7)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              playingSpeed === 0.7
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>🐢</span>
            <span>Slow (0.7x)</span>
          </button>

          {/* Normal Button (1.0x) */}
          <button
            type="button"
            onClick={() => speakAtSpeed(1.0)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              playingSpeed === 1.0
                ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>🚶</span>
            <span>Normal (1.0x)</span>
          </button>

          {/* Speed / Fast Button (1.3x) */}
          <button
            type="button"
            onClick={() => speakAtSpeed(1.3)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
              playingSpeed === 1.3
                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                : 'border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:border-indigo-300'
            }`}
          >
            <Gauge className="h-3.5 w-3.5" />
            <span>Speed (1.3x)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
