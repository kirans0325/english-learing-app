'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Save,
  ArrowLeft,
  Sparkles,
  BookOpen,
  HelpCircle,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Grammar');
  const [tags, setTags] = useState('Grammar, Rules, English');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80'
  );
  const [content, setContent] = useState(`## Introduction

Write an engaging introduction to this English lesson here.

:::grammar
INCORRECT: He don't know the rules.
CORRECT: He doesn't know the rules.
EXPLANATION: Third person singular requires "doesn't" in the present simple.
:::

## Key Points & Explanations

Explain the concept clearly with examples.

:::vocab
WORD: Comprehend
PHONETIC: /ˌkɒm.prɪˈhend/
MEANING: To understand something completely.
EXAMPLE: It took time to fully comprehend the nuances of the sentence.
:::

## Self-Evaluation

:::quiz
QUESTION: Which sentence uses the correct auxiliary verb?
OPTION: He don't like coffee.
OPTION: He doesn't like coffee.
OPTION: He isn't like coffee.
ANSWER: 1
EXPLANATION: The subject "he" takes "does not / doesn't" in standard English.
:::`);

  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertSnippet = (snippet: string) => {
    setContent((prev) => `${prev}\n\n${snippet}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category,
          tags: tags.split(',').map((t) => t.trim()),
          featuredImage,
          featured,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save post');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts"
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-500"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Create New Lesson</h1>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 disabled:opacity-70 transition"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Publish Lesson</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-semibold text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Main Content Fields (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Lesson Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Conditional Sentences in 15 Minutes"
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Short Excerpt
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A concise summary of what the learner will discover..."
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Lesson Content (Markdown & Custom Blocks)
                </label>
                {/* Shortcode helper buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `:::grammar\nINCORRECT: Incorrect sentence here.\nCORRECT: Correct sentence here.\nEXPLANATION: Explain the rule.\n:::`
                      )
                    }
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>+Grammar Box</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `:::vocab\nWORD: Fluency\nPHONETIC: /ˈfluː.ən.si/\nMEANING: The ability to speak or write easily.\nEXAMPLE: Daily practice leads to fluency.\n:::`
                      )
                    }
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>+Vocab Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertSnippet(
                        `:::quiz\nQUESTION: What is the correct form?\nOPTION: Option A\nOPTION: Option B\nANSWER: 1\nEXPLANATION: Because of the rule.\n:::`
                      )
                    }
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                  >
                    <HelpCircle className="h-3 w-3" />
                    <span>+Quiz</span>
                  </button>
                </div>
              </div>
              <textarea
                rows={18}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full font-mono text-xs rounded-xl border border-slate-300 bg-white p-4 text-slate-800 focus:border-emerald-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Sidebar Settings (1 col) */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2">
                Lesson Meta
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="Grammar">Grammar</option>
                  <option value="Vocabulary">Vocabulary</option>
                  <option value="Speaking">Speaking</option>
                  <option value="Pronunciation">Pronunciation</option>
                  <option value="Business English">Business English</option>
                  <option value="Common Mistakes">Common Mistakes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="featured" className="text-xs font-medium text-slate-700">
                  Showcase on Homepage Featured
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
