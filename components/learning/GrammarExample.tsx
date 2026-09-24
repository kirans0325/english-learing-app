'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, Volume2 } from 'lucide-react';
import { speakWithPhilosopherVoice } from '@/lib/utils/speech';

interface GrammarExampleProps {
  incorrect: string;
  correct: string;
  explanation: string;
  title?: string;
}

export function GrammarExample({
  incorrect,
  correct,
  explanation,
  title = 'Grammar Comparison',
}: GrammarExampleProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakCorrect = async () => {
    setIsPlaying(true);
    await speakWithPhilosopherVoice(correct, {
      rate: 0.92,
      pitch: 0.89,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all hover:shadow-md">
      {title && (
        <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-2.5 text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </div>
      )}
      <div className="grid grid-cols-1 divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {/* Incorrect */}
        <div className="bg-rose-50/30 p-4 sm:p-5">
          <div className="flex items-center gap-2 font-medium text-rose-700 text-xs tracking-wide uppercase">
            <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Incorrect</span>
          </div>
          <p className="mt-2 text-base font-medium text-rose-950 line-through decoration-rose-300">
            &ldquo;{incorrect}&rdquo;
          </p>
        </div>

        {/* Correct */}
        <div className="bg-emerald-50/30 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-emerald-700 text-xs tracking-wide uppercase">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Correct</span>
            </div>
            <button
              type="button"
              onClick={speakCorrect}
              title="Listen to correct pronunciation with The Philosopher AI Voice"
              className={`inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-emerald-700 shadow-2xs hover:bg-emerald-50 active:scale-95 transition ${
                isPlaying ? 'ring-2 ring-emerald-400 bg-emerald-50' : ''
              }`}
            >
              <Volume2 className="h-3 w-3" />
              <span>{isPlaying ? 'Speaking...' : 'Listen'}</span>
            </button>
          </div>
          <p className="mt-2 text-base font-semibold text-emerald-950">
            &ldquo;{correct}&rdquo;
          </p>
        </div>
      </div>

      {/* Explanation */}
      <div className="flex items-start gap-3 bg-slate-50/90 p-4 sm:p-5 text-sm text-slate-700">
        <Lightbulb className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-900">Explanation: </span>
          <span>{explanation}</span>
        </div>
      </div>
    </div>
  );
}
