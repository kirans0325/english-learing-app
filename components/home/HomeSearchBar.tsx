'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Sparkles, BookOpen, Clock, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/models/types';
import { SearchModal } from '@/components/search/SearchModal';

const POPULAR_SEARCH_TAGS = [
  'Sentence Patterns',
  'Report Writing',
  'Business English',
  'JAM Speaking',
  'Speech Shadowing',
  'Present Perfect',
  'Grammar Essentials',
  'Common Mistakes',
];

export function HomeSearchBar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setRecommendations([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        const postsList = Array.isArray(data.posts) ? data.posts : [];
        setResults(postsList.slice(0, 6));
        setRecommendations(Array.isArray(data.recommendations) ? data.recommendations.slice(0, 4) : []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleTagClick = (tag: string) => {
    setQuery(tag);
    setIsFocused(true);
  };

  // Extract founded topics and tags from current results
  const foundedTopics = Array.from(
    new Set(results.flatMap((p) => [p.category, ...(p.tags || [])]))
  ).slice(0, 6);

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-2xl mx-auto lg:mx-0">
        {/* Main Spacious Search Bar */}
        <div
          className={`relative flex items-center rounded-2xl border bg-white p-2 shadow-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 ${
            isFocused
              ? 'border-emerald-500 ring-4 ring-emerald-500/15 shadow-emerald-500/10'
              : 'border-slate-200/90 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search grammar guides, vocabulary, idioms, speaking drills..."
            className="w-full bg-transparent px-3 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden dark:text-white dark:placeholder:text-slate-500"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setRecommendations([]);
              }}
              className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="hidden sm:flex shrink-0 items-center gap-1 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
            title="Open comprehensive search (⌘K)"
          >
            <span>Full Search</span>
            <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-bold text-slate-600 shadow-2xs border border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Live Search Instant Dropdown */}
        {isFocused && query.trim() && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[75vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span>Searching 60+ lessons...</span>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="flex items-center justify-between px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{results.length} Lesson{results.length > 1 ? 's' : ''} Found</span>
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Match score ranked</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {results.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={() => setIsFocused(false)}
                      className="group flex items-center justify-between gap-3 rounded-xl p-3 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {post.category}
                          </span>
                          {post.difficulty && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                              {post.difficulty}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="h-3 w-3" />
                            {post.readingTime}
                          </span>
                        </div>
                        <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition">
                          {post.title}
                        </h4>
                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {post.excerpt}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                    </Link>
                  ))}
                </div>

                {/* Founded Related Topics */}
                {foundedTopics.length > 0 && (
                  <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Founded Topic Tags
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5 px-2">
                      {foundedTopics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTagClick(topic)}
                          className="rounded-md border border-slate-200/90 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        >
                          #{topic}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3">
                <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    No direct matches for &ldquo;{query}&rdquo;. Check out recommended topics & lessons:
                  </span>
                </div>

                {/* Recommended Lessons Fallback */}
                {recommendations.length > 0 && (
                  <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                    <div className="px-2 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Recommended Lessons
                    </div>
                    {recommendations.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        onClick={() => setIsFocused(false)}
                        className="group flex items-center justify-between gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              {post.category}
                            </span>
                            <span className="flex items-center gap-1 text-[11px] text-slate-400">
                              <Clock className="h-3 w-3" />
                              {post.readingTime}
                            </span>
                          </div>
                          <h4 className="mt-1 line-clamp-1 text-sm font-bold text-slate-900 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400 transition">
                            {post.title}
                          </h4>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Explore Popular Topics */}
                <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Explore Popular Topics
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 px-2">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagClick(tag)}
                        className="rounded-lg border border-slate-200/80 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Suggestion Pills */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-400 dark:text-slate-500">Popular:</span>
          {POPULAR_SEARCH_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagClick(tag)}
              className="rounded-lg border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-slate-800"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Global Comprehensive Search Modal */}
      <SearchModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
