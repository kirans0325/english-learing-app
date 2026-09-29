import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { Post } from '@/models/types';
import { SAMPLE_POSTS } from './seed-data';

// In-memory store for fallback when MongoDB Atlas is not yet connected
let memoryPosts: Post[] = [...SAMPLE_POSTS];

// Standard lean projection for article cards to minimize bandwidth and memory
export const CARD_PROJECTION = {
  _id: 1,
  title: 1,
  slug: 1,
  excerpt: 1,
  category: 1,
  tags: 1,
  author: 1,
  featuredImage: 1,
  publishedAt: 1,
  readingTime: 1,
  status: 1,
  featured: 1,
  difficulty: 1,
  difficultyOrder: 1,
};

export interface PostQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  status?: 'published' | 'draft' | 'all';
  search?: string;
  featuredOnly?: boolean;
  sortBy?: 'difficulty' | 'publishedAt' | 'latest';
}

/**
 * Multi-token relevance scoring algorithm for matching search queries against posts.
 * Prioritizes exact phrase matches, title matches, category and tag hits, and
 * rewards articles matching all query tokens.
 */
export function scorePostSearch(post: Post, rawQuery: string): number {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return 0;

  const title = (post.title || '').toLowerCase();
  const excerpt = (post.excerpt || '').toLowerCase();
  const category = (post.category || '').toLowerCase();
  const tags = (post.tags || []).map((t) => t.toLowerCase());
  const content = (post.content || '').toLowerCase();

  let score = 0;

  // Exact phrase match bonuses
  if (title === query) score += 200;
  else if (title.includes(query)) score += 100;

  if (category === query) score += 80;
  else if (category.includes(query)) score += 50;

  if (tags.some((t) => t === query)) score += 70;
  else if (tags.some((t) => t.includes(query))) score += 40;

  if (excerpt.includes(query)) score += 30;

  // Multi-token evaluation
  const tokens = query.split(/\s+/).filter(Boolean);
  let matchedTokens = 0;

  for (const token of tokens) {
    let tokenMatched = false;

    if (title.includes(token)) {
      score += 35;
      tokenMatched = true;
    }
    if (category.includes(token)) {
      score += 25;
      tokenMatched = true;
    }
    if (tags.some((t) => t.includes(token))) {
      score += 20;
      tokenMatched = true;
    }
    if (excerpt.includes(token)) {
      score += 15;
      tokenMatched = true;
    }
    if (content && content.includes(token)) {
      score += 5;
      tokenMatched = true;
    }

    if (tokenMatched) {
      matchedTokens++;
    }
  }

  // Significant boost if all tokens are represented in the article
  if (tokens.length > 1 && matchedTokens === tokens.length) {
    score += 50;
  }

  return score;
}

