import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { SAMPLE_CATEGORIES, SAMPLE_POSTS, SAMPLE_QUIZZES, DEFAULT_ADMIN } from './seed-data';

export async function seedDatabase(force = false): Promise<{
  success: boolean;
  message: string;
  counts: { posts: number; categories: number; quizzes: number; users: number };
}> {
  const db = await getDatabase();
  if (!db) {
    return {
      success: false,
      message: 'MongoDB is not connected. In-memory sample data is active.',
      counts: {
        posts: SAMPLE_POSTS.length,
        categories: SAMPLE_CATEGORIES.length,
        quizzes: SAMPLE_QUIZZES.length,
        users: 1,
      },
    };
  }

  await ensureIndexes();

  const postsCol = db.collection('posts');
  const categoriesCol = db.collection('categories');
  const quizzesCol = db.collection('quizzes');
  const usersCol = db.collection('users');

  const existingPostsCount = await postsCol.countDocuments();

  if (existingPostsCount > 0 && !force) {
    return {
      success: true,
      message: 'Database is already populated.',
      counts: {
        posts: existingPostsCount,
        categories: await categoriesCol.countDocuments(),
        quizzes: await quizzesCol.countDocuments(),
        users: await usersCol.countDocuments(),
      },
    };
  }

  if (force) {
    await postsCol.deleteMany({});
    await categoriesCol.deleteMany({});
    await quizzesCol.deleteMany({});
    await usersCol.deleteMany({});
  }

  // Insert categories
  for (const cat of SAMPLE_CATEGORIES) {
    await categoriesCol.updateOne({ slug: cat.slug }, { $set: cat }, { upsert: true });
  }

  // Insert posts
  for (const post of SAMPLE_POSTS) {
    await postsCol.updateOne({ slug: post.slug }, { $set: post }, { upsert: true });
  }

  // Insert quizzes
  for (const quiz of SAMPLE_QUIZZES) {
    await quizzesCol.updateOne({ slug: quiz.slug }, { $set: quiz }, { upsert: true });
  }

  // Insert default admin
  await usersCol.updateOne({ email: DEFAULT_ADMIN.email }, { $set: DEFAULT_ADMIN }, { upsert: true });

  const finalPosts = await postsCol.countDocuments();
  const finalCategories = await categoriesCol.countDocuments();
  const finalQuizzes = await quizzesCol.countDocuments();
  const finalUsers = await usersCol.countDocuments();

  return {
    success: true,
    message: 'MongoDB Atlas successfully seeded with lessons, categories, quizzes, and default administrator!',
    counts: {
      posts: finalPosts,
      categories: finalCategories,
      quizzes: finalQuizzes,
      users: finalUsers,
    },
  };
}
