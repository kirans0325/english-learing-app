'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Printer,
  FileDown,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';

interface PrintPdfButtonProps {
  postSlug: string;
  postTitle: string;
}

export function PrintPdfButton({ postSlug, postTitle }: PrintPdfButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [dailyQuotaAllowed, setDailyQuotaAllowed] = useState<boolean | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Check quota & auth status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/pdf/download');
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(data.authenticated);
          setDailyQuotaAllowed(data.allowed);
          if (data.user?.email) {
            setUserEmail(data.user.email);
          }
        }
      } catch {
        // Fallback silently if offline
      }
    }
    checkStatus();
  }, []);

  const handleDownload = async () => {
    // 1. If not authenticated, open login prompt modal
    if (isAuthenticated === false) {
      setShowLoginModal(true);
      return;
    }

    // 2. If quota already exhausted today
    if (dailyQuotaAllowed === false) {
      setShowQuotaModal(true);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/pdf/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: postSlug, title: postTitle }),
      });

      const data = await res.json();

      if (res.status === 401) {
        setIsAuthenticated(false);
        setShowLoginModal(true);
        setLoading(false);
        return;
      }

      if (res.status === 429 || !data.success) {
        setDailyQuotaAllowed(false);
        setErrorMessage(data.message || 'Daily download quota of 1 PDF per day reached.');
        setShowQuotaModal(true);
        setLoading(false);
        return;
      }

      // Success: Quota consumed, apply watermark and trigger native print/PDF save
      setDailyQuotaAllowed(false);
      setDownloadSuccess(true);

      // Inject watermark data to the print layout
      const printContainer = document.getElementById('lesson-print-container');
      if (printContainer) {
        printContainer.setAttribute(
          'data-watermark-text',
          data.watermarkText || `EnglishFlow • Licensed to ${data.user?.email || 'Student'}`
        );
      }

      // Short delay for DOM render before launching print dialog
      setTimeout(() => {
        window.print();
        setLoading(false);
      }, 300);
    } catch (err: any) {
      console.error('Download PDF error:', err);
      setErrorMessage('Could not initiate PDF generation. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleDownload}
          disabled={loading}
          className={`group flex items-center justify-between gap-3 w-full rounded-xl px-4 py-3 text-xs font-semibold shadow-xs transition-all ${
            dailyQuotaAllowed === false
              ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/10'
          }`}
          title={
            dailyQuotaAllowed === false
              ? 'Daily 1-lesson quota reached for today'
              : 'Save or Print this lesson with EnglishFlow watermark'
          }
        >
          <span className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : dailyQuotaAllowed === false ? (
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            ) : (
              <FileDown className="h-4 w-4 transition group-hover:-translate-y-0.5" />
            )}
            <span>
              {loading
                ? 'Preparing Watermarked PDF...'
                : dailyQuotaAllowed === false
                ? 'Downloaded Today (1/Day Quota)'
                : 'Download / Print PDF'}
            </span>
          </span>

          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              dailyQuotaAllowed === false
                ? 'bg-slate-200 text-slate-700'
                : 'bg-emerald-500/30 text-emerald-50 border border-emerald-400/40'
            }`}
          >
            {dailyQuotaAllowed === false ? 'Quota: 0/1' : '1 Free/Day'}
          </span>
        </button>

        <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
          <Printer className="h-3 w-3" />
          <span>Includes EnglishFlow Watermark & Exercises</span>
        </p>
      </div>

      {/* Modal: Login Required */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-slate-900">
              Sign In to Download Lesson PDF
            </h3>
            <p className="mt-2 text-center text-xs text-slate-600 leading-relaxed">
              To keep our learning materials high quality and prevent automated scraping,
              lesson PDF downloads with the official <strong>EnglishFlow watermark</strong> are
              available exclusively to registered members (1 free download per day).
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                onClick={() => router.push(`/login?redirect=/blog/${postSlug}`)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                Sign In to Your Account
              </button>
              <button
                onClick={() => router.push(`/login?tab=register&redirect=/blog/${postSlug}`)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Create a Free Student Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Daily Quota Limit Reached */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <button
              onClick={() => setShowQuotaModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-center text-lg font-bold text-slate-900">
              Daily PDF Download Limit Reached
            </h3>
            <p className="mt-2 text-center text-xs text-slate-600 leading-relaxed">
              {errorMessage ||
                'Free accounts can download 1 printable lesson PDF per day. Your quota resets at midnight UTC.'}
            </p>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
              <p className="text-[11px] text-slate-500">
                You can still read, study, and complete quizzes for all lessons online anytime!
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowQuotaModal(false)}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Got It, Return to Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