export async function getPosts(options: PostQueryOptions = {}): Promise<{
  posts: Post[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const {
    page = 1,
    limit = 6,
    category,
    tag,
    difficulty,
    status = 'published',
    search,
    featuredOnly,
    sortBy,
  } = options;

  const db = await getDatabase();

  if (db) {
    try {
      const collection = db.collection<Post>('posts');

      const filter: Record<string, any> = {};

      if (status !== 'all') {
        filter.status = status;
      }

      if (featuredOnly) {
        filter.featured = true;
      }

      if (category && typeof category === 'string') {
        const safeCategory = category.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const catPattern = safeCategory.replace(/[-\s]+/g, '[-\\s]+');
        filter.category = { $regex: new RegExp(`^${catPattern}$`, 'i') };
      }

      if (tag) {
        filter.tags = tag;
      }

      if (difficulty) {
        filter.difficulty = difficulty;
      }

      if (search && search.trim()) {
        const tokens = search.trim().split(/\s+/).filter(Boolean);
        const orClauses: Record<string, any>[] = [];

        // Exact phrase search
        const safeQuery = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        orClauses.push(
          { title: { $regex: safeQuery, $options: 'i' } },
          { excerpt: { $regex: safeQuery, $options: 'i' } },
          { category: { $regex: safeQuery, $options: 'i' } },
          { tags: { $regex: safeQuery, $options: 'i' } }
        );

        // Multi-token search for each word
        for (const token of tokens) {
          const safeToken = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          orClauses.push(
            { title: { $regex: safeToken, $options: 'i' } },
            { excerpt: { $regex: safeToken, $options: 'i' } },
            { category: { $regex: safeToken, $options: 'i' } },
            { tags: { $regex: safeToken, $options: 'i' } }
          );
        }

        if (orClauses.length > 0) {
          filter.$or = orClauses;
        }
      }

      const total = await collection.countDocuments(filter);
      const skip = (page - 1) * limit;

      const sortOptions: Record<string, any> =
        sortBy === 'difficulty' || (!sortBy && category)
          ? { difficultyOrder: 1, publishedAt: 1 }
          : { publishedAt: -1 };

      const cursor = collection
        .find(filter, { projection: CARD_PROJECTION })
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const rawPosts = await cursor.toArray();
      let posts: Post[] = rawPosts.map((p) => ({
        ...p,
        _id: p._id?.toString(),
      }));

      // Re-rank MongoDB results by search relevance score when searching
      if (search && search.trim()) {
        posts.sort((a, b) => scorePostSearch(b, search) - scorePostSearch(a, search));
      }

      return {
        posts,
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      };
    } catch (err) {
      console.warn('MongoDB getPosts query failed, falling back to cached sample data:', err);
    }
  }

  // Graceful in-memory fallback
  let filtered = memoryPosts.filter((p) => {
    if (status !== 'all' && p.status !== status) return false;
    if (featuredOnly && !p.featured) return false;
    if (difficulty && p.difficulty !== difficulty) return false;
    if (
      category &&
      p.category.toLowerCase().replace(/[-\s]+/g, '-') !==
        category.toLowerCase().replace(/[-\s]+/g, '-')
    ) {
      return false;
    }
    if (tag && !p.tags.some((t) => t.toLowerCase() === tag.toLowerCase())) return false;
    if (search && search.trim()) {
      return scorePostSearch(p, search) > 0;
    }
    return true;
  });

  if (search && search.trim()) {
    filtered.sort((a, b) => scorePostSearch(b, search) - scorePostSearch(a, search));
  } else if (sortBy === 'difficulty' || (!sortBy && category)) {
    filtered.sort((a, b) => {
      const orderA = a.difficultyOrder ?? (a.difficulty === 'Beginner' ? 1 : a.difficulty === 'Advanced' ? 3 : 2);
      const orderB = b.difficultyOrder ?? (b.difficulty === 'Beginner' ? 1 : b.difficulty === 'Advanced' ? 3 : 2);
      if (orderA !== orderB) return orderA - orderB;
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });
  } else {
    filtered.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  const total = filtered.length;
  const skip = (page - 1) * limit;
  const posts = filtered.slice(skip, skip + limit);

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getFeaturedPosts(limit = 6): Promise<Post[]> {
  const result = await getPosts({ featuredOnly: true, limit, status: 'published' });
  // If fewer than limit, fill with latest published
  if (result.posts.length < limit) {
    const additional = await getPosts({ limit, status: 'published' });
    const set = new Set(result.posts.map((p) => p.slug));
    const combined = [...result.posts];
    for (const p of additional.posts) {
      if (!set.has(p.slug) && combined.length < limit) {
        combined.push(p);
      }
    }
    return combined;
  }
  return result.posts;
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const result = await getPosts({ limit, status: 'published' });
  return result.posts;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Post>('posts');
      const post = await collection.findOne({ slug });
      if (post) {
        return {
          ...post,
          _id: post._id?.toString(),
        };
      }
    } catch (err) {
      console.warn('MongoDB getPostBySlug query failed, using memory fallback:', err);
    }
  }

  const found = memoryPosts.find((p) => p.slug === slug);
  return found || null;
}

export async function getRelatedPosts(category: string, currentSlug: string, limit = 3): Promise<Post[]> {
  const { posts } = await getPosts({ category, limit: limit + 1 });
  return posts.filter((p) => p.slug !== currentSlug).slice(0, limit);
}

export async function getAdjacentPosts(currentPublishedAt: string): Promise<{
  prev: Post | null;
  next: Post | null;
}> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Post>('posts');
      const prevDoc = await collection
        .find(
          { status: 'published', publishedAt: { $lt: currentPublishedAt } },
          { projection: { title: 1, slug: 1, category: 1 } }
        )
        .sort({ publishedAt: -1 })
        .limit(1)
        .next();

      const nextDoc = await collection
        .find(
          { status: 'published', publishedAt: { $gt: currentPublishedAt } },
          { projection: { title: 1, slug: 1, category: 1 } }
        )
        .sort({ publishedAt: 1 })
        .limit(1)
        .next();

      return {
        prev: prevDoc ? ({ ...prevDoc, _id: prevDoc._id?.toString() } as unknown as Post) : null,
        next: nextDoc ? ({ ...nextDoc, _id: nextDoc._id?.toString() } as unknown as Post) : null,
      };
    } catch (err) {
      console.warn('MongoDB getAdjacentPosts query failed:', err);
    }
  }

  const sorted = [...memoryPosts].sort(
    (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
  );
  const index = sorted.findIndex((p) => p.publishedAt === currentPublishedAt);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}

export async function createPost(postData: Omit<Post, '_id' | 'id'>): Promise<Post> {
  const db = await getDatabase();
  if (db) {
    const collection = db.collection('posts');
    const result = await collection.insertOne(postData);
    return {
      ...postData,
      _id: result.insertedId.toString(),
    };
  }

  const newPost: Post = {
    ...postData,
    _id: `mem-${Date.now()}`,
  };
  memoryPosts.unshift(newPost);
  return newPost;
}

export async function updatePost(slug: string, updateData: Partial<Post>): Promise<boolean> {
  const db = await getDatabase();
  if (db) {
    const collection = db.collection('posts');
    const result = await collection.updateOne(
      { slug },
      { $set: { ...updateData, updatedAt: new Date().toISOString() } }
    );
    return result.modifiedCount > 0;
  }

  const index = memoryPosts.findIndex((p) => p.slug === slug);
  if (index !== -1) {
    memoryPosts[index] = {
      ...memoryPosts[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return true;
  }
  return false;
}

export async function deletePost(slug: string): Promise<boolean> {
  const db = await getDatabase();
  if (db) {
    const collection = db.collection('posts');
    const result = await collection.deleteOne({ slug });
    return result.deletedCount > 0;
  }

  const initialLength = memoryPosts.length;
  memoryPosts = memoryPosts.filter((p) => p.slug !== slug);
  return memoryPosts.length < initialLength;
}
