import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getQuizzes } from '@/lib/db/quizzes';
import { HelpCircle, CheckCircle2, ArrowRight, BookOpen, Sparkles, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'English Quizzes & Practice Tests',
  description:
    'Test your English grammar, vocabulary, and conversational comprehension with free interactive quizzes and detailed explanations.',
};

export const revalidate = 60;

export default async function PracticePage() {
  const quizzes = await getQuizzes();

  return (
    <main className="min-h-screen bg-slate-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <HelpCircle className="h-4 w-4" />
            <span>Interactive Practice Center</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Test Your English
          </h1>
          <p className="mt-2 text-base text-slate-600 leading-relaxed">
            Reinforce what you learn with quick self-evaluations. Each question includes clear explanations of why answers are right or wrong.
          </p>
        </div>

        {/* Quizzes List */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.slug}
              className="flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition hover:shadow-md hover:border-slate-300"
            >
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant={quiz.category === 'Grammar' ? 'emerald' : quiz.category === 'Vocabulary' ? 'indigo' : 'sky'}>
                    {quiz.category}
                  </Badge>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {quiz.difficulty}
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900 leading-snug">
                  {quiz.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {quiz.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{quiz.questionCount} Interactive Questions</span>
                  <span>Instant Grading</span>
                </div>

                <Link
                  href={`/practice/${quiz.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-emerald-600 active:scale-95"
                >
                  <span>Start Quiz</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
