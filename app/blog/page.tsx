import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getPosts, PostQueryOptions } from '@/lib/db/posts';
import { getCategories } from '@/lib/db/categories';
import { ArticleCard } from '@/components/blog/ArticleCard';
import { NewsletterCTA } from '@/components/blog/NewsletterCTA';
import { BookOpen, Search, ArrowLeft, ArrowRight, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'English Learning Articles & Lessons',
  description:
    'Browse our comprehensive library of English lessons covering grammar, vocabulary, spoken English, and common mistakes.',
};

export const revalidate = 60;

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    tag?: string;
    search?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1', 10);
  const activeCategory = params.category;
  const activeTag = params.tag;
  const searchQuery = params.search;

  const queryOptions: PostQueryOptions = {
    page: currentPage,
    limit: 6,
    category: activeCategory,
    tag: activeTag,
    search: searchQuery,
    status: 'published',
  };

  const [{ posts, total, totalPages }, categories] = await Promise.all([
    getPosts(queryOptions),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen bg-slate-50/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <BookOpen className="h-4 w-4" />
            <span>Curated Knowledge Library</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            English Learning Articles
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Discover in-depth explanations, real conversations, and practical tips designed to accelerate your fluency.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          {/* Categories Pill Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <Link
              href="/blog"
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                !activeCategory
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Articles
            </Link>
            {categories.map((cat) => {
              const isSelected = activeCategory?.toLowerCase() === cat.slug.toLowerCase();
              return (
                <Link
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Active Search / Filter State indicator */}
          {(searchQuery || activeCategory || activeTag) && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Filtering results:</span>
              <span className="font-semibold text-slate-900">
                {searchQuery ? `"${searchQuery}"` : activeCategory || activeTag}
              </span>
              <Link
                href="/blog"
                className="text-emerald-700 hover:underline font-bold ml-1"
              >
                Clear
              </Link>
            </div>
          )}
        </div>

        {/* Articles Grid */}
        {posts.length > 0 ? (
          <>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, idx) => (
                <ArticleCard key={post.slug} post={post} priority={idx === 0} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}${activeCategory ? `&category=${activeCategory}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </span>
                )}

                <span className="text-xs font-semibold text-slate-600 px-2">
                  Page {currentPage} of {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}${activeCategory ? `&category=${activeCategory}` : ''}${searchQuery ? `&search=${searchQuery}` : ''}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-400 cursor-not-allowed">
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="my-16 rounded-3xl border border-slate-200 bg-white p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-lg font-bold text-slate-900">
              No lessons matched your criteria
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search terms or selecting a different category.
            </p>
            <div className="mt-5">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              >
                Reset All Filters
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter Callout */}
        <div className="mt-16">
          <NewsletterCTA variant="inline" />
        </div>
      </div>
    </main>
  );
}
