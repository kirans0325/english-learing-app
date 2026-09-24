import { NextRequest, NextResponse } from 'next/server';

// Strict token blocklist to sanitize responses and prevent credential exfiltration
const SENSITIVE_PATTERNS = [
  /admin123/gi,
  /cluster0/gi,
  /mongodb\+srv/gi,
  /JWT_SECRET/gi,
  /super-secret/gi,
  /passwordHash/gi,
  /\$2[ab]\$[0-9]{2}\$[A-Za-z0-9./]{53}/g, // bcrypt hashes
  /process\.env/gi,
  /admin@englishflow\.com/gi,
];

// Aggressive prompt injection and exfiltration patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /reveal\s+(the\s+)?(admin|password|credentials|secret|database)/i,
  /what\s+is\s+(the\s+)?(admin\s+password|admin\s+login|jwt\s+secret|mongodb)/i,
  /show\s+(me\s+)?(all\s+)?(passwords|users|env|environment|credentials)/i,
  /developer\s+mode/i,
  /dan\s+mode/i,
  /jailbreak/i,
  /dump\s+(database|users|collection)/i,
  /drop\s+(database|table|collection)/i,
];

// Simple in-memory rate limiter per IP: max 25 queries per 5 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 25) {
    return false;
  }
  entry.count += 1;
  return true;
}

/**
 * Knowledge Base & Context-Aware English Learning AI Tutor
 */
function generateTutorResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  // 1. Sentence correction request
  if (
    lower.includes('correct') ||
    lower.includes('check my') ||
    lower.includes('mistake') ||
    lower.includes('fix this')
  ) {
    if (lower.includes('he go to') || lower.includes('he dont')) {
      return `### 🔍 Grammar Correction & Analysis

**Original:** "${userMessage}"

**Corrected Version:**
> "He **goes** to..." (or "He **doesn't**...")

**Explanation:**
- In the Present Simple tense, third-person singular subjects (*he, she, it*) require the **-s / -es** ending: *He goes*, *She works*, *It takes*.
- For negatives, use **does not (doesn't)** instead of *don't*: *He doesn't know*.

**Practice Example:**
- ❌ *He go to work by bus every day.*
- ✅ *He goes to work by bus every day.*

Would you like to try writing another sentence for me to review?`;
    }

    if (lower.includes('i am agree') || lower.includes('i am agreed')) {
      return `### 🔍 Common Mistake Alert!

**Correction:**
> Say: **"I agree"** or **"I agree with you."**
> Avoid: ❌ *"I am agree."*

**Why?**
"Agree" is already an active verb in English, not an adjective!
- ✅ *I agree with your proposal.*
- ✅ *She agrees that we need more practice.*
- ❌ *I am agreeing with you* (rare; used only for continuous progression).

**Opposite:**
- ✅ *I disagree.* (or *I don't agree.*)`;
    }

    return `### ✍️ Sentence Review & Feedback

Here is how to ensure your sentence is clear and grammatically sound:

1. **Subject-Verb Agreement**: Check that singular subjects match singular verbs (e.g., *The team is*, *She speaks*).
2. **Tense Consistency**: Keep verb tenses consistent throughout the sentence unless indicating a deliberate time shift.
3. **Punctuation & Flow**: Ensure clauses are properly connected using coordinating conjunctions (*and, but, so*) or semicolons.

Please paste the exact sentence you'd like me to review, and I'll break it down with corrections and natural native alternatives!`;
  }

  // 2. Past Perfect vs Simple Past
  if (
    lower.includes('past perfect') ||
    (lower.includes('had') && lower.includes('past')) ||
    (lower.includes('simple past') && lower.includes('past perfect'))
  ) {
    return `### ⏳ Past Perfect vs. Simple Past Decoded

The **Past Perfect** (*had + past participle*) is used when you are talking about **two past actions**, and you need to clarify which one happened **first**!

#### The Golden Rule:
- **Action 1 (Happened Earlier):** ➡️ Past Perfect (*had + V3*)
- **Action 2 (Happened Later):** ➡️ Simple Past (*V2*)

#### Realistic Example:
> *"When I **arrived** (Action 2) at the airport, the flight **had already departed** (Action 1)."*

#### Quick Comparison:
| Sentence | Meaning |
| :--- | :--- |
| *When Sarah arrived, we had dinner.* | Sarah arrived first, then we ate together. |
| *When Sarah arrived, we **had had** dinner.* | We finished eating before Sarah arrived. |

💡 **Pro Tip:** If you use time words like *before* or *after*, the order of events is already clear, so native speakers often use Simple Past for both!`;
  }

  // 3. American Accent & Pronunciation
  if (
    lower.includes('accent') ||
    lower.includes('flap t') ||
    lower.includes('pronun') ||
    lower.includes('schwa') ||
    lower.includes('vowel')
  ) {
    if (lower.includes('flap t') || lower.includes('water')) {
      return `### 🇺🇸 American Accent: The Flap "T" Rule

In General American English, when the letter **T** (or double **TT**) appears between two vowel sounds and is not at the start of a stressed syllable, it becomes a **Flap T** (IPA: [ɾ]).

It sounds very similar to a light, quick /d/ sound or the quick tap in Spanish *pero*.

#### Key Examples:
- **water** ➡️ *"wah-der"* [ˈwɑ.ɾɚ]
- **butter** ➡️ *"buh-der"* [ˈbʌ.ɾɚ]
- **city** ➡️ *"sih-dee"* [ˈsɪ.ɾi]
- **meeting** ➡️ *"mee-ding"* [ˈmi.ɾɪŋ]
- **better** ➡️ *"beh-der"* [ˈbɛ.ɾɚ]

#### Phrase Linking:
The flap also happens across word boundaries:
- *Put it on* ➡️ *"puh-dih-dahn"*
- *Get out of here* ➡️ *"geh-dou-da-here"*

Try practicing in our **Speaking Section** with the Slow, Normal, and Speed buttons!`;
    }

    return `### 🗣️ Pronunciation Master Tip: The Schwa /ə/

The **Schwa** (/ə/) is the single most frequent vowel sound in spoken English. It is a completely relaxed, unstressed sound (like a lazy *"uh"*).

#### Why is the Schwa so important?
In English, unstressed syllables lose their original vowel color and reduce to schwa:
- **banana** ➡️ /b**ə**ˈnæn.**ə**/ ("buh-NAN-uh")
- **photograph** ➡️ /ˈfoʊ.t**ə**.ɡræf/
- **photography** ➡️ /f**ə**ˈtɑː.ɡr**ə**.fi/ (notice how the stress shifts!)

**Rule of Thumb:** Don't pronounce every vowel clearly! English is a stress-timed language — squeeze and shorten unstressed vowels to sound natural.`;
  }

  // 4. Business English & Email Writing
  if (
    lower.includes('business') ||
    lower.includes('email') ||
    lower.includes('meeting') ||
    lower.includes('presentation') ||
    lower.includes('interview')
  ) {
    return `### 💼 Professional Business English Guide

Here are practical phrases top professionals use for clear, polite, and persuasive communication:

#### Polishing Common Email Openers:
- ❌ *"I am writing to tell you..."*
- ✅ *"I am reaching out to follow up on our discussion regarding [Topic]."*
- ✅ *"I wanted to quickly check in regarding the status of [Project]."*

#### Polite Disagreements in Meetings:
- ❌ *"You are wrong."*
- ✅ *"I see where you're coming from, but have we considered [Alternative]?"*
- ✅ *"I have a slightly different perspective on that timeline."*

#### Executive Sign-Offs:
- *"Best regards,"* (standard & reliable)
- *"Looking forward to your thoughts,"* (collaborative)
- *"Please let me know if you need any further clarification."*

Would you like me to help draft or polish a specific work email or presentation intro?`;
  }

  // 5. Idioms & Expressions
  if (
    lower.includes('idiom') ||
    lower.includes('phrase') ||
    lower.includes('slang') ||
    lower.includes('expression')
  ) {
    return `### 💡 Daily High-Impact Idiom

**"Bite the bullet"**
- **Meaning:** To force yourself to perform an unpleasant or difficult action that cannot be avoided.
- **Origin:** Soldiers in the 19th century were given a lead bullet to bite down on to cope with pain during surgery.
- **Natural Usage:** *"I didn't want to tell my boss about the budget shortfall, but I decided to bite the bullet and explain the numbers honestly."*

#### 3 Other Useful Everyday Idioms:
1. **"Hit the nail on the head"** — To describe exactly what is causing a situation or problem.
2. **"See eye to eye"** — To agree fully with someone (*"We don't always see eye to eye on design."*).
3. **"Under the weather"** — Feeling slightly unwell or fatigued.

Try making your own sentence with one of these, and I'll give you feedback!`;
  }

  // 6. Default Encouraging English Tutor Response
  return `### 👋 Hello! I'm Flowy, your EnglishFlow Tutor

I'm here to help you speak, write, and understand English with confidence! Here are things we can do together:

- **Grammar Explanations:** Ask me about any tense, conditional, modal verb, or tricky preposition.
- **Sentence Corrections:** Paste any sentence you've written, and I'll provide feedback and polished alternatives.
- **Pronunciation & Accent:** Discover the American Flap T, Schwa reduction, and minimal pairs.
- **Business English:** Learn high-impact phrases for emails, meetings, and job interviews.
- **Practice Dialogues:** Roleplay conversations like ordering at a restaurant, speaking with a client, or attending a conference.

What English topic would you like to master today?`;
}

export async function POST(req: NextRequest) {
  try {
    // Client IP for rate-limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          reply:
            'You are asking questions very quickly! Please pause for a moment to absorb the material and try again in a minute.',
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        { reply: 'Please send a question or sentence you would like help with!' },
        { status: 400 }
      );
    }

    // SECURITY CHECK 1: Guard against prompt injection and credential probing
    const isProbe = INJECTION_PATTERNS.some((pat) => pat.test(message));
    if (isProbe) {
      return NextResponse.json({
        reply:
          "I am EnglishFlow's AI learning assistant. I am programmed exclusively to help you practice English grammar, vocabulary, pronunciation, and conversational skills. I cannot discuss system settings, administrative accounts, or server credentials. How can I help you improve your English today?",
      });
    }

    // Generate Contextual Tutor Response
    let reply = generateTutorResponse(message);

    // SECURITY CHECK 2: Scrub response for any accidental sensitive token leakage
    for (const pat of SENSITIVE_PATTERNS) {
      if (pat.test(reply)) {
        reply = reply.replace(pat, '[REDACTED]');
      }
    }

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error('Chat error:', err);
    return NextResponse.json(
      {
        reply:
          "I'm currently reviewing our curriculum database. Please feel free to ask any English grammar or vocabulary question!",
      },
      { status: 200 }
    );
  }
}
