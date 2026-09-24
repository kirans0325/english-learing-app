import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getQuizBySlug, getQuizzes } from '@/lib/db/quizzes';
import { QuizRunner } from '@/components/quiz/QuizRunner';
import { ChevronRight, ArrowLeft, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface QuizPageProps {
  params: Promise<{ slug: string }>;
}
export const revalidate = 60;

export async function generateStaticParams() {
  const quizzes = await getQuizzes();
  return quizzes.map((quiz) => ({ slug: quiz.slug }));
}

export async function generateMetadata({
  params,
}: QuizPageProps): Promise<Metadata> {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    return { title: 'Quiz Not Found' };
  }

  return {
    title: `${quiz.title} | EnglishFlow Practice`,
    description: quiz.description,
  };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { slug } = await params;
  const quiz = await getQuizBySlug(slug);

  if (!quiz) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-emerald-700 transition">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <Link href="/practice" className="hover:text-emerald-700 transition">
            Practice
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate">{quiz.title}</span>
        </nav>

        {/* Quiz Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <Badge variant="emerald">{quiz.category}</Badge>
            <span className="text-xs font-semibold text-slate-500">
              Difficulty: {quiz.difficulty}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {quiz.title}
          </h1>

          <p className="mt-2 text-base text-slate-600">
            {quiz.description}
          </p>
        </div>

        {/* Interactive Runner */}
        <QuizRunner quiz={quiz} />

        <div className="mt-8 text-center">
          <Link
            href="/practice"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Quizzes</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
