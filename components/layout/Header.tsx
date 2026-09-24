'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  BookOpen,
  ArrowRight,
  User,
  GraduationCap,
} from 'lucide-react';
import { SearchModal } from '@/components/search/SearchModal';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Trending', href: '/trending' },
  { name: 'Grammar', href: '/category/grammar' },
  { name: 'Vocabulary', href: '/category/vocabulary' },
  { name: 'Speaking', href: '/category/speaking' },
  { name: 'Blog', href: '/blog' },
  { name: 'Practice', href: '/practice' },
];

export function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check auth status
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Global ⌘K shortcut listener across all routes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-2xs dark:border-slate-800 dark:bg-slate-950/90'
            : 'border-b border-transparent bg-white/80 backdrop-blur-sm dark:bg-slate-950/80'
        }`}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-xs transition group-hover:scale-105">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                English<span className="text-emerald-600 dark:text-emerald-400">Flow</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Spacious & Clean */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-2xs dark:bg-emerald-950/70 dark:text-emerald-300'
                      : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side actions - Clean & Spacious */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Login / User Status */}
            {user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/learn'}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="max-w-[85px] truncate">{user.name}</span>
                {user.role === 'admin' && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    Admin
                  </span>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-700 hover:text-emerald-700 px-2.5 py-2 dark:text-slate-300 dark:hover:text-emerald-400"
              >
                Login
              </Link>
            )}

            {/* Start Learning CTA */}
            <Link
              href="/#categories"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-700 active:scale-95"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition active:scale-95 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-5 shadow-xl transition-all duration-200 animate-in fade-in slide-in-from-top-2">
            <div className="mb-3 flex items-center justify-between px-2 py-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Appearance</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600">Theme</span>
                <ThemeToggle />
              </div>
            </div>

            <nav className="flex flex-col gap-1.5">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ArrowRight className={`h-4 w-4 transition-transform ${isActive ? 'text-emerald-600' : 'text-slate-300'}`} />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-slate-100 pt-4">
              {!user && (
                <Link
                  href="/login"
                  className="w-full text-center rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-98 transition"
                >
                  Log In
                </Link>
              )}
              <Link
                href="/#categories"
                className="w-full text-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-98 transition"
              >
                Start Learning Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
