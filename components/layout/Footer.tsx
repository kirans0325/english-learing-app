import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white pt-16 pb-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                English<span className="text-emerald-600">Flow</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600 leading-relaxed">
              A modern, high-performance platform dedicated to making English grammar, vocabulary, and conversational fluency simple, practical, and intuitive.
            </p>

            <div className="mt-6 flex items-center gap-3 text-slate-400">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-emerald-600 hover:bg-slate-50 transition"
                aria-label="X / Twitter"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-emerald-600 hover:bg-slate-50 transition"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-emerald-600 hover:bg-slate-50 transition"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/category/grammar" className="hover:text-emerald-700 transition">
                  English Grammar
                </Link>
              </li>
              <li>
                <Link href="/category/vocabulary" className="hover:text-emerald-700 transition">
                  Vocabulary & Idioms
                </Link>
              </li>
              <li>
                <Link href="/category/speaking" className="hover:text-emerald-700 transition">
                  Spoken English
                </Link>
              </li>
              <li>
                <Link href="/category/pronunciation" className="hover:text-emerald-700 transition">
                  Pronunciation
                </Link>
              </li>
              <li>
                <Link href="/category/public-speaking" className="hover:text-emerald-700 transition">
                  Public Speaking
                </Link>
              </li>
              <li>
                <Link href="/category/business-writing" className="hover:text-emerald-700 transition">
                  Business Writing
                </Link>
              </li>
              <li>
                <Link href="/category/american-accent-practice" className="hover:text-emerald-700 transition">
                  American Accent
                </Link>
              </li>
              <li>
                <Link href="/category/business-english" className="hover:text-emerald-700 transition">
                  Business English
                </Link>
              </li>
              <li>
                <Link href="/category/common-mistakes" className="hover:text-emerald-700 transition">
                  Common Mistakes
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Learning Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Learning Hub
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/#categories" className="hover:text-emerald-700 transition">
                  Curriculum Roadmap
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-emerald-700 transition">
                  Interactive Quizzes
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-emerald-700 transition">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/practice/grammar-master-quiz" className="hover:text-emerald-700 transition">
                  Grammar Level Test
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-700 transition">
                  Instructor Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-700 transition">
                  About EnglishFlow
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-700 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-emerald-700 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-700 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-slate-100 pt-8 sm:flex-row gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EnglishFlow Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js App Router, TypeScript, and MongoDB.
          </p>
        </div>
      </div>
    </footer>
  );
}
