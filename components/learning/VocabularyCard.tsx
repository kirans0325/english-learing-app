'use client';

import React, { useState } from 'react';
import { Volume2, Sparkles, Check, Bot } from 'lucide-react';
import { speakWithPhilosopherVoice } from '@/lib/utils/speech';

interface VocabularyCardProps {
  word: string;
  phonetic?: string;
  partOfSpeech?: string;
  meaning: string;
  example: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function VocabularyCard({
  word,
  phonetic,
  partOfSpeech,
  meaning,
  example,
  difficulty,
}: VocabularyCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const speak = async () => {
    setIsPlaying(true);
    await speakWithPhilosopherVoice(word, {
      rate: 0.9,
      pitch: 0.89,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const copyWord = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(`${word} - ${meaning}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 rounded-2xl border border-indigo-100 bg-linear-to-br from-white via-indigo-50/20 to-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-50 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-bold tracking-tight text-slate-900">{word}</h4>
              {partOfSpeech && (
                <span className="text-xs font-medium text-slate-500 italic">
                  ({partOfSpeech})
                </span>
              )}
            </div>
            {phonetic && (
              <span className="text-xs font-mono text-indigo-600/90">{phonetic}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {difficulty && (
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {difficulty}
            </span>
          )}
          <button
            type="button"
            onClick={speak}
            title="Listen to pronunciation"
            aria-label="Listen to pronunciation"
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200 text-indigo-600 transition-colors hover:bg-indigo-50 active:scale-95 ${
              isPlaying ? 'bg-indigo-100 text-indigo-700 animate-pulse' : ''
            }`}
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Meaning
          </span>
          <p className="mt-0.5 text-sm font-medium text-slate-800 leading-relaxed">
            {meaning}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
          <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
            Example Sentence
          </span>
          <p className="mt-1 text-sm text-slate-700 italic">
            &ldquo;{example}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
