import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCategories } from '@/lib/db/categories';
import { getPosts } from '@/lib/db/posts';
import { CategoryCard } from '@/components/learning/CategoryCard';
import { DailyWordCard } from '@/components/learning/DailyWordCard';
import { SAMPLE_DAILY_WORD } from '@/lib/db/seed-data';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Target,
  Flame,
  Award,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Structured English Learning Hub',
  description:
    'Follow our structured learning tracks for Grammar, Vocabulary, and Conversational English designed to take you from intermediate to fluent.',
};

export const revalidate = 60;

export default async function LearnPage() {
  const [categories, { posts }] = await Promise.all([
    getCategories(),
    getPosts({ limit: 6, status: 'published' }),
  ]);

  return (
    <main className="min-h-screen bg-slate-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hub Banner */}
        <div className="rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-12 text-white shadow-md">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-100 backdrop-blur-xs">
              <GraduationCap className="h-3.5 w-3.5" />
              <span>Structured Learning Hub</span>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white">
              Master Practical English, Step by Step.
            </h1>

            <p className="mt-3 text-base sm:text-lg text-emerald-100 leading-relaxed">
              Choose your focus area, explore bite-sized lessons with clear formulas,
              and reinforce knowledge through interactive quizzes.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>9 Comprehensive Tracks</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Real Grammar Comparisons</span>
              </div>
              <div className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <span>Instant Self-Quizzes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Word Feature */}
        <div className="mt-12">
          <DailyWordCard data={SAMPLE_DAILY_WORD} />
        </div>

        {/* All Learning Tracks */}
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Core Tracks
              </span>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Choose Your Learning Path
              </h2>
            </div>
            <Link
              href="/practice"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
            >
              <span>Go to Quizzes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </section>

        {/* Fast Study Recommendation */}
        <section className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
            <Target className="h-4 w-4" />
            <span>Recommended Daily Routine</span>
          </div>

          <h3 className="mt-3 text-2xl font-bold text-slate-900">
            How to Build English Fluency in 15 Minutes a Day
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800 text-sm">
                1
              </span>
              <h4 className="mt-3 text-sm font-bold text-slate-900">
                Read 1 Lesson (5 mins)
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Focus on one grammar distinction or set of 5 vocabulary items.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-800 text-sm">
                2
              </span>
              <h4 className="mt-3 text-sm font-bold text-slate-900">
                Shadow Out Loud (5 mins)
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Click the audio button on vocabulary cards and repeat out loud 3 times.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 font-bold text-amber-800 text-sm">
                3
              </span>
              <h4 className="mt-3 text-sm font-bold text-slate-900">
                Test Yourself (5 mins)
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Take a quick interactive quiz in the Practice section to lock in memory.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
