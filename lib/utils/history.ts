'use client';

import { UserHistoryItem } from '@/models/types';

const STORAGE_KEY = 'englishflow_reading_history_v1';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_HISTORY_ITEMS = 50;

/**
 * Filter out any history items older than 30 days to keep storage lightweight.
 */
function pruneExpiredEntries(items: UserHistoryItem[]): UserHistoryItem[] {
  const cutoff = Date.now() - THIRTY_DAYS_MS;
  return items.filter((item) => {
    const timestamp = new Date(item.visitedAt).getTime();
    return !isNaN(timestamp) && timestamp >= cutoff;
  });
}

/**
 * Retrieve user's lightweight learning history for the past 30 days.
 */
export function get30DayHistory(): UserHistoryItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: UserHistoryItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const activeItems = pruneExpiredEntries(parsed);

    // If any items expired and were removed, write back the cleaned list
    if (activeItems.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeItems));
    }

    // Sort by latest visit
    return activeItems.sort(
      (a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime()
    );
  } catch (err) {
    console.warn('Failed to read user 30-day learning history:', err);
    return [];
  }
}

/**
 * Record a lesson visit. Keeps list within 30-day window and max 50 items.
 */
export function recordLessonVisit(post: {
  slug: string;
  title: string;
  category: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  readingTime?: string;
}): void {
  if (typeof window === 'undefined' || !post?.slug) return;

  try {
    const current = get30DayHistory();
    const existingIndex = current.findIndex((item) => item.slug === post.slug);

    const now = new Date().toISOString();
    let updatedItem: UserHistoryItem;

    if (existingIndex !== -1) {
      const existing = current[existingIndex];
      updatedItem = {
        ...existing,
        title: post.title || existing.title,
        category: post.category || existing.category,
        difficulty: post.difficulty || existing.difficulty,
        readingTime: post.readingTime || existing.readingTime,
        visitedAt: now,
      };
      current.splice(existingIndex, 1);
    } else {
      updatedItem = {
        slug: post.slug,
        title: post.title,
        category: post.category,
        difficulty: post.difficulty,
        readingTime: post.readingTime,
        visitedAt: now,
        completed: false,
      };
    }

    // Prepend to top
    const updatedList = [updatedItem, ...current].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Dispatch custom event for real-time reactive UI updates
    window.dispatchEvent(new CustomEvent('englishflow_history_updated', { detail: updatedList }));

    // Optional fire-and-forget sync to backend
    syncHistoryToServer(updatedItem);
  } catch (err) {
    console.warn('Failed to save lesson history:', err);
  }
}

/**
 * Mark a lesson as completed / uncompleted.
 */
export function toggleLessonCompleted(slug: string): boolean {
  if (typeof window === 'undefined' || !slug) return false;

  try {
    const current = get30DayHistory();
    const item = current.find((i) => i.slug === slug);
    if (!item) return false;

    const newCompleted = !item.completed;
    item.completed = newCompleted;
    item.completedAt = newCompleted ? new Date().toISOString() : undefined;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('englishflow_history_updated', { detail: current }));

    syncHistoryToServer(item);
    return newCompleted;
  } catch (err) {
    console.warn('Failed to toggle completion status:', err);
    return false;
  }
}

/**
 * Check if a specific lesson has been completed by the user.
 */
export function isLessonCompleted(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = get30DayHistory();
  return Boolean(current.find((i) => i.slug === slug)?.completed);
}

/**
 * Clear the user's 30-day history.
 */
export function clearUserHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('englishflow_history_updated', { detail: [] }));
  } catch (err) {
    console.warn('Failed to clear learning history:', err);
  }
}

/**
 * Calculate user summary statistics over the 30-day retention period.
 */
export function getHistoryStats() {
  const history = get30DayHistory();
  const completedCount = history.filter((h) => h.completed).length;

  const categories = new Set(history.map((h) => h.category));
  const uniqueDays = new Set(
    history.map((h) => new Date(h.visitedAt).toISOString().split('T')[0])
  );

  return {
    totalViewed: history.length,
    totalCompleted: completedCount,
    completionRate: history.length > 0 ? Math.round((completedCount / history.length) * 100) : 0,
    categoriesExplored: categories.size,
    daysActive: uniqueDays.size,
  };
}

/**
 * Lightweight fire-and-forget sync to optional backend endpoint
 */
async function syncHistoryToServer(item: UserHistoryItem) {
  try {
    // Only attempt if browser is online
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;
    await fetch('/api/user/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).catch(() => {
      // Ignore background fetch failures (e.g. guest or offline)
    });
  } catch {
    // No-op
  }
}
