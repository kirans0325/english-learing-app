import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  getPosts,
} from '@/lib/db/posts';
import { formatDate } from '@/lib/utils/date';
import { Badge } from '@/components/ui/Badge';
import { ArticleContent } from '@/components/blog/ArticleContent';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { PrintPdfButton } from '@/components/blog/PrintPdfButton';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import { LessonHistoryTracker } from '@/components/learning/LessonHistoryTracker';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/lib/seo/json-ld';
import {
  Clock,
  Calendar,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const { posts } = await getPosts({ limit: 50, status: 'published' });
  return posts.map((post) => ({ slug: post.slug }));
}

// Dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://englishflow.com';
  const canonicalUrl = `${APP_URL}/blog/${post.slug}`;

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [relatedPosts, adjacent] = await Promise.all([
    getRelatedPosts(post.category, post.slug, 3),
    getAdjacentPosts(post.publishedAt),
  ]);

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.category, url: `/category/${post.category.toLowerCase().replace(/\s+/g, '-')}` },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      <ArticleJsonLd post={post} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="min-h-screen bg-white pb-20 pt-8 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation - Aligned to max-w-5xl */}
          <nav aria-label="Breadcrumb" className="mx-auto max-w-5xl mb-6 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/blog" className="hover:text-emerald-700 transition">
              Blog
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link
              href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="hover:text-emerald-700 transition"
            >
              {post.category}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="text-slate-800 font-medium truncate max-w-[200px] sm:max-w-xs dark:text-slate-200">
              {post.title}
            </span>
          </nav>

          {/* Article Header - Stretched to Match Blog Image Width (max-w-5xl) */}
          <header className="mx-auto max-w-5xl text-center">
            <div className="flex items-center justify-center gap-2">
              <Badge
                variant={
                  post.category === 'Grammar'
                    ? 'emerald'
                    : post.category === 'Vocabulary'
                    ? 'indigo'
                    : post.category === 'Speaking'
                    ? 'sky'
                    : post.category === 'Pronunciation'
                    ? 'amber'
                    : post.category === 'Business English'
                    ? 'purple'
                    : post.category === 'Common Mistakes'
                    ? 'rose'
                    : post.category === 'Public Speaking'
                    ? 'teal'
                    : post.category === 'Business Writing'
                    ? 'blue'
                    : post.category === 'American Accent Practice'
                    ? 'orange'
                    : 'emerald'
                }
                size="md"
              >
                {post.category}
              </Badge>
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-tight sm:leading-tight lg:leading-snug max-w-5xl mx-auto dark:text-white">
              {post.title}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl mx-auto dark:text-slate-300">
              {post.excerpt}
            </p>

            {/* Author and Metadata Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500 border-y border-slate-100 py-3.5 dark:border-slate-800 dark:text-slate-400">
              <div className="flex items-center gap-2.5">
                <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-slate-900 dark:text-white">{post.author.name}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">{post.author.role}</span>
                </div>
              </div>

              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>

              <span className="text-slate-300 dark:text-slate-700">•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readingTime}</span>
              </div>

              {post.difficulty && (
                <>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                      post.difficulty === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : post.difficulty === 'Intermediate'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                    }`}
                  >
                    Level: {post.difficulty}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Featured Image - max-w-5xl */}
          <div className="relative mx-auto mt-8 aspect-21/9 max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>

          {/* 30-Day Lightweight Learning Tracker */}
          <div className="mx-auto max-w-5xl mt-6">
            <LessonHistoryTracker
              post={{
                slug: post.slug,
                title: post.title,
                category: post.category,
                difficulty: post.difficulty,
                readingTime: post.readingTime,
              }}
            />
          </div>

          {/* Main Content Layout with Sticky Sidebar */}
          <div id="lesson-print-container" className="relative mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Watermark overlay for print/PDF */}
            <div className="print-watermark-overlay" aria-hidden="true">
              EnglishFlow • Master Practical English
            </div>

            {/* Print Header Banner */}
            <div className="print-header-banner col-span-12">
              <div>
                <span className="brand">EnglishFlow</span>
                <span className="ml-2 font-medium text-slate-500">— Master Practical English</span>
              </div>
              <div className="text-right text-[10px] text-slate-400">
                <span>{post.category} • Printable Lesson Study Guide</span>
              </div>
            </div>

            {/* Sidebar with Table of Contents & PDF Download (4 cols) */}
            <aside className="lg:col-span-4 order-2 lg:order-1 no-print">
              <div className="sticky top-24 space-y-6">
                {/* Download / Print Lesson Card */}
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                    Printable Study Guide
                  </span>
                  <PrintPdfButton postSlug={post.slug} postTitle={post.title} />
                </div>

                <TableOfContents content={post.content} />

                {/* Tags Widget */}
                {post.tags && post.tags.length > 0 && (
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Lesson Tags
                    </span>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <Link
                          key={tag}
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/80 hover:bg-emerald-50 hover:text-emerald-700 transition"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share buttons */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <ShareButtons title={post.title} />
                </div>
              </div>
            </aside>

            {/* Main Article Body (8 cols) */}
            <article className="lg:col-span-8 order-1 lg:order-2">
              <ArticleContent content={post.content} />

              {/* Printable Footer Banner */}
              <div className="print-footer-banner">
                <p className="font-semibold text-slate-800">
                  EnglishFlow — Master Practical English • www.englishflow.com
                </p>
                <p className="mt-1 text-[9px] text-slate-500">
                  Licensed for single-member educational use. All rights reserved.
                </p>
              </div>

              {/* Author Bio Box */}
              <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left no-print">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-slate-200">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">{post.author.name}</h4>
                  <p className="text-xs font-medium text-emerald-700">{post.author.role}</p>
                  {post.author.bio && (
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>

              {/* Previous / Next Article Navigation */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-200/80 pt-6 no-print">
                {adjacent.prev ? (
                  <Link
                    href={`/blog/${adjacent.prev.slug}`}
                    className="group rounded-xl border border-slate-200 p-4 transition hover:border-emerald-300 hover:bg-emerald-50/20"
                  >
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700">
                      <ArrowLeft className="h-3 w-3" />
                      <span>Previous Lesson</span>
                    </span>
                    <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800">
                      {adjacent.prev.title}
                    </p>
                  </Link>
                ) : <div />}

                {adjacent.next ? (
                  <Link
                    href={`/blog/${adjacent.next.slug}`}
                    className="group rounded-xl border border-slate-200 p-4 text-right transition hover:border-emerald-300 hover:bg-emerald-50/20"
                  >
                    <span className="flex items-center justify-end gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-emerald-700">
                      <span>Next Lesson</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                    <p className="mt-1 text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-800">
                      {adjacent.next.title}
                    </p>
                  </Link>
                ) : <div />}
              </div>

              {/* In-article Newsletter CTA */}
              <div className="mt-10 no-print">
                <NewsletterCTA variant="card" />
              </div>
            </article>
          </div>

          {/* Related Articles Section */}
          {relatedPosts.length > 0 && (
            <section className="mt-20 border-t border-slate-200/80 pt-16">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Keep Learning
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">
                    Related Lessons in {post.category}
                  </h3>
                </div>
                <Link
                  href={`/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  View all in {post.category} &rarr;
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <ArticleCard key={related.slug} post={related} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
