'use client';

import React, { useState } from 'react';
import { Layers, Copy, Check, Terminal } from 'lucide-react';

interface DiagramCardProps {
  title?: string;
  subtitle?: string;
  category?: string;
  content: string;
}

export function DiagramCard({
  title = 'Architectural Blueprint',
  subtitle,
  category = 'Visual Illustration',
  content,
}: DiagramCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-slate-100 shadow-xl transition-all hover:border-slate-700">
      {/* Blueprint Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide">{title}</h4>
              <span className="hidden sm:inline-flex rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                {category}
              </span>
            </div>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/60 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition active:scale-95"
            title="Copy diagram illustration"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Blueprint</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Diagram Canvas */}
      <div className="relative p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm leading-relaxed font-mono text-emerald-300 selection:bg-emerald-500/30 selection:text-white">
        <pre className="whitespace-pre font-mono leading-relaxed">{content}</pre>
      </div>

      {/* Blueprint Footer Indicator */}
      <div className="flex items-center justify-between border-t border-slate-900/80 bg-slate-950/60 px-4 py-1.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Terminal className="h-3 w-3 text-emerald-500" />
          <span>EnglishFlow Visual Grammar Engine</span>
        </span>
        <span className="text-slate-600">Scroll horizontally if diagram exceeds mobile screen</span>
      </div>
    </div>
  );
}
