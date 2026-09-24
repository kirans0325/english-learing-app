import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getPosts } from '@/lib/db/posts';
import { getCategories } from '@/lib/db/categories';
import { getQuizzes } from '@/lib/db/quizzes';
import { getSubscribers } from '@/lib/db/subscribers';
import { isMongoConfigured } from '@/lib/mongodb';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  FileText,
  Layers,
  HelpCircle,
  Users,
  PlusCircle,
  Database,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const [postsData, categories, quizzes, subscribers] = await Promise.all([
    getPosts({ status: 'all', limit: 10 }),
    getCategories(),
    getQuizzes(),
    getSubscribers(),
  ]);

  const isConnected = isMongoConfigured();

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Top welcome */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Instructor Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Logged in as <span className="font-semibold text-slate-800">{session.name}</span> ({session.email})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>New Lesson</span>
            </Link>
          </div>
        </div>

        {/* Database Connection Status Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  {isConnected ? 'MongoDB Atlas Configured' : 'Development Fallback Mode (Memory)'}
                </h3>
                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isConnected
                  ? 'Connected to your Atlas cluster with indexing and connection pooling active.'
                  : 'Add MONGODB_URI to .env.local to persist data directly to MongoDB Atlas.'}
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Lessons</span>
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{postsData.total}</p>
            <p className="mt-1 text-xs text-slate-500">Grammar & Vocabulary articles</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Categories</span>
              <Layers className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{categories.length}</p>
            <p className="mt-1 text-xs text-slate-500">Learning tracks available</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Quizzes</span>
              <HelpCircle className="h-5 w-5 text-sky-600" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{quizzes.length}</p>
            <p className="mt-1 text-xs text-slate-500">Practice tests published</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Subscribers</span>
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="mt-3 text-3xl font-extrabold text-slate-900">{subscribers.length}</p>
            <p className="mt-1 text-xs text-slate-500">Daily newsletter readers</p>
          </div>
        </div>

        {/* Recent Lessons Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Recent Lessons</h3>
            <Link
              href="/admin/posts"
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              Manage All &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {postsData.posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900 max-w-xs truncate">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-emerald-700">
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-600">
                      {post.category}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {post.featured ? (
                        <span className="text-emerald-600 font-semibold">Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
