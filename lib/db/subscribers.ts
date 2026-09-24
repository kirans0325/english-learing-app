import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { NewsletterSubscriber } from '@/models/types';

let memorySubscribers: NewsletterSubscriber[] = [
  { email: 'alex.learner@example.com', subscribedAt: '2026-03-01T10:00:00Z', active: true },
  { email: 'maria.studies@example.com', subscribedAt: '2026-03-05T14:30:00Z', active: true },
];

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const normalized = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const db = await getDatabase();
  if (db) {
    try {
      await ensureIndexes();
      const collection = db.collection<NewsletterSubscriber>('newsletterSubscribers');
      const existing = await collection.findOne({ email: normalized });
      if (existing) {
        return { success: true, message: 'You are already subscribed to EnglishFlow!' };
      }
      await collection.insertOne({
        email: normalized,
        subscribedAt: new Date().toISOString(),
        active: true,
      });
      return { success: true, message: 'Thank you for subscribing! Check your inbox for your first lesson.' };
    } catch (err: any) {
      if (err.code === 11000) {
        return { success: true, message: 'You are already subscribed!' };
      }
      console.warn('MongoDB subscriber save failed, saving in memory:', err);
    }
  }

  if (memorySubscribers.some((s) => s.email === normalized)) {
    return { success: true, message: 'You are already subscribed!' };
  }

  memorySubscribers.unshift({
    email: normalized,
    subscribedAt: new Date().toISOString(),
    active: true,
  });

  return { success: true, message: 'Thank you for subscribing! Check your inbox for your first lesson.' };
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  const db = await getDatabase();
  if (db) {
    try {
      const collection = db.collection<NewsletterSubscriber>('newsletterSubscribers');
      const docs = await collection.find({}).sort({ subscribedAt: -1 }).toArray();
      return docs.map((d) => ({ ...d, _id: d._id?.toString() }));
    } catch (err) {
      console.warn('MongoDB getSubscribers failed:', err);
    }
  }
  return memorySubscribers;
}
