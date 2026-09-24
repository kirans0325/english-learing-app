import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  GraduationCap,
  CheckCircle2,
  Volume2,
  TrendingUp,
} from 'lucide-react';
import { getFeaturedPosts, getLatestPosts } from '@/lib/db/posts';
import { getCategories } from '@/lib/db/categories';
import { SAMPLE_DAILY_WORD } from '@/lib/db/seed-data';
import { CategoryCard } from '@/components/learning/CategoryCard';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { DailyWordCard } from '@/components/learning/DailyWordCard';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import { HomeSearchBar } from '@/components/home/HomeSearchBar';
import { WebSiteJsonLd } from '@/lib/seo/json-ld';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const [featuredPosts, latestPosts, categories] = await Promise.all([
    getFeaturedPosts(6),
    getLatestPosts(4),
    getCategories(),
  ]);

  return (
    <>
      <WebSiteJsonLd />

      <main className="min-h-screen">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden border-b border-slate-200/80 bg-linear-to-b from-emerald-50/30 via-slate-50/50 to-white pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Headline & Action */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  <span>The Modern Way to Master Practical English</span>
                </div>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Improve Your English,{' '}
                  <span className="text-emerald-600">One Lesson</span> at a Time.
                </h1>

                <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 dark:text-slate-300">
                  Learn practical English through simple explanations, real examples,
                  vocabulary, grammar lessons and daily practice.
                </p>

                {/* Spacious, Prominent Search Bar on Home */}
                <div className="mt-7">
                  <HomeSearchBar />
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <Link
                    href="/#categories"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/blog"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                  >
                    <span>Explore Articles</span>
                  </Link>
                </div>

                {/* Feature pill highlights */}
                <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Real-world Dialogues</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Instant Interactive Quizzes</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Free Daily Lessons</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Lightweight CSS-based Learning Visual Card */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl sm:p-7">
                  {/* Decorative badge */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 tracking-wider uppercase">
                        Interactive Lesson Demo
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Grammar & Speaking
                    </span>
                  </div>

                  {/* Micro Grammar comparison box */}
                  <div className="mt-5 space-y-3">
                    <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 text-xs">
                      <span className="font-bold text-rose-700 uppercase tracking-wider text-[10px]">
                        Incorrect
                      </span>
                      <p className="mt-1 font-medium text-slate-700 line-through decoration-rose-400">
                        &ldquo;She go to work by bus every day.&rdquo;
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs">
                      <span className="font-bold text-emerald-700 uppercase tracking-wider text-[10px]">
                        Correct
                      </span>
                      <p className="mt-1 font-bold text-slate-900">
                        &ldquo;She goes to work by bus every day.&rdquo;
                      </p>
                    </div>

                    {/* Word snippet with pronunciation badge */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-slate-900">Confident</span>
                          <span className="ml-2 text-xs font-mono text-slate-500">/ˈkɒn.fɪ.dənt/</span>
                        </div>
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-700 shadow-2xs">
                          <Volume2 className="h-3 w-3" />
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">
                        Feeling or showing certainty about something.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs font-bold text-emerald-700 pt-2 border-t border-slate-100">
                    <span>9 Lessons Available</span>
                    <span className="flex items-center gap-1">
                      <span>Explore all</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LEARNING CATEGORIES SECTION */}
        <section id="categories" className="py-16 sm:py-20 bg-white scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  Curated Curriculum
                </span>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Explore Learning Categories
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-xl">
                  Focus on what matters to your personal English goals, from sentence structure to conversational ease.
                </p>
              </div>

              <Link
                href="/learn"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>View Full Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* DAILY TRENDING TOPICS & NEWS BANNER */}
        <section className="bg-linear-to-r from-emerald-950 via-teal-950 to-slate-950 py-12 text-white border-y border-emerald-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1 text-xs font-bold text-emerald-300">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>NEW: DAILY TRENDING NEWS IN ENGLISH</span>
                </div>
                <h2 className="mt-3 text-2xl font-black sm:text-3xl tracking-tight text-white">
                  Learn English Through Today&apos;s World Headlines
                </h2>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Real-time global news transformed into bite-sized lessons: authentic journalistic excerpts, power vocabulary with IPA pronunciation, grammar analysis, and 60-second JAM speaking drills.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90 font-medium">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Daily Rotating Edition
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> The Philosopher Android Voice
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 60-Second JAM Speech Timer
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <Link
                  href="/trending"
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 active:scale-95"
                >
                  <span>Explore Today&apos;s Edition</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* DAILY ENGLISH & PRACTICE HIGHLIGHT */}
        <section className="border-b border-slate-200/80 bg-slate-50/50 py-16 sm:py-20 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-start">
              {/* Daily Word Card (7 cols) */}
              <div className="lg:col-span-7">
                <DailyWordCard data={SAMPLE_DAILY_WORD} />
              </div>

              {/* Practice CTA Section (5 cols) */}
              <div className="lg:col-span-5 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 w-fit">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Practice Section</span>
                </div>

                <h3 className="mt-4 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Test Your English
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Put your skills to the test with quick, bite-sized quizzes. Receive instant feedback and detailed grammatical explanations.
                </p>

                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/practice/grammar-master-quiz"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 transition hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                      <span>Grammar Quiz</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/practice/vocabulary-lexicon-challenge"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="h-4 w-4 text-indigo-600" />
                      <span>Vocabulary Quiz</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/practice/spoken-english-workplace-quiz"
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-sm font-semibold text-slate-800 transition hover:border-sky-300 hover:bg-sky-50/50 hover:text-sky-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="h-4 w-4 text-sky-600" />
                      <span>Speaking Practice</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ARTICLES */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  Hand-Picked Lessons
                </span>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Featured Articles
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-xl">
                  Essential guides on grammar nuances, high-impact vocabulary, and speaking techniques.
                </p>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>View All Articles</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, idx) => (
                <ArticleCard key={post.slug} post={post} priority={idx === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* LATEST ARTICLES LIST */}
        <section className="border-t border-slate-200/80 bg-slate-50/40 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  Fresh Insights
                </span>
                <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Latest English Lessons
                </h2>
              </div>
              <Link
                href="/blog"
                className="text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
              >
                Explore Blog &rarr;
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER CTA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <NewsletterCTA variant="banner" />
          </div>
        </section>
      </main>
    </>
  );
}
