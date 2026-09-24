import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/db/posts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ posts: [] });
  }

  const { posts } = await getPosts({
    search: q.trim(),
    limit: 8,
    status: 'published',
  });

  return NextResponse.json({ posts });
}
