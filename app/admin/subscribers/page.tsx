import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getSubscribers } from '@/lib/db/subscribers';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Users, Mail, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils/date';

export const dynamic = 'force-dynamic';

export default async function AdminSubscribersPage() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    redirect('/login');
  }

  const subscribers = await getSubscribers();

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Newsletter Subscribers</h1>
            <p className="text-xs text-slate-500">
              Users registered for daily English lessons.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
            <Users className="h-4 w-4 text-emerald-600" />
            <span>{subscribers.length} Active Readers</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Email Address</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Subscribed Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subscribers.map((sub, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{sub.email}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle className="h-3 w-3" />
                      <span>Subscribed</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">
                    {formatDate(sub.subscribedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
