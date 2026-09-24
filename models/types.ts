export type PostStatus = 'draft' | 'published';

export interface Author {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
}

export interface Post {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: string;
  status: PostStatus;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  postCount: number;
  color?: string;
}

export interface Tag {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed
  explanation: string;
}

export interface Quiz {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  questionCount: number;
  questions?: QuizQuestion[];
}

export interface NewsletterSubscriber {
  _id?: string;
  id?: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface DailyWord {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TrendingVocabulary {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  inTheNewsQuote: string;
}

export interface TrendingNewsStory {
  id: string;
  headline: string;
  source: string;
  category: 'Global Affairs' | 'Technology & AI' | 'Culture & Society' | 'Science & Environment' | 'Business & Markets';
  summary: string;
  keyTakeaway: string;
  vocabulary: TrendingVocabulary[];
  grammarFocus: {
    concept: string;
    explanation: string;
    sampleSentence: string;
  };
  jamTopic: {
    prompt: string;
    talkingPoints: string[];
    modelSpeech: string;
  };
}

export interface DailyTrendingDigest {
  _id?: string;
  date: string; // YYYY-MM-DD
  title: string;
  leadIntro: string;
  stories: TrendingNewsStory[];
  createdAt: string;
  expiresAt?: Date | string;
}

