'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, Sparkles } from 'lucide-react';

interface InlineQuizBlockProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export function InlineQuizBlock({
  question,
  options,
  correctAnswer,
  explanation,
}: InlineQuizBlockProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const hasAnswered = selected !== null;
  const isCorrect = selected === correctAnswer;

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-700 uppercase">
        <HelpCircle className="h-4 w-4" />
        <span>Quick Knowledge Check</span>
      </div>

      <p className="mt-3 text-base font-bold text-slate-900 leading-snug">
        {question}
      </p>

      <div className="mt-4 space-y-2.5">
        {options.map((option, index) => {
          const isThisSelected = selected === index;
          const isThisCorrect = index === correctAnswer;

          let btnClass = 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800';

          if (hasAnswered) {
            if (isThisCorrect) {
              btnClass = 'border-emerald-300 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-400';
            } else if (isThisSelected) {
              btnClass = 'border-rose-300 bg-rose-50 text-rose-900 line-through';
            } else {
              btnClass = 'border-slate-100 bg-slate-50/50 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={index}
              type="button"
              disabled={hasAnswered}
              onClick={() => setSelected(index)}
              className={`w-full flex items-center justify-between rounded-xl border p-3.5 text-left text-sm transition-all ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
              </div>
              {hasAnswered && (
                <div>
                  {isThisCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />}
                  {isThisSelected && !isThisCorrect && <XCircle className="h-4 w-4 text-rose-500 shrink-0" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {hasAnswered && (
        <div
          className={`mt-4 rounded-xl border p-4 text-xs transition-all ${
            isCorrect
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-900'
              : 'border-amber-200 bg-amber-50/70 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            <strong>Explanation: </strong> {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
