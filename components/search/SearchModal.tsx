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
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.posts || []);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

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
              <p className="font-medium text-slate-700">Quick Search Topics</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {['Present Simple', 'Articles', 'Business English', 'Phrasal Verbs', 'Common Mistakes'].map(
                  (topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setQuery(topic)}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                {results.length} Results Found
              </span>
              <div className="divide-y divide-slate-100">
                {results.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={onClose}
                    className="group block py-3.5 px-2 rounded-xl transition hover:bg-slate-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge size="sm">{post.category}</Badge>
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
            </div>
          ) : !loading ? (
            <div className="py-10 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                No lessons found for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try searching for tenses, vocabulary, or speaking phrases.
              </p>
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
