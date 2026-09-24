import React from 'react';
import { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact EnglishFlow',
  description: 'Have a question or suggestion? Reach out to the EnglishFlow team.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50/40 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <MessageSquare className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Get in Touch
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Have questions about a grammar lesson, partnership inquiry, or technical feedback?
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
