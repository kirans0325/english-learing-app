import { getDatabase, ensureIndexes } from '@/lib/mongodb';

export interface PdfDownloadRecord {
  _id?: string;
  userId: string;
  email: string;
  postSlug: string;
  postTitle?: string;
  downloadDate: string; // YYYY-MM-DD (UTC)
  createdAt: string;
}

// In-memory fallback for offline/development mode
const memoryDownloads: PdfDownloadRecord[] = [];

/**
 * Returns today's date formatted as YYYY-MM-DD in UTC
 */
export function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Checks if a user is eligible to download a PDF today (limit: 1 per user per day).
 */
export async function canUserDownloadPdf(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  downloadDate: string;
}> {
  if (!userId) {
    return { allowed: false, remaining: 0, downloadDate: getTodayDateString() };
  }

  const today = getTodayDateString();
  const db = await getDatabase();

  if (db) {
    try {
      await ensureIndexes();
      const collection = db.collection<PdfDownloadRecord>('pdf_downloads');
      const count = await collection.countDocuments({
        userId,
        downloadDate: today,
      });

      const allowed = count === 0;
      return {
        allowed,
        remaining: allowed ? 1 : 0,
        downloadDate: today,
      };
    } catch (err) {
      console.warn('MongoDB canUserDownloadPdf check failed, falling back to memory:', err);
    }
  }

  // In-memory fallback
  const count = memoryDownloads.filter(
    (d) => d.userId === userId && d.downloadDate === today
  ).length;

  const allowed = count === 0;
  return {
    allowed,
    remaining: allowed ? 1 : 0,
    downloadDate: today,
  };
}

/**
 * Records a PDF lesson download for the user. Strictly enforces 1 download/day.
 */
export async function recordPdfDownload(params: {
  userId: string;
  email: string;
  postSlug: string;
  postTitle?: string;
}): Promise<{
  success: boolean;
  remaining: number;
  message?: string;
}> {
  const { userId, email, postSlug, postTitle } = params;
  if (!userId) {
    return { success: false, remaining: 0, message: 'Authentication required.' };
  }

  const today = getTodayDateString();
  const quota = await canUserDownloadPdf(userId);

  if (!quota.allowed) {
    return {
      success: false,
      remaining: 0,
      message: 'Daily download quota reached. Free accounts can download 1 lesson PDF per day.',
    };
  }

  const record: PdfDownloadRecord = {
    userId,
    email,
    postSlug,
    postTitle: postTitle || postSlug,
    downloadDate: today,
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<PdfDownloadRecord>('pdf_downloads');
      await collection.insertOne(record);
      return { success: true, remaining: 0 };
    } catch (err) {
      console.warn('MongoDB recordPdfDownload failed, writing to memory:', err);
    }
  }

  memoryDownloads.push(record);
  return { success: true, remaining: 0 };
}
