'use client';

import React, { useState } from 'react';
import { Volume2, Calendar, BookmarkCheck, ArrowRight, Bot } from 'lucide-react';
import Link from 'next/link';
import { DailyWord } from '@/models/types';
import { speakWithPhilosopherVoice } from '@/lib/utils/speech';

interface DailyWordCardProps {
  data: DailyWord;
}

export function DailyWordCard({ data }: DailyWordCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [saved, setSaved] = useState(false);

  const speak = async () => {
    setIsPlaying(true);
    await speakWithPhilosopherVoice(data.word, {
      rate: 0.88,
      pitch: 0.89,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-50/40 via-white to-teal-50/20 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-full bg-emerald-100/70 px-3 py-1 text-xs font-semibold text-emerald-800">
          <Calendar className="h-3.5 w-3.5" />
          <span>Today&apos;s English</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {data.difficulty} Level
          </span>
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className={`rounded-full p-1.5 transition-colors ${
              saved
                ? 'bg-emerald-500 text-white'
                : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
            }`}
            title={saved ? 'Word saved' : 'Save word'}
            aria-label="Save word"
          >
            <BookmarkCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {data.word}
        </h3>
        <span className="text-sm font-medium text-emerald-700 italic">
          {data.partOfSpeech}
        </span>
        <span className="text-sm font-mono text-slate-500">{data.phonetic}</span>

        <button
          type="button"
          onClick={speak}
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-2xs transition-transform active:scale-95 hover:bg-emerald-50 ${
            isPlaying ? 'ring-2 ring-emerald-400' : ''
          }`}
          aria-label="Listen to pronunciation"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>{isPlaying ? 'Playing...' : 'Pronounce'}</span>
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Meaning
          </span>
          <p className="mt-0.5 text-base font-medium text-slate-800">
            {data.meaning}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase">
            Example
          </span>
          <p className="mt-1 text-sm font-normal text-slate-800 italic">
            &ldquo;{data.example}&rdquo;
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="text-xs text-slate-500">
          Practice this word in today&apos;s conversation!
        </span>
        <Link
          href="/practice"
          className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
        >
          <span>Take daily practice quiz</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
