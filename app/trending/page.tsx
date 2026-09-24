import React from 'react';
import { Metadata } from 'next';
import { getTodayTrendingDigest } from '@/lib/db/trending';
import { TrendingStudio } from '@/components/trending/TrendingStudio';

// Revalidate page every hour (ISR) - ensures zero DB overload on high traffic
export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Daily Trending English | Learn Through World News',
  description:
    'Master professional English through today’s top trending news topics. Explore authentic headlines, power vocabulary with IPA pronunciation, journalistic grammar patterns, and 60-second JAM speaking drills.',
  keywords: [
    'Daily English News',
    'Trending English Topics',
    'News Vocabulary in Context',
    'Workplace English Practice',
    'JAM Speaking Topics',
    'English Grammar in the News',
  ],
};

export default async function TrendingPage() {
  const digest = await getTodayTrendingDigest();

  return (
    <main className="min-h-screen bg-slate-50/50 py-10 transition-colors dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TrendingStudio initialDigest={digest} />
      </div>
    </main>
  );
}
