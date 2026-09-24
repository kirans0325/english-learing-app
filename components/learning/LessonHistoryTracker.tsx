'use client';

import React, { useEffect, useState } from 'react';
import { recordLessonVisit, toggleLessonCompleted, isLessonCompleted } from '@/lib/utils/history';
import { CheckCircle2, Circle, Clock, Flame, History } from 'lucide-react';

interface LessonHistoryTrackerProps {
  post: {
    slug: string;
    title: string;
    category: string;
    difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    readingTime?: string;
  };
}

export function LessonHistoryTracker({ post }: LessonHistoryTrackerProps) {
  const [completed, setCompleted] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Record visit to 30-day lightweight history
    recordLessonVisit(post);
    setCompleted(isLessonCompleted(post.slug));
  }, [post]);

  const handleToggle = () => {
    const newState = toggleLessonCompleted(post.slug);
    setCompleted(newState);
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white/90 p-3 sm:px-4 py-2.5 shadow-2xs backdrop-blur-xs">
      <div className="flex items-center gap-2 text-xs text-slate-600">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <History className="h-3.5 w-3.5" />
        </span>
        <span className="font-medium text-slate-700">30-Day Learning Track:</span>
        <span className="text-slate-500">Recorded in your study history</span>
      </div>

      <button
        onClick={handleToggle}
        type="button"
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 shadow-2xs ${
          completed
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200'
        }`}
      >
        {completed ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            <span>Completed ✓</span>
          </>
        ) : (
          <>
            <Circle className="h-3.5 w-3.5 text-slate-400" />
            <span>Mark as Complete</span>
          </>
        )}
      </button>
    </div>
  );
}
