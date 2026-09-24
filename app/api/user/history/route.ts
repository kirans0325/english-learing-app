import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { getSession } from '@/lib/auth/session';

/**
 * POST /api/user/history
 * Lightweight endpoint to optionally sync a reading item with a 30-day auto-expiring TTL index.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json().catch(() => null);

    if (!body || !body.slug) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const db = await getDatabase();
    if (!db) {
      // Memory mode or offline - success without persistence
      return NextResponse.json({ success: true, mode: 'local' });
    }

    const historyCol = db.collection('user_history');

    // Ensure 30-day TTL index exists (2592000 seconds = 30 days)
    await historyCol.createIndex(
      { visitedAt: 1 },
      { expireAfterSeconds: 30 * 86400, background: true }
    ).catch(() => {});

    // Ensure unique index per user/guest session + slug
    const userId = session?.email || session?.userId || 'guest_user';
    const visitedDate = new Date(body.visitedAt || Date.now());

    await historyCol.updateOne(
      { userId, slug: body.slug },
      {
        $set: {
          userId,
          slug: body.slug,
          title: body.title,
          category: body.category,
          difficulty: body.difficulty,
          readingTime: body.readingTime,
          completed: Boolean(body.completed),
          completedAt: body.completedAt ? new Date(body.completedAt) : undefined,
          visitedAt: visitedDate,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/user/history
 * Fetch 30-day history for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const userId = session?.email || session?.userId;

    if (!userId) {
      return NextResponse.json({ history: [] });
    }

    const db = await getDatabase();
    if (!db) {
      return NextResponse.json({ history: [] });
    }

    const historyCol = db.collection('user_history');
    const items = await historyCol
      .find({ userId })
      .sort({ visitedAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({
      history: items.map((item) => ({
        slug: item.slug,
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        readingTime: item.readingTime,
        visitedAt: item.visitedAt ? new Date(item.visitedAt).toISOString() : new Date().toISOString(),
        completed: Boolean(item.completed),
        completedAt: item.completedAt ? new Date(item.completedAt).toISOString() : undefined,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
