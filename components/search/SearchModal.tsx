'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, Loader2, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { Post } from '@/models/types';
import { Badge } from '@/components/ui/Badge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [recommendations, setRecommendations] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setRecommendations([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut Cmd+K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
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
        setResults(data.posts || []);
        setRecommendations(data.recommendations || []);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const foundedTags = Array.from(
    new Set(results.flatMap((p) => [p.category, ...(p.tags || [])]))
  ).slice(0, 6);

  const curatedTopics = [
    'Sentence Patterns',
    'Report Writing',
    'Business English',
    'JAM Speaking',
    'Speech Shadowing',
    'Present Perfect',
    'Grammar Essentials',
    'Common Mistakes',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-100 px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search lessons, grammar rules, vocabulary, phrases..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 text-base text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-emerald-600 mr-2" />}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-sm text-slate-500">
              <p className="font-semibold text-slate-700">Explore Popular Topics</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {curatedTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setQuery(topic)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold tracking-wider text-slate-400 uppercase">
                <span>{results.length} Results Found</span>
                <span className="text-[10px] font-medium text-emerald-600">Relevance ranked</span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="group block py-3 px-2.5 rounded-xl transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge size="sm">{post.category}</Badge>
                        {post.difficulty && (
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                            {post.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                      {post.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                      {post.excerpt}
                    </p>
                  </Link>
                ))}
              </div>

              {/* Founded Tag Suggestions */}
              {foundedTags.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Founded Topics & Tags
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {foundedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setQuery(tag)}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : !loading ? (
            <div className="py-4">
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900">
                <p className="font-semibold">No direct match for &ldquo;{query}&rdquo;</p>
                <p className="mt-0.5 text-amber-800">
                  Here are recommended lessons and founded topics to explore:
                </p>
              </div>

              {recommendations.length > 0 && (
                <div className="mt-4 divide-y divide-slate-100">
                  <div className="pb-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Lessons
                  </div>
                  {recommendations.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      onClick={onClose}
                      className="group block py-2.5 px-2 rounded-xl transition hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2">
                        <Badge size="sm">{post.category}</Badge>
                        <span className="text-[11px] text-slate-400">{post.readingTime}</span>
                      </div>
                      <h4 className="mt-1 text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {post.title}
                      </h4>
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-4 border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Founded Topic Suggestions
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {curatedTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setQuery(topic)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-400">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
}
