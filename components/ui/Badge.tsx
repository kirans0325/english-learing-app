import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'indigo' | 'sky' | 'amber' | 'purple' | 'rose' | 'teal' | 'blue' | 'orange' | 'slate' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  sky: 'bg-sky-50 text-sky-700 border-sky-200/80',
  amber: 'bg-amber-50 text-amber-800 border-amber-200/80',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/80',
  teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
  blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/80',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  neutral: 'bg-neutral-100 text-neutral-800 border-neutral-200',
};

export function Badge({
  children,
  variant = 'emerald',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';
  const colorClass = variantStyles[variant] || variantStyles.emerald;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors ${colorClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
}
