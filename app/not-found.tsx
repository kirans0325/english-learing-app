import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 mb-6">
        <GraduationCap className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
        404 Page Not Found
      </span>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        This Lesson Doesn&apos;t Exist
      </h1>

      <p className="mt-3 max-w-md text-sm text-slate-600 leading-relaxed">
        The link you followed may be broken or the lesson has been reorganized into our structured tracks.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <BookOpen className="h-4 w-4" />
          <span>Browse All Lessons</span>
        </Link>
      </div>
    </main>
  );
}
