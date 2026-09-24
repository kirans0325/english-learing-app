import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Post } from '@/models/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils/date';

interface ArticleCardProps {
  post: Post;
  priority?: boolean;
}

const categoryVariantMap: Record<string, 'emerald' | 'indigo' | 'sky' | 'amber' | 'purple' | 'rose' | 'teal' | 'blue' | 'orange'> = {
  Grammar: 'emerald',
  Vocabulary: 'indigo',
  Speaking: 'sky',
  Pronunciation: 'amber',
  'Business English': 'purple',
  'Common Mistakes': 'rose',
  'Public Speaking': 'teal',
  'Business Writing': 'blue',
  'American Accent Practice': 'orange',
};

export function ArticleCard({ post, priority = false }: ArticleCardProps) {
  const badgeVariant = categoryVariantMap[post.category] || 'emerald';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
      {/* Featured Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="relative aspect-16/9 w-full overflow-hidden bg-slate-100"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={badgeVariant}>{post.category}</Badge>
        </div>
      </Link>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Metadata: Date and Reading Time */}
          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readingTime}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-3 text-lg font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="mt-2 text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="28px"
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-slate-700">
              {post.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
            aria-label={`Read lesson: ${post.title}`}
          >
            <span>Read</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
