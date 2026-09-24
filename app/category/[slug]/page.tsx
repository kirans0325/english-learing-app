import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getCategoryBySlug, getCategories } from '@/lib/db/categories';
import { getPosts } from '@/lib/db/posts';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import { TongueTwisterStudio } from '@/components/speaking/TongueTwisterStudio';
import { JamTopicStudio } from '@/components/speaking/JamTopicStudio';
import { ShadowingStudio } from '@/components/speaking/ShadowingStudio';
import { BreadcrumbJsonLd } from '@/lib/seo/json-ld';
import { BookOpen, ChevronRight, Layers, ArrowLeft } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}
export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://englishflow.com';

  return {
    title: `${category.name} Lessons & Articles`,
    description: category.description,
    alternates: {
      canonical: `${APP_URL}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Lessons | EnglishFlow`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { posts } = await getPosts({
    category: category.name,
    limit: 20,
    status: 'published',
  });

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Categories', url: '/learn' },
    { name: category.name, url: `/category/${category.slug}` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <main className="min-h-screen bg-slate-50/40 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <Link href="/learn" className="hover:text-emerald-700 transition">
              Categories
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            <span className="font-semibold text-slate-800">{category.name}</span>
          </nav>

          {/* Category Banner */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-100 uppercase tracking-wider">
                  English Category
                </span>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  {category.name} Lessons
                </h1>
                <p className="mt-2 text-base text-slate-600 max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-8">
                <span className="text-3xl font-black text-emerald-700">
                  {posts.length}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Published Lessons
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Speaking Studios for Speaking Category */}
          {category.slug === 'speaking' && (
            <div className="space-y-10 my-8">
              <JamTopicStudio />
              <ShadowingStudio />
              <TongueTwisterStudio />
            </div>
          )}

          {/* Lessons Grid */}
          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                All {category.name} Lessons
              </h2>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Categories</span>
              </Link>
            </div>

            {posts.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <ArticleCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm">No lessons published yet in this category.</p>
              </div>
            )}
          </div>

          {/* Newsletter */}
          <div className="mt-16">
            <NewsletterCTA variant="card" />
          </div>
        </div>
      </main>
    </>
  );
}
