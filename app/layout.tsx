import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChatbotWidget } from '@/components/chat/ChatbotWidget';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://englishflow.com';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'EnglishFlow | Improve Your English, One Lesson at a Time',
    template: '%s | EnglishFlow',
  },
  description:
    'Modern, lightweight English learning platform featuring practical grammar guides, essential vocabulary, spoken English phrases, and interactive quizzes.',
  keywords: [
    'Learn English',
    'English Grammar',
    'English Vocabulary',
    'Spoken English',
    'Business English',
    'English Quizzes',
    'ESL Lessons',
    'Common English Mistakes',
  ],
  authors: [{ name: 'EnglishFlow Editorial Team' }],
  creator: 'EnglishFlow',
  publisher: 'EnglishFlow',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'EnglishFlow',
    title: 'EnglishFlow | Modern English Learning Platform',
    description:
      'Learn practical English through simple explanations, real examples, vocabulary, grammar lessons and daily practice.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'EnglishFlow Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EnglishFlow | Improve Your English',
    description:
      'Master English grammar, vocabulary, and confident conversation with clean, bite-sized lessons.',
    images: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('englishflow_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'dark' || (!stored && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-800 antialiased selection:bg-emerald-100 selection:text-emerald-900 dark:bg-slate-950 dark:text-slate-100">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
