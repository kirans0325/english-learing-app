import { NextRequest, NextResponse } from 'next/server';
import { getPosts } from '@/lib/db/posts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  // Helper to fetch high-yield recommended lessons
  const getFallbackRecommendations = async () => {
    try {
      const { posts: featured } = await getPosts({
        featuredOnly: true,
        limit: 4,
        status: 'published',
      });
      if (featured.length > 0) return featured;
      const fallback = await getPosts({ limit: 4, status: 'published' });
      return fallback.posts;
    } catch {
      return [];
    }
  };

  if (!q.trim()) {
    const recommendations = await getFallbackRecommendations();
    return NextResponse.json({
      success: true,
      posts: [],
      recommendations,
    });
  }

  const { posts } = await getPosts({
    search: q.trim(),
    limit: 8,
    status: 'published',
  });

  const recommendations = posts.length === 0 ? await getFallbackRecommendations() : [];

  return NextResponse.json({
    success: true,
    posts,
    recommendations,
  });
}

