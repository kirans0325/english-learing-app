import { Post, Category, Quiz, DailyWord, User } from '@/models/types';
import { CATEGORIES } from './curriculum/categories';
import { GRAMMAR_POSTS } from './curriculum/grammar';
import { VOCABULARY_POSTS } from './curriculum/vocabulary';
import { SPEAKING_POSTS } from './curriculum/speaking';
import { PRONUNCIATION_POSTS } from './curriculum/pronunciation';
import { BUSINESS_ENGLISH_POSTS } from './curriculum/business-english';
import { COMMON_MISTAKES_POSTS } from './curriculum/common-mistakes';
import { PUBLIC_SPEAKING_POSTS } from './curriculum/public-speaking';
import { BUSINESS_WRITING_POSTS } from './curriculum/business-writing';
import { AMERICAN_ACCENT_POSTS } from './curriculum/american-accent';
import { QUIZZES } from './curriculum/quizzes';

export const SAMPLE_CATEGORIES: Category[] = CATEGORIES;

export const SAMPLE_DAILY_WORD: DailyWord = {
  word: 'Reliable',
  phonetic: '/rɪˈlaɪ.ə.bəl/',
  partOfSpeech: 'Adjective',
  meaning: 'Consistently good in quality or performance; able to be trusted.',
  example: 'She is a reliable team member who always delivers high-quality work on time.',
  difficulty: 'Intermediate',
};

export const SAMPLE_POSTS: Post[] = [
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

export const SAMPLE_QUIZZES: Quiz[] = QUIZZES;

export const DEFAULT_ADMIN: User = {
  name: 'Admin Instructor',
  email: 'admin@englishflow.com',
  passwordHash: '$2a$10$wKz0b1K2Y6O7N0P0E3X5LeW5wT3cZ1F7G9H1J3K5L7M9N1P3Q5R7S', // bcrypt for 'admin123'
  role: 'admin',
  createdAt: '2026-01-01T00:00:00Z',
};
