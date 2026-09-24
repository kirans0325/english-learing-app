'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-8 text-center text-emerald-900">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600 mb-3" />
        <h3 className="text-lg font-bold">Message Received!</h3>
        <p className="mt-1 text-xs text-emerald-700">
          Thank you for reaching out, {name}. Our academic and support team will reply within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Your Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            className="mt-1.5 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Message
        </label>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we assist you with your English learning?"
          className="mt-1.5 w-full rounded-xl border border-slate-300 p-4 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden"
        />
      </div>

      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95 transition"
      >
        <Send className="h-3.5 w-3.5" />
        <span>Send Message</span>
      </button>
    </form>
  );
}
