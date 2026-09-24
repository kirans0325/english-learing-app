import { getDatabase, ensureIndexes } from '@/lib/mongodb';
import { User } from '@/models/types';
import { DEFAULT_ADMIN } from './seed-data';
import bcrypt from 'bcryptjs';

let memoryUsers: User[] = [DEFAULT_ADMIN];

export async function getUserByEmail(email: string): Promise<User | null> {
  const normalized = email.trim().toLowerCase();
  const db = await getDatabase();
  if (db) {
    try {
      await ensureIndexes();
      const collection = db.collection<User>('users');
      const user = await collection.findOne({ email: normalized });
      if (user) {
        return { ...user, _id: user._id?.toString() };
      }
    } catch (err) {
      console.warn('MongoDB getUserByEmail failed:', err);
    }
  }
  return memoryUsers.find((u) => u.email.toLowerCase() === normalized) || null;
}

export async function createUser(data: { name: string; email: string; password: string; role?: 'admin' | 'user' }): Promise<User> {
  const normalized = data.email.trim().toLowerCase();
  const existing = await getUserByEmail(normalized);
  if (existing) {
    throw new Error('A user with this email address already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(data.password, salt);

  const newUser: User = {
    name: data.name.trim(),
    email: normalized,
    passwordHash,
    role: data.role || 'user',
    createdAt: new Date().toISOString(),
  };

  const db = await getDatabase();
  if (db) {
    const collection = db.collection<any>('users');
    const result = await collection.insertOne(newUser);
    return { ...newUser, _id: result.insertedId.toString() };
  }

  const memUser = { ...newUser, _id: `usr-${Date.now()}` };
  memoryUsers.push(memUser);
  return memUser;
}

export async function verifyUserCredentials(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);
  if (!user || !user.passwordHash) {
    // Check if it's the default admin and default password fallback
    if (email.toLowerCase() === 'admin@englishflow.com' && password === 'admin123') {
      return DEFAULT_ADMIN;
    }
    return null;
  }

  // Check fallback for default admin
  if (user.email === 'admin@englishflow.com' && password === 'admin123') {
    return user;
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;

  return user;
}
