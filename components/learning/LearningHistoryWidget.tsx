'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserHistoryItem } from '@/models/types';
import {
  get30DayHistory,
  clearUserHistory,
  toggleLessonCompleted,
  getHistoryStats,
} from '@/lib/utils/history';
import {
  History,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
} from 'lucide-react';

export function LearningHistoryWidget() {
  const [history, setHistory] = useState<UserHistoryItem[]>([]);
  const [stats, setStats] = useState({
    totalViewed: 0,
    totalCompleted: 0,
    completionRate: 0,
    categoriesExplored: 0,
    daysActive: 0,
  });
  const [mounted, setMounted] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const refreshHistory = () => {
    const list = get30DayHistory();
    setHistory(list);
    setStats(getHistoryStats());
  };

  useEffect(() => {
    setMounted(true);
    refreshHistory();

    const handleUpdate = () => refreshHistory();
    window.addEventListener('englishflow_history_updated', handleUpdate);
    return () => window.removeEventListener('englishflow_history_updated', handleUpdate);
  }, []);

  if (!mounted) return null;

  const categories = Array.from(new Set(history.map((h) => h.category)));

  const filteredHistory =
    filterCategory === 'all'
      ? history
      : history.filter((h) => h.category === filterCategory);

  const handleClear = () => {
    if (window.confirm('Clear your 30-day learning history?')) {
      clearUserHistory();
    }
  };

  const handleToggleComplete = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLessonCompleted(slug);
    refreshHistory();
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-100 uppercase tracking-wider">
            <History className="h-3.5 w-3.5 text-emerald-700" />
            <span>30-Day Learning Journey</span>
          </div>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Your Recent Learning Activity
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Lightweight client-side history automatically maintained for 30 days. No clutter.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition"
            title="Clear all 30-day history"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Stats Bar */}
      {history.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="text-2xl font-black text-slate-900">{stats.totalViewed}</div>
            <div className="text-xs font-medium text-slate-500">Lessons Explored</div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="text-2xl font-black text-emerald-700">{stats.totalCompleted}</div>
            <div className="text-xs font-medium text-emerald-800">Completed (30d)</div>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="text-2xl font-black text-indigo-700">{stats.completionRate}%</div>
            <div className="text-xs font-medium text-indigo-800">Completion Rate</div>
          </div>
          <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-4">
            <div className="text-2xl font-black text-purple-700">{stats.daysActive}</div>
            <div className="text-xs font-medium text-purple-800">Days Active (30d)</div>
          </div>
        </div>
      )}

      {/* Category Filter Pills (if multiple categories) */}
      {categories.length > 1 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter:</span>
          <button
            onClick={() => setFilterCategory('all')}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Tracks ({history.length})
          </button>
          {categories.map((cat) => {
            const count = history.filter((h) => h.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                  filterCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Lessons List */}
      <div className="mt-6">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200">
            {filteredHistory.slice(0, 8).map((item) => {
              const visitDate = new Date(item.visitedAt);
              const isToday =
                new Date().toDateString() === visitDate.toDateString();
              const dateLabel = isToday
                ? 'Today'
                : visitDate.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  });

              return (
                <div
                  key={item.slug}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 transition hover:bg-slate-50/80"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => handleToggleComplete(e, item.slug)}
                      className="mt-0.5 shrink-0 text-slate-300 hover:text-emerald-600 transition"
                      title={item.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {item.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {item.category}
                        </span>
                        {item.difficulty && (
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              item.difficulty === 'Beginner'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : item.difficulty === 'Intermediate'
                                ? 'bg-sky-50 text-sky-700 border border-sky-100'
                                : 'bg-purple-50 text-purple-700 border border-purple-100'
                            }`}
                          >
                            {item.difficulty}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">
                          • Visited {dateLabel}
                        </span>
                      </div>

                      <Link
                        href={`/blog/${item.slug}`}
                        className="mt-1 block text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <Link
                      href={`/blog/${item.slug}`}
                      className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-emerald-600 hover:text-white transition"
                    >
                      <span>{item.completed ? 'Review' : 'Resume'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-semibold text-slate-700">
              No lessons in your 30-day history yet
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
              As you read lessons, your progress and completed topics will appear here for 30 days so you can easily resume where you left off.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
