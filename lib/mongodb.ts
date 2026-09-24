import { MongoClient, Db, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'englishflow';

const options: MongoClientOptions = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function isMongoConfigured(): boolean {
  return !!uri && uri.trim() !== '' && !uri.includes('<username>');
}

if (isMongoConfigured()) {
  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri as string, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri as string, options);
    clientPromise = client.connect();
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (!isMongoConfigured() || !clientPromise) {
    return null;
  }
  try {
    return await clientPromise;
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error);
    return null;
  }
}

export async function getDatabase(): Promise<Db | null> {
  const mongoClient = await getMongoClient();
  if (!mongoClient) return null;
  return mongoClient.db(dbName);
}

let indexesInitialized = false;

/**
 * Initializes required MongoDB indexes for optimal query performance.
 * Called lazily or during seed.
 */
export async function ensureIndexes(): Promise<void> {
  if (indexesInitialized) return;
  const db = await getDatabase();
  if (!db) return;

  try {
    const postsCollection = db.collection('posts');
    await postsCollection.createIndex({ slug: 1 }, { unique: true });
    await postsCollection.createIndex({ category: 1, publishedAt: -1 });
    await postsCollection.createIndex({ status: 1, publishedAt: -1 });
    await postsCollection.createIndex({ tags: 1 });
    await postsCollection.createIndex(
      { title: 'text', excerpt: 'text', content: 'text' },
      { weights: { title: 10, excerpt: 5, content: 1 } }
    );

    const categoriesCollection = db.collection('categories');
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true });

    const quizzesCollection = db.collection('quizzes');
    await quizzesCollection.createIndex({ slug: 1 }, { unique: true });
    await quizzesCollection.createIndex({ category: 1 });

    const usersCollection = db.collection('users');
    await usersCollection.createIndex({ email: 1 }, { unique: true });

    const subscribersCollection = db.collection('newsletterSubscribers');
    await subscribersCollection.createIndex({ email: 1 }, { unique: true });

    const pdfDownloadsCollection = db.collection('pdf_downloads');
    await pdfDownloadsCollection.createIndex({ userId: 1, downloadDate: 1 });

    // Progressive curriculum ordering index
    await postsCollection.createIndex({ category: 1, difficultyOrder: 1, publishedAt: 1 });

    // Lightweight 30-day user history TTL collection (auto-purges after 30 days)
    const userHistoryCollection = db.collection('user_history');
    await userHistoryCollection.createIndex({ visitedAt: 1 }, { expireAfterSeconds: 30 * 86400, background: true });
    await userHistoryCollection.createIndex({ userId: 1, slug: 1 }, { unique: true });

    indexesInitialized = true;
  } catch (err) {
    console.warn('Index initialization notice:', err);
  }
}

export default clientPromise;
