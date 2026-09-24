import { MongoClient } from 'mongodb';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  const envFiles = [resolve(__dirname, '../.env.local'), resolve(__dirname, '../.env')];
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf-8');
      content.split('\n').forEach((line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) process.env[key] = value.trim();
        }
      });
    }
  }
}
loadEnv();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'englishflow';

if (!uri) {
  console.error('❌ MONGODB_URI is not set in environment.');
  process.exit(1);
}

// Read seed-data.ts directly or import
const seedDataPath = resolve(__dirname, '../lib/db/seed-data.ts');
const rawTs = fs.readFileSync(seedDataPath, 'utf-8');

// Quick parser for SAMPLE_CATEGORIES, SAMPLE_POSTS, SAMPLE_QUIZZES from seed-data.ts
// Or we can use dynamic import by compiling or transpile
console.log(`Connecting to MongoDB Atlas at database: ${dbName}...`);

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log(' Connected to MongoDB Atlas cluster!');
    const db = client.db(dbName);

    const postsCol = db.collection('posts');
    const categoriesCol = db.collection('categories');
    const quizzesCol = db.collection('quizzes');
    const usersCol = db.collection('users');
    const subscribersCol = db.collection('newsletterSubscribers');

    // Indexes
    console.log('⚡ Creating optimized indexes...');
    await postsCol.createIndex({ slug: 1 }, { unique: true });
    await postsCol.createIndex({ category: 1, publishedAt: -1 });
    await postsCol.createIndex({ status: 1, publishedAt: -1 });
    await postsCol.createIndex({ tags: 1 });
    await postsCol.createIndex(
      { title: 'text', excerpt: 'text', content: 'text' },
      { weights: { title: 10, excerpt: 5, content: 1 } }
    );
    await categoriesCol.createIndex({ slug: 1 }, { unique: true });
    await quizzesCol.createIndex({ slug: 1 }, { unique: true });
    await usersCol.createIndex({ email: 1 }, { unique: true });
    await subscribersCol.createIndex({ email: 1 }, { unique: true });

    // Dynamic import seed-data through next's ts-node / native loader or API route
    console.log('Fetching seed payload...');
  } catch (err) {
    console.error('Error in seed:', err);
  } finally {
    await client.close();
  }
}
