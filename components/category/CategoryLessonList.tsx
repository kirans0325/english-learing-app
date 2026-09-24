'use client';

import React, { useState } from 'react';
import { Post } from '@/models/types';
import { ArticleCard } from '@/components/blog/ArticleCard';
import {
  Layers,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface CategoryLessonListProps {
  posts: Post[];
  categoryName: string;
}

type DifficultyFilter = 'all' | 'Beginner' | 'Intermediate' | 'Advanced';

export function CategoryLessonList({ posts, categoryName }: CategoryLessonListProps) {
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [viewMode, setViewMode] = useState<'levels' | 'grid'>('levels');

  const beginnerPosts = posts.filter(
    (p) => p.difficulty === 'Beginner' || p.difficultyOrder === 1
  );
  const intermediatePosts = posts.filter(
    (p) => p.difficulty === 'Intermediate' || p.difficultyOrder === 2
  );
  const advancedPosts = posts.filter(
    (p) => p.difficulty === 'Advanced' || p.difficultyOrder === 3
  );

  const filteredPosts =
    filter === 'all'
      ? posts
      : posts.filter((p) => p.difficulty === filter);

  return (
    <div className="space-y-8">
      {/* Top Filter and View Mode Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        {/* Difficulty Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Level:</span>
          </span>

          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Lessons ({posts.length})
          </button>

          <button
            onClick={() => setFilter('Beginner')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'Beginner'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            Basic / Beginner ({beginnerPosts.length})
          </button>

          <button
            onClick={() => setFilter('Intermediate')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'Intermediate'
                ? 'bg-sky-700 text-white shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200/60'
            }`}
          >
            Intermediate ({intermediatePosts.length})
          </button>

          <button
            onClick={() => setFilter('Advanced')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === 'Advanced'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            Advanced Mastery ({advancedPosts.length})
          </button>
        </div>

        {/* View Mode Toggle (Only when 'all' is selected) */}
        {filter === 'all' && (
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('levels')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'levels'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Step-by-Step Roadmap
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Grid
            </button>
          </div>
        )}
      </div>

      {/* Render Mode: Step-by-Step Level Sections */}
      {filter === 'all' && viewMode === 'levels' ? (
        <div className="space-y-12">
          {/* Level 1: Basic / Beginner */}
          {beginnerPosts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-emerald-100 pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-sm">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Level 1: Core Basics & Foundations (Easy)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Essential rules, fundamental sentence architecture, and core patterns to build confidence.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beginnerPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Level 2: Intermediate */}
          {intermediatePosts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-sky-100 pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 text-sky-800 font-extrabold text-sm">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Level 2: Intermediate Competence & Application (Moderate)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Expand into nuance, tense harmonies, workplace conversations, and conversational ease.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {intermediatePosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}

          {/* Level 3: Advanced */}
          {advancedPosts.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 border-b border-purple-100 pb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800 font-extrabold text-sm">
                  3
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Level 3: Advanced Mastery & Nuance (Difficult)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Master rhetorical inversion, executive reports, high-stakes persuasion, and native-level fluency.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {advancedPosts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        /* Render Mode: Filtered Grid */
        <div>
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                No lessons found for this difficulty level.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
