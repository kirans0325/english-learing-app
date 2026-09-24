import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getPosts, createPost } from '@/lib/db/posts';
import { calculateReadingTime } from '@/lib/utils/reading-time';
import { slugify } from '@/lib/utils/slugify';

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await getPosts({ status: 'all', limit: 50 });
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, excerpt, content, category, tags, featuredImage, status, featured } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Title, content, and category are required.' },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const readingTime = calculateReadingTime(content);
    const now = new Date().toISOString();

    const newPost = await createPost({
      title,
      slug,
      excerpt: excerpt || title,
      content,
      category,
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : [],
      author: {
        name: session.name || 'Admin Instructor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Senior ESL Curriculum Specialist',
      },
      featuredImage:
        featuredImage ||
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
      publishedAt: now,
      updatedAt: now,
      readingTime,
      status: status || 'published',
      featured: !!featured,
      seoTitle: `${title} | EnglishFlow`,
      seoDescription: excerpt || title,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: any) {
    console.error('Error creating post:', err);
    return NextResponse.json({ error: err.message || 'Failed to create post' }, { status: 500 });
  }
}
