# EnglishFlow — Modern English Learning Platform & Blog

A modern, lightweight, high-performance English Learning Web Application built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **MongoDB Atlas** using the native MongoDB Node.js driver.

---

## 🌟 Key Features

- **Platform vs Traditional Blog**: Designed as a modern educational SaaS with interactive widgets, pronunciation audio, and self-evaluations.
- **Server Components by Default**: Zero client-side bloat. Client components are strictly isolated to interactive elements (quizzes, search drawer, mobile menu, authentication).
- **Fast Static Site Generation (SSG) & ISR**: 43+ pre-rendered pages with automatic background revalidation for sub-millisecond page loads.
- **Rich Interactive Learning Components**:
  - **Grammar Examples**: Real-time side-by-side comparison cards (Incorrect vs. Correct with clear rule explanations).
  - **Vocabulary Cards**: Phonetic transcriptions, contextual definitions, and native **Audio Pronunciation** powered by the Web Speech API.
  - **Interactive Quizzes**: Instant answer validation, detailed grammatical rationales, score summaries, and review modes.
  - **Daily English Section**: "Today's English" featuring word of the day, pronunciation, difficulty levels, and practice shortcuts.
- **Fast Server-Side Search**: Debounced search dialog triggered via Header or `⌘K` / `Ctrl+K` querying titles, categories, tags, and vocabulary with text indexes.
- **Curated Learning Hub & Categories**:
  - Grammar
  - Vocabulary
  - Speaking
  - Pronunciation
  - Business English
  - Common Mistakes
- **Protected Instructor / Admin Panel**:
  - Full article creation and markdown editor with specialized learning shortcode inserters (`:::grammar`, `:::vocab`, `:::quiz`).
  - Publishing, draft management, and homepage featured post toggles.
  - MongoDB Atlas health monitoring & on-demand seeding.
  - Newsletter subscriber roster.
- **Technical SEO & Core Web Vitals**:
  - Dynamic OpenGraph and Twitter/X card metadata.
  - Valid Schema.org JSON-LD structured data (`TechArticle`, `BreadcrumbList`, `WebSite`).
  - Native `sitemap.xml` and `robots.txt` generation.
  - Accessible semantic HTML with keyboard navigation.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (Strict mode) |
| **Styling** | Tailwind CSS v4 & @tailwindcss/typography |
| **Database** | MongoDB Atlas (Native `mongodb` Node.js Driver) |
| **Authentication** | Secure JWT session cookies with `jose` & `bcryptjs` |
| **Icons** | Lucide React + custom inline SVGs |
| **Fonts** | Next.js Font Optimization (`Plus Jakarta Sans` & `Inter`) |

---

## 📁 Project Architecture

```
english-learning-app/
├── app/
│   ├── layout.tsx              # Root layout with fonts, Header & Footer
│   ├── page.tsx                # Homepage (Hero, Categories, Featured, Daily Word, Quizzes)
│   ├── blog/
│   │   ├── page.tsx            # Archive with category filter, search, & pagination
│   │   └── [slug]/page.tsx     # Article page with TOC, learning blocks, related posts
│   ├── category/[slug]/        # Category-filtered lesson archives
│   ├── learn/                  # Structured learning roadmap & curriculum hub
│   ├── practice/
│   │   ├── page.tsx            # Quizzes directory
│   │   └── [slug]/page.tsx     # Interactive Quiz Runner
│   ├── admin/
│   │   ├── page.tsx            # Instructor metrics dashboard
│   │   ├── posts/              # Article management table
│   │   ├── posts/new/          # New lesson composer
│   │   └── subscribers/        # Newsletter subscriber roster
│   ├── api/
│   │   ├── search/             # Server-side search API
│   │   ├── newsletter/         # Newsletter subscription
│   │   ├── auth/               # Login, register, logout, session verification
│   │   └── admin/              # Admin CRUD and seed endpoints
│   ├── sitemap.ts              # Dynamic sitemap.xml
│   └── robots.ts               # Dynamic robots.txt
├── components/
│   ├── layout/                 # Header, Footer, Mobile Navigation
│   ├── blog/                   # ArticleCard, ArticleContent, TableOfContents, ShareButtons
│   ├── learning/               # GrammarExample, VocabularyCard, DailyWordCard, CategoryCard
│   ├── quiz/                   # QuizRunner, InlineQuizBlock
│   ├── search/                 # SearchModal (⌘K)
│   └── admin/                  # AdminLayout
├── lib/
│   ├── mongodb.ts              # Cached MongoClient singleton & index initializers
│   ├── auth/session.ts         # JWT session management
│   ├── db/                     # Data access layers (posts, categories, quizzes, users)
│   ├── seo/json-ld.tsx         # JSON-LD Schema generators
│   └── utils/                  # Reading time, date formatting, slugify
└── models/
    └── types.ts                # Strict TypeScript interfaces
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ (tested with v22)
- **npm** or **pnpm**

### 2. Installation

```bash
# Clone the repository
git clone <repo-url>
cd english-learning-app

# Install dependencies
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory (refer to `.env.example`):

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=englishflow

# Authentication Secret
JWT_SECRET=super-secret-jwt-key-englishflow-32-chars-min

# Base Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note on Zero-Configuration Fallback**: If `MONGODB_URI` is not set yet, EnglishFlow runs automatically with comprehensive in-memory seed data. As soon as you add your MongoDB Atlas URI, it seamlessly switches to live database queries.

### 4. Running Locally

```bash
# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Seeding MongoDB Atlas

Once you configure your `MONGODB_URI` in `.env.local`, seed the database with all 9 lessons, 6 categories, 3 interactive quizzes, and the default administrator:

```bash
npm run seed
```

Or trigger the seed action from the Admin Dashboard at `/admin`.

---

## 🔐 Demo Credentials

To access the protected Instructor Admin Dashboard (`/admin`):

- **Email**: `admin@englishflow.com`
- **Password**: `admin123`

---

## 🧪 Production Build & Verification

```bash
# Type-check
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```

---

## 📄 License
MIT License. Built for modern English language learning.
