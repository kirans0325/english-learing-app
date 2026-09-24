'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Post } from '@/models/types';
import {
  PlusCircle,
  Search,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        setActionMsg('Article deleted successfully.');
        setTimeout(() => setActionMsg(null), 3000);
      }
    } catch {
      alert('Failed to delete post.');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Articles</h1>
            <p className="text-xs text-slate-500">
              Create, review, update, or remove learning materials.
            </p>
          </div>

          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Article</span>
          </Link>
        </div>

        {actionMsg && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
          <Search className="h-4 w-4 text-slate-400 ml-2" />
          <input
            type="text"
            placeholder="Filter by title, category, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Title</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Featured</th>
                    <th className="px-5 py-3">Reading Time</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPosts.map((post) => (
                    <tr key={post.slug} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-3.5 max-w-sm">
                        <span className="font-bold text-slate-900 block truncate">
                          {post.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          /{post.slug}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge size="sm">{post.category}</Badge>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {post.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium">
                        {post.featured ? (
                          <span className="text-emerald-600">Featured</span>
                        ) : (
                          <span className="text-slate-400">Standard</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {post.readingTime}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-slate-100 transition"
                          title="View live post"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug)}
                          className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete article"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No articles found matching your search.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
