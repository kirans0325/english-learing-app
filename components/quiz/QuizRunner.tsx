'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RotateCcw, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Quiz } from '@/models/types';

interface QuizRunnerProps {
  quiz: Quiz;
}

export function QuizRunner({ quiz }: QuizRunnerProps) {
  const questions = quiz.questions || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No questions currently available for this quiz.
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = selectedAnswers[currentIndex] !== undefined;
  const currentSelection = selectedAnswers[currentIndex];
  const isCurrentCorrect = currentSelection === currentQ.correctAnswer;

  const handleSelect = (optionIndex: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qIdx, ans]) => {
    const q = questions[Number(qIdx)];
    return ans === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white p-8 sm:p-10 shadow-sm text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600">
          <Trophy className="h-10 w-10" />
        </div>

        <h3 className="mt-5 text-2xl font-bold text-slate-900">Quiz Completed!</h3>
        <p className="mt-1 text-slate-600 text-sm">
          You scored <span className="font-bold text-emerald-700">{score}</span> out of{' '}
          <span className="font-bold text-slate-900">{questions.length}</span> ({percentage}%)
        </p>

        <div className="my-6 mx-auto max-w-xs rounded-2xl bg-slate-50 p-4 border border-slate-100">
          {percentage >= 80 ? (
            <p className="text-sm font-semibold text-emerald-700">
              Outstanding work! You have mastered these concepts.
            </p>
          ) : percentage >= 50 ? (
            <p className="text-sm font-semibold text-amber-700">
              Good effort! Review the explanations below and try again for 100%.
            </p>
          ) : (
            <p className="text-sm font-semibold text-rose-700">
              Keep practicing! Reviewing the lessons will help cement the rules.
            </p>
          )}
        </div>

        {/* Detailed Question Review */}
        <div className="mt-8 space-y-6 text-left">
          <h4 className="text-sm font-bold tracking-wider text-slate-400 uppercase">
            Question Review
          </h4>
          {questions.map((q, idx) => {
            const userAnswer = selectedAnswers[idx];
            const isCorrect = userAnswer === q.correctAnswer;
            return (
              <div
                key={q.id || idx}
                className={`rounded-2xl border p-5 ${
                  isCorrect
                    ? 'border-emerald-100 bg-emerald-50/30'
                    : 'border-rose-100 bg-rose-50/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {idx + 1}. {q.question}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium line-through'}>
                        {q.options[userAnswer] || 'Unanswered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-xs text-emerald-700 font-medium">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-100">
                      <strong>Explanation:</strong> {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleRestart}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs">
      {/* Quiz Header & Progress */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
          <span className="tracking-wider uppercase">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-800">
            {quiz.difficulty}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{
              width: `${((currentIndex + (hasAnsweredCurrent ? 1 : 0)) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="p-6 sm:p-8">
        <h3 className="text-xl font-bold text-slate-900 leading-snug">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="mt-6 space-y-3">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = currentSelection === optIdx;
            const isCorrectOption = optIdx === currentQ.correctAnswer;

            let buttonClass = 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 text-slate-800';

            if (hasAnsweredCurrent) {
              if (isCorrectOption) {
                buttonClass = 'border-emerald-300 bg-emerald-50/80 text-emerald-900 font-semibold ring-1 ring-emerald-400';
              } else if (isSelected) {
                buttonClass = 'border-rose-300 bg-rose-50/80 text-rose-900 font-semibold ring-1 ring-rose-400';
              } else {
                buttonClass = 'border-slate-100 bg-slate-50/40 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                type="button"
                disabled={hasAnsweredCurrent}
                onClick={() => handleSelect(optIdx)}
                className={`w-full flex items-center justify-between rounded-xl border p-4 text-left text-sm transition-all ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{option}</span>
                </div>

                {hasAnsweredCurrent && (
                  <div>
                    {isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    )}
                    {isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card upon answering */}
        {hasAnsweredCurrent && (
          <div
            className={`mt-6 rounded-2xl border p-5 transition-all ${
              isCurrentCorrect
                ? 'border-emerald-200 bg-emerald-50/60 text-emerald-950'
                : 'border-amber-200 bg-amber-50/60 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
              {isCurrentCorrect ? (
                <>
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span>Correct!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span>Not quite!</span>
                </>
              )}
            </div>
            <p className="mt-1.5 text-sm leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Bottom Actions */}
        {hasAnsweredCurrent && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
            >
              <span>{currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
