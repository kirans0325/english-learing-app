'use client';

import React from 'react';
import { ListFilter } from 'lucide-react';

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  // Extract all ## and ### headings
  const headings = Array.from(content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((m) => {
    const level = m[1].length;
    const title = m[2].trim();
    const id = title.toLowerCase().replace(/[^\w]+/g, '-');
    return { level, title, id };
  });

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 shadow-2xs"
    >
      <div className="flex items-center gap-2 border-b border-slate-200/70 pb-3 text-xs font-bold uppercase tracking-wider text-slate-700">
        <ListFilter className="h-4 w-4 text-emerald-600" />
        <span>In this lesson</span>
      </div>

      <ul className="mt-3 space-y-2 text-sm">
        {headings.map((h, idx) => (
          <li
            key={idx}
            className={`${h.level === 3 ? 'pl-4 text-xs' : 'font-medium'}`}
          >
            <a
              href={`#${h.id}`}
              className="text-slate-600 transition-colors hover:text-emerald-700 hover:underline"
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
