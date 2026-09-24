import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  MessageSquare,
  Volume2,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  Mic,
  FileText,
  Radio,
} from 'lucide-react';
import { Category } from '@/models/types';

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Sparkles,
  MessageSquare,
  Volume2,
  Briefcase,
  AlertTriangle,
  Mic,
  FileText,
  Radio,
};

const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-100',
    hover: 'group-hover:border-emerald-300',
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-100',
    hover: 'group-hover:border-indigo-300',
  },
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    border: 'border-sky-100',
    hover: 'group-hover:border-sky-300',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-100',
    hover: 'group-hover:border-amber-300',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-100',
    hover: 'group-hover:border-purple-300',
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-100',
    hover: 'group-hover:border-rose-300',
  },
  teal: {
    bg: 'bg-teal-50',
    text: 'text-teal-700',
    border: 'border-teal-100',
    hover: 'group-hover:border-teal-300',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-100',
    hover: 'group-hover:border-blue-300',
  },
  orange: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-100',
    hover: 'group-hover:border-orange-300',
  },
};

export function CategoryCard({ category }: { category: Category }) {
  const IconComponent = iconMap[category.icon] || BookOpen;
  const colorTheme = colorMap[category.color || 'emerald'] || colorMap.emerald;

  return (
    <Link
      href={`/category/${category.slug}`}
      className={`group relative flex flex-col justify-between rounded-2xl border ${colorTheme.border} bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${colorTheme.hover}`}
    >
      <div>
        <div className="flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorTheme.bg} ${colorTheme.text} transition-transform duration-200 group-hover:scale-105`}
          >
            <IconComponent className="h-6 w-6" />
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            {category.postCount} {category.postCount === 1 ? 'lesson' : 'lessons'}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
          {category.name}
        </h3>

        <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {category.description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-slate-900 group-hover:text-emerald-700">
        <span>Explore Lessons</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
