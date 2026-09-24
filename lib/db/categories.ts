import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { Category } from '@/models/types';
import { SAMPLE_CATEGORIES } from './seed-data';

let memoryCategories: Category[] = [...SAMPLE_CATEGORIES];

export async function getCategories(): Promise<Category[]> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<Category>('categories');
      const docs = await collection.find({}).toArray();
      if (docs.length > 0) {
        return docs.map((c) => ({ ...c, _id: c._id?.toString() }));
      }
    } catch (err) {
      console.warn('MongoDB getCategories failed, falling back to cached categories:', err);
    }
  }
  return memoryCategories;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function createCategory(cat: Omit<Category, '_id' | 'id'>): Promise<Category> {
  const db = await getDatabase();
  if (db) {
    const collection = db.collection('categories');
    const result = await collection.insertOne(cat);
    return { ...cat, _id: result.insertedId.toString() };
  }
  const newCat = { ...cat, _id: `cat-${Date.now()}` };
  memoryCategories.push(newCat);
  return newCat;
}
