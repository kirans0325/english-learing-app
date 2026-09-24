import { MongoClient } from 'mongodb';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import { CATEGORIES } from './data/categories.mjs';
import { GRAMMAR_POSTS } from './data/grammar.mjs';
import { VOCABULARY_POSTS } from './data/vocabulary.mjs';
import { SPEAKING_POSTS } from './data/speaking.mjs';
import { PRONUNCIATION_POSTS } from './data/pronunciation.mjs';
import { BUSINESS_ENGLISH_POSTS } from './data/business-english.mjs';
import { COMMON_MISTAKES_POSTS } from './data/common-mistakes.mjs';
import { PUBLIC_SPEAKING_POSTS } from './data/public-speaking.mjs';
import { BUSINESS_WRITING_POSTS } from './data/business-writing.mjs';
import { AMERICAN_ACCENT_POSTS } from './data/american-accent.mjs';
import { QUIZZES } from './data/quizzes.mjs';

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

const POSTS = [
  ...GRAMMAR_POSTS,
  ...VOCABULARY_POSTS,
  ...SPEAKING_POSTS,
  ...PRONUNCIATION_POSTS,
  ...BUSINESS_ENGLISH_POSTS,
  ...COMMON_MISTAKES_POSTS,
  ...PUBLIC_SPEAKING_POSTS,
  ...BUSINESS_WRITING_POSTS,
  ...AMERICAN_ACCENT_POSTS,
];

const ADMIN_USER = {
  name: 'Admin Instructor',
  email: 'admin@englishflow.com',
  passwordHash: '$2a$10$wKz0b1K2Y6O7N0P0E3X5LeW5wT3cZ1F7G9H1J3K5L7M9N1P3Q5R7S', // bcrypt for 'admin123'
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};

async function seed() {
  console.log(`Connecting to MongoDB Atlas at database: ${dbName}...`);
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 8000,
  });

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB Atlas cluster!');

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

    // Seed Categories
    console.log(`Seeding ${CATEGORIES.length} categories...`);
    for (const cat of CATEGORIES) {
      await categoriesCol.updateOne({ slug: cat.slug }, { $set: cat }, { upsert: true });
    }

    // Seed Posts
    console.log(`Seeding ${POSTS.length} lengthy lessons across all 9 categories...`);
    for (const post of POSTS) {
      await postsCol.updateOne({ slug: post.slug }, { $set: post }, { upsert: true });
    }

    // Prune stale / legacy placeholder posts so Atlas contains only the 49 active masterclasses
    const activeSlugs = POSTS.map((p) => p.slug);
    const deleteResult = await postsCol.deleteMany({ slug: { $nin: activeSlugs } });
    if (deleteResult.deletedCount > 0) {
      console.log(`✓ Pruned ${deleteResult.deletedCount} legacy/stale posts.`);
    }

    await postsCol.createIndex({ category: 1, difficultyOrder: 1, publishedAt: 1 });

    // Lightweight 30-day user history TTL collection (auto-purges after 30 days)
    const userHistoryCol = db.collection('user_history');
    await userHistoryCol.createIndex({ visitedAt: 1 }, { expireAfterSeconds: 30 * 86400, background: true });
    await userHistoryCol.createIndex({ userId: 1, slug: 1 }, { unique: true });

    // Seed Quizzes
    console.log(`Seeding ${QUIZZES.length} interactive practice quizzes...`);
    for (const quiz of QUIZZES) {
      await quizzesCol.updateOne({ slug: quiz.slug }, { $set: quiz }, { upsert: true });
    }

    // Seed Admin
    console.log('Seeding default administrator (admin@englishflow.com / admin123)...');
    await usersCol.updateOne({ email: ADMIN_USER.email }, { $set: ADMIN_USER }, { upsert: true });

    console.log('\n🎉 MongoDB Atlas successfully populated with FULL curriculum data!');
    console.log(`- Categories: ${await categoriesCol.countDocuments()}`);
    console.log(`- Posts: ${await postsCol.countDocuments()}`);
    console.log(`- Quizzes: ${await quizzesCol.countDocuments()}`);
    console.log(`- Users: ${await usersCol.countDocuments()}`);
  } catch (err) {
    console.error('❌ MongoDB Atlas Seeding Error:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
