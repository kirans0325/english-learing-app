import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { Quiz } from '@/models/types';
import { SAMPLE_QUIZZES } from './seed-data';

let memoryQuizzes: Quiz[] = [...SAMPLE_QUIZZES];

export async function getQuizzes(filter: { category?: string; difficulty?: string } = {}): Promise<Quiz[]> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Quiz>('quizzes');
      const query: Record<string, any> = {};
      if (filter.category) {
        query.category = { $regex: new RegExp(`^${filter.category}$`, 'i') };
      }
      if (filter.difficulty) {
        query.difficulty = filter.difficulty;
      }
      const docs = await collection.find(query).toArray();
      if (docs.length > 0) {
        return docs.map((q) => ({ ...q, _id: q._id?.toString() }));
      }
    } catch (err) {
      console.warn('MongoDB getQuizzes failed, falling back to cached quizzes:', err);
    }
  }

  return memoryQuizzes.filter((q) => {
    if (filter.category && q.category.toLowerCase() !== filter.category.toLowerCase()) return false;
    if (filter.difficulty && q.difficulty !== filter.difficulty) return false;
    return true;
  });
}

export async function getQuizBySlug(slug: string): Promise<Quiz | null> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Quiz>('quizzes');
      const doc = await collection.findOne({ slug });
      if (doc) {
        return { ...doc, _id: doc._id?.toString() };
      }
    } catch (err) {
      console.warn('MongoDB getQuizBySlug failed:', err);
    }
  }
  return memoryQuizzes.find((q) => q.slug === slug) || null;
}
