import { Post } from '@/models/types';
import { SAMPLE_POSTS } from '@/lib/db/seed-data';

interface CorrectionResult {
  hasError: boolean;
  original: string;
  corrected: string;
  explanation: string;
  examples: string[];
  lessonSlug?: string;
  lessonTitle?: string;
}

/**
 * 1. Intelligent Sentence Error Analyzer
 * Detects common grammatical, tense, prepositional, and lexical errors.
 */
export function analyzeSentenceErrors(input: string): CorrectionResult | null {
  const text = input.trim();
  const lower = text.toLowerCase();

  // Pattern: "I am agree" / "I am agreed"
  if (/\bi\s+am\s+agree(d)?\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bi\s+am\s+agree(d)?\b/gi, 'I agree'),
      explanation:
        'In English, **"agree"** is an active verb, not an adjective! You do not need the auxiliary verb "am". Use *"I agree"* for affirmative and *"I disagree"* or *"I don\'t agree"* for negative.',
      examples: [
        '❌ *I am agree with your proposal.* ➔ ✅ *I agree with your proposal.*',
        '❌ *She is agreed to join us.* ➔ ✅ *She agrees to join us.*',
      ],
      lessonSlug: 'common-mistakes-traps',
      lessonTitle: '10 Common English Grammar Mistakes',
    };
  }

  // Pattern: Subject-Verb Agreement: "He go", "She work", "It make"
  const subjVerbMatch = lower.match(/\b(he|she|it|this|that)\s+(go|do|work|know|want|take|come|say|make|think|feel|look|see|hear|run|write)\b/i);
  if (subjVerbMatch) {
    const subj = subjVerbMatch[1];
    const verb = subjVerbMatch[2];
    const thirdPersonVerb =
      verb === 'go' ? 'goes' : verb === 'do' ? 'does' : `${verb}s`;

    return {
      hasError: true,
      original: text,
      corrected: text.replace(new RegExp(`\\b${subj}\\s+${verb}\\b`, 'gi'), `${subj} ${thirdPersonVerb}`),
      explanation:
        `In the **Present Simple tense**, third-person singular subjects (*he, she, it*) require the **-s / -es** suffix on the base verb (*${verb}* ➔ *${thirdPersonVerb}*).`,
      examples: [
        `❌ *${subj} ${verb} to the office every morning.*`,
        `✅ *${subj} ${thirdPersonVerb} to the office every morning.*`,
      ],
      lessonSlug: 'present-simple-vs-present-continuous',
      lessonTitle: 'Present Simple vs. Present Continuous Guide',
    };
  }

  // Pattern: Negative auxiliary error: "He don't", "She don't", "It don't"
  if (/\b(he|she|it|everyone|everybody|nobody)\s+don'?t\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\b(he|she|it|everyone|everybody|nobody)\s+don'?t\b/gi, '$1 doesn\'t'),
      explanation:
        'Third-person singular subjects take **"doesn\'t"** (does not) for negative present statements, never "don\'t" (do not).',
      examples: [
        '❌ *He don\'t understand the question.* ➔ ✅ *He doesn\'t understand the question.*',
        '❌ *It don\'t matter.* ➔ ✅ *It doesn\'t matter.*',
      ],
      lessonSlug: 'subject-verb-agreement-mastery-guide',
      lessonTitle: 'Subject-Verb Agreement Mastery Guide',
    };
  }

  // Pattern: "Since [X] years / months" instead of "For [X] years"
  if (/\bsince\s+(\d+|several|a\s+few|many|two|three|four|five)\s+(years?|months?|weeks?|days?|hours?)\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bsince\b/gi, 'for'),
      explanation:
        'Use **"for"** to measure a **duration / period of time** (*for 3 years, for two weeks*). Use **"since"** only with a **specific starting point** in time (*since 2021, since Monday, since 9:00 AM*).',
      examples: [
        '❌ *I have lived in London since 3 years.* ➔ ✅ *I have lived in London for 3 years.*',
        '✅ *I have lived in London since 2023.*',
      ],
      lessonSlug: 'since-vs-for-ago-vs-before',
      lessonTitle: 'Since vs. For, Ago vs. Before Guide',
    };
  }

  // Pattern: "a hour", "an university", "an European"
  if (/\ba\s+hour\b/i.test(lower) || /\ban\s+(university|european|user|unit|unique)\b/i.test(lower)) {
    const isAHour = /\ba\s+hour\b/i.test(lower);
    return {
      hasError: true,
      original: text,
      corrected: isAHour
        ? text.replace(/\ba\s+hour\b/gi, 'an hour')
        : text.replace(/\ban\s+(university|european|user|unit|unique)\b/gi, 'a $1'),
      explanation:
        'Articles in English depend on the **initial phonetic sound**, not the written letter! "Hour" has a silent H (/aʊər/), requiring **"an"**. "University" and "European" begin with a consonant glide /j/ ("yoo-"), requiring **"a"**.',
      examples: [
        '✅ *an hour, an honest person, an honor* (vowel sounds)',
        '✅ *a university, a European city, a unique opportunity* (/j/ consonant sound)',
      ],
      lessonSlug: 'when-to-use-a-an-and-the',
      lessonTitle: 'Articles Mastery: When to Use A, An, and The',
    };
  }

  // Pattern: "Explain me" / "Describe me"
  if (/\b(explain|describe)\s+me\s+(the|what|how|why|about)\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\b(explain|describe)\s+me\b/gi, '$1 to me'),
      explanation:
        'The verbs **"explain"** and **"describe"** cannot take a person as a direct object without the preposition **"to"**. The syntax is: *explain [something] to [someone]*, or *explain to me [something]*.',
      examples: [
        '❌ *Can you explain me the rule?* ➔ ✅ *Can you explain the rule to me?*',
        '❌ *Please explain me how it works.* ➔ ✅ *Please explain to me how it works.*',
      ],
    };
  }

  // Pattern: "Look forward to meet you"
  if (/look(ing)?\s+forward\s+to\s+meet\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/look(ing)?\s+forward\s+to\s+meet\b/gi, 'look$1 forward to meeting'),
      explanation:
        'In the expression **"look forward to"**, the word "to" is a preposition, not an infinitive marker! Prepositions must be followed by a **noun or gerund (-ing form)**.',
      examples: [
        '❌ *I look forward to hear from you.* ➔ ✅ *I look forward to hearing from you.*',
        '❌ *We look forward to see you.* ➔ ✅ *We look forward to seeing you.*',
      ],
      lessonSlug: 'gerunds-vs-infinitives-mastery-guide',
      lessonTitle: 'Gerunds vs. Infinitives Mastery Guide',
    };
  }

  // Pattern: Uncountable noun plurals: "advices", "informations", "furnitures", "softwares", "equipments"
  const uncountableMatch = lower.match(/\b(advices|informations|furnitures|softwares|equipments|luggages)\b/i);
  if (uncountableMatch) {
    const raw = uncountableMatch[1];
    const singular = raw.replace(/s$/i, '');
    return {
      hasError: true,
      original: text,
      corrected: text.replace(new RegExp(`\\b${raw}\\b`, 'gi'), `pieces of ${singular}`),
      explanation:
        `In English, **"${singular}"** is an **uncountable (mass) noun**. It cannot take a plural "-s" or directly follow numbers. Use partitives like *"pieces of ${singular}"* or simply *"some ${singular}"*.`,
      examples: [
        `❌ *He gave me several ${raw}.* ➔ ✅ *He gave me several pieces of ${singular}.*`,
        `✅ *We received valuable ${singular} today.*`,
      ],
      lessonSlug: 'mastering-the-8-parts-of-speech-guide',
      lessonTitle: 'The 8 Parts of Speech & Syntax Foundations',
    };
  }

  // Pattern: Preposition confusion: "depend of", "listen music", "married with", "congratulate for", "discuss about"
  if (/\bdepend(s)?\s+of\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bdepend(s)?\s+of\b/gi, 'depend$1 on'),
      explanation: 'In English, the verb **depend** strictly collocates with **"on"** (or upon), never "of".',
      examples: ['❌ *It depends of the weather.* ➔ ✅ *It depends on the weather.*'],
    };
  }

  if (/\blisten\s+(the\s+)?(music|radio|podcast|teacher|me)\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\blisten\s+/gi, 'listen to '),
      explanation: 'The verb **listen** requires the preposition **"to"** when followed by an object.',
      examples: ['❌ *I like to listen music.* ➔ ✅ *I like to listen to music.*'],
    };
  }

  if (/\bmarried\s+with\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bmarried\s+with\b/gi, 'married to'),
      explanation: 'To describe marital status with a person, use **"married to"**, not "married with".',
      examples: ['❌ *She is married with an architect.* ➔ ✅ *She is married to an architect.*'],
    };
  }

  if (/\bdiscuss\s+about\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bdiscuss\s+about\b/gi, 'discuss'),
      explanation:
        'The transitive verb **"discuss"** already contains the meaning of "talk about". Adding "about" is redundant. Say *"discuss the proposal"*, or *"talk about the proposal"*.',
      examples: ['❌ *Let\'s discuss about the budget.* ➔ ✅ *Let\'s discuss the budget.*'],
    };
  }

  if (/\bdespite\s+of\b/i.test(lower)) {
    return {
      hasError: true,
      original: text,
      corrected: text.replace(/\bdespite\s+of\b/gi, 'despite'),
      explanation: 'Use either **"despite"** (without "of") OR **"in spite of"** (with "of"). Never combine them into "despite of".',
      examples: ['❌ *Despite of the rain...* ➔ ✅ *Despite the rain...* (or *In spite of the rain...*)'],
    };
  }

  return null;
}

/**
 * 2. Word Pair & Vocabulary Contrast Explanations
 */
export function getWordPairExplanation(term1: string, term2: string): string | null {
  const t1 = term1.toLowerCase();
  const t2 = term2.toLowerCase();

  // Affect vs Effect
  if ((t1.includes('affect') && t2.includes('effect')) || (t1.includes('effect') && t2.includes('affect'))) {
    return `### ⚖️ Affect vs. Effect Decoded

The easiest way to remember the distinction is the **RAVEN** rule:

| Letter | Principle | Part of Speech | Example |
| :--- | :--- | :--- | :--- |
| **R** | Remember | — | — |
| **A** | **Affect** | **Verb** (Action) | *"The economic climate will **affect** hiring."* |
| **V** | Verb | — | — |
| **E** | **Effect** | **Noun** (Result) | *"The policy had an immediate **effect** on profits."* |
| **N** | Noun | — | — |

#### Quick Memory Check:
- **A**ffect = **A**ction (Verb)
- **E**ffect = **E**nd Result (Noun)

💡 **Advanced Nuance:** In formal writing, *effect* can rarely be a verb meaning *to bring about* (*"to effect change"*), and *affect* can be a psychology noun meaning *observed emotion* (*"a flat affect"*).

📖 **Deep Dive Masterclass:** [Confusing Word Pairs Decoded](/blog/confusing-word-pairs-affect-effect)`;
  }

  // Principal vs Principle
  if (
    (t1.includes('principal') && t2.includes('principle')) ||
    (t1.includes('principle') && t2.includes('principal'))
  ) {
    return `### ⚖️ Principal vs. Principle

| Word | Meaning | Part of Speech | Memory Mnemonic |
| :--- | :--- | :--- | :--- |
| **Principal** | Chief, main, primary; head of a school; loan capital | Adjective / Noun | The school princi**pal** is your **pal** (friend). |
| **Principle** | A fundamental truth, moral rule, or natural law | Noun | Princi**ple** = A fundamental **rule**. |

#### Sentence Examples:
- *"Our **principal** concern is passenger safety."* (Main / primary)
- *"She refused to compromise on her ethical **principles**."* (Moral rules)

📖 **Deep Dive Masterclass:** [Confusing Word Pairs Decoded](/blog/confusing-word-pairs-affect-effect)`;
  }

  // Compliment vs Complement
  if (
    (t1.includes('compliment') && t2.includes('complement')) ||
    (t1.includes('complement') && t2.includes('compliment'))
  ) {
    return `### ⚖️ Compliment vs. Complement

- **Compl**i**ment (with 'i'):** An expression of praise, admiration, or congratulation.
  - *Mnemonic:* **I** love to receive a compl**i**ment!
  - *"He paid her a gracious **compliment** on her keynote presentation."*
- **Compl**e**ment (with 'e'):** Something that completes, balances, or brings to perfection.
  - *Mnemonic:* Compl**e**ment **c**ompl**e**tes something.
  - *"The spicy sauce is a perfect **complement** to the grilled fish."*`;
  }

  // Borrow vs Lend
  if (
    (t1.includes('borrow') && t2.includes('lend')) ||
    (t1.includes('lend') && t2.includes('borrow'))
  ) {
    return `### ⚖️ Borrow vs. Lend (Direction of Giving)

These two verbs describe the identical transaction, but from **opposite directions**:

- **Borrow (Take In / Receive):** You take something from someone with the intention of returning it.
  - ➔ *Direction: Inward (from them to you)*
  - *"May I **borrow** your laptop charger for an hour?"*
- **Lend (Give Out / Provide):** You give something to someone temporarily.
  - ➔ *Direction: Outward (from you to them)*
  - *"Could you **lend** me twenty dollars until Friday?"*
  - *(Note: In American English, "loan" is also frequently used as a verb: "Could you loan me...")*

❌ *Incorrect:* "Can you borrow me your car?"
✅ *Correct:* "Can you **lend** me your car?" (or "Can I **borrow** your car?")`;
  }

  // Hear vs Listen
  if (
    (t1.includes('hear') && t2.includes('listen')) ||
    (t1.includes('listen') && t2.includes('hear'))
  ) {
    return `### ⚖️ Hear vs. Listen

- **Hear:** The passive physical ability of your ears to perceive sound waves (unconscious / involuntary).
  - *"Did you **hear** that strange noise outside?"*
  - *"I can't **hear** you clearly; the connection is unstable."*
- **Listen:** The active, intentional focus and mental attention given to sounds (conscious / voluntary).
  - Always requires **"to"** before an object!
  - *"Please **listen to** the instructions carefully."*
  - *"I love **listening to** jazz while I study."*`;
  }

  // Frugal vs Stingy
  if (
    (t1.includes('frugal') && t2.includes('stingy')) ||
    (t1.includes('stingy') && t2.includes('frugal'))
  ) {
    return `### ⚖️ Frugal vs. Stingy (Connotation Nuance)

Both words describe a person who minimizes spending, but their **social connotations are polar opposites**:

- **Frugal (Positive Connotation):** Prudent, disciplined, thoughtful, and wise with resources.
  - *"Being **frugal** allowed them to save a down payment for their house."*
- **Stingy (Negative / Pejorative Connotation):** Mean-spirited, greedy, petty, unwilling to share even when necessary.
  - *"He was so **stingy** that he refused to tip the hard-working server."*

📖 **Deep Dive Masterclass:** [Register, Tone & Connotation Nuance](/blog/contextual-register-and-connotation-nuance)`;
  }

  return null;
}

/**
 * 3. Topic-Specific Masterclass Tutor Explanations
 */
export function getTopicExplanation(query: string): string | null {
  const lower = query.toLowerCase();

  // Conditionals
  if (lower.includes('conditional') || lower.includes('if clause') || lower.includes('third conditional')) {
    return `### 🔀 The 4 English Conditional Sentences

Conditionals describe the relationship between a condition (*if...*) and a result:

| Conditional | Formula | When to Use | Real Example |
| :--- | :--- | :--- | :--- |
| **Zero (0)** | *If + Present Simple, Present Simple* | Universal scientific truths & laws of nature | *"If you heat ice, it **melts**."* |
| **First (1st)** | *If + Present Simple, will + base verb* | Real, probable future possibilities | *"If it rains tomorrow, we **will reschedule** the match."* |
| **Second (2nd)** | *If + Past Simple, would + base verb* | Unreal, imaginary, or hypothetical present | *"If I won the lottery, I **would travel** the globe."* |
| **Third (3rd)** | *If + Past Perfect, would have + V3* | Regrets or counterfactual past events | *"If we had left earlier, we **would not have missed** the train."* |

💡 **Pro Tip for 2nd Conditional:** In formal English, use *"were"* for all subjects with the verb *to be*: *"If I **were** you, I would accept the job."*

📖 **Deep Dive Masterclass:** [Mastering Conditional Sentences: Zero, First, Second, Third & Mixed](/blog/mastering-conditional-sentences-zero-first-second-third)`;
  }

  // Passive Voice
  if (lower.includes('passive voice') || lower.includes('active vs passive')) {
    return `### 🔄 Passive Voice Decoded: When, Why & How

In the **Active Voice**, the subject performs the action. In the **Passive Voice**, the subject **receives** the action:

\`\`\`
Active:  [Subject] + [Verb] + [Object]
         The government (Actor) built the highway.

Passive: [Object] + [be + Past Participle (V3)] + (by [Subject])
         The highway was built (by the government) in 2024.
\`\`\`

#### When Should You Use the Passive Voice?
1. **The actor is unknown or irrelevant:** *"My bicycle **was stolen** last night."*
2. **Scientific & technical reports:** *"The chemical compound **was heated** to 100°C."*
3. **Diplomacy & tact (avoiding direct blame):** *"A severe mistake **was made** in the budget calculation."* (Instead of: *"You made a mistake!"*)

📖 **Deep Dive Masterclass:** [Passive Voice Decoded: When, Why & How to Use It](/blog/passive-voice-demystified)`;
  }

  // Inversion
  if (lower.includes('inversion') || lower.includes('negative inversion') || lower.includes('not only did')) {
    return `### ⚡ Negative Inversion: The Secret to Dramatic Rhetoric

In formal English, when a sentence begins with a **negative or restrictive adverb**, the subject and auxiliary verb **invert** (swap positions), creating intense dramatic emphasis:

\`\`\`
Normal Order:     "I have rarely witnessed such dedication."
Inverted Order:   "Rarely have I witnessed such dedication."
                   ▲      ▲    ▲
                 Adverb  Aux  Subj
\`\`\`

#### Top Restrictive Inversion Triggers:
1. **Never / Rarely / Seldom:** *"Seldom **did we see** such remarkable craftsmanship."*
2. **Not only... but also:** *"Not only **is she** a brilliant programmer, but she is also a charismatic leader."*
3. **Under no circumstances:** *"Under no circumstances **should you share** your private encryption key."*
4. **Hardly / Scarcely... when:** *"Hardly **had we entered** the station when the train pulled in."*

📖 **Deep Dive Masterclass:** [Advanced Inversion, Subjunctive Mood & Cleft Sentences](/blog/advanced-inversion-subjunctive-and-rhetorical-grammar)`;
  }

  // Modal Verbs
  if (lower.includes('modal') || lower.includes('must vs should') || lower.includes('could have')) {
    return `### 🧭 Modal Verbs of Deduction & Probability

Modal verbs allow you to express how certain you are about a situation:

\`\`\`
100% Certain It's True   ──>  MUST BE      ("His car is outside; he must be in the office.")
50% Possible             ──>  MIGHT / COULD ("Take an umbrella; it might rain later.")
100% Certain It's False  ──>  CAN'T BE     ("She's in Tokyo; that can't be Sarah at the door!")
\`\`\`

#### Past Deductions (Modal + Have + Past Participle):
- **Must have + V3:** *"The streets are soaking wet; it **must have rained** heavily overnight."*
- **Can't have + V3:** *"He **can't have stolen** the files; he was on a transatlantic flight at the time."*
- **Should have + V3:** (Regret / Unfulfilled duty) *"I **should have studied** harder for the certification exam."*

📖 **Deep Dive Masterclass:** [Modal Verbs Mastery: Epistemic Deduction & Diplomacy](/blog/modal-verbs-mastery)`;
  }

  // JAM Topics
  if (lower.includes('jam') || lower.includes('just a minute') || lower.includes('impromptu')) {
    return `### 🎙️ JAM (Just A Minute) Speaking Mastery

JAM is a premier speaking exercise where you speak on an unprepared topic for **60 continuous seconds** without hesitation, repetition, or grammatical breakdown.

#### The Golden PREP Formula:
- **P (Point):** State your core thesis clearly in 1 sentence (0–10s).
- **R (Reason):** Explain the foundational "why" behind your point (10–25s).
- **E (Example):** Share a vivid real-world example, anecdote, or data point (25–50s).
- **P (Point):** Reiterate your main takeaway with memorable finality (50–60s).

#### Practice Topics to Try Right Now:
1. *"Is remote work genuinely superior to office collaboration?"*
2. *"The single most transformative book you have ever read."*
3. *"Will artificial intelligence eliminate or enhance creative jobs?"*

Try recording your 60-second response out loud using your phone's voice memo app!

📖 **Deep Dive Masterclass:** [JAM Topics Speaking Mastery: How to Speak Fluently Under Pressure](/blog/jam-topics-just-a-minute-speaking-mastery)`;
  }

  // Tongue Twisters
  if (lower.includes('tongue twister') || lower.includes('twister') || lower.includes('twisters')) {
    return `### 👅 Tongue Twisters for Articulatory Precision

Tongue twisters retrain the motor muscles of your tongue, lips, and soft palate. Practice each twister **three times**: first *Slow*, then *Normal*, then *Fast*!

#### 1. The /s/ and /ʃ/ (S vs. SH) Sibilant Drill:
> *"She sells seashells by the seashore. The shells she sells are surely seashells."*
- **Target:** Clear distinction between the dental /s/ and the postalveolar /ʃ/.

#### 2. The /b/ and /p/ Bilabial Plosive Drill:
> *"Peter Piper picked a peck of pickled peppers."*
- **Target:** Crisp aspiration on the voiceless /p/ burst.

#### 3. The Tricky American Vowel & Lateral Drill:
> *"How much wood would a woodchuck chuck if a woodchuck could chuck wood?"*
- **Target:** The short lax vowel /ʊ/ in *wood, would, could, chuck*.

💡 Check out the **Interactive Tongue Twister Studio** in our Speaking Section with dedicated Slow, Normal, and Speed voice playback!`;
  }

  // Academic Vocabulary
  if (lower.includes('academic word') || lower.includes('awl') || lower.includes('academic vocab')) {
    return `### 🎓 High-Frequency Academic Power Words

These versatile cognitive words from the **Academic Word List (AWL)** empower essays, research, and analysis:

1. **Paradigm** /ˈpær.ə.daɪm/ (Noun): An overarching conceptual framework or worldview (*"Quantum physics sparked a paradigm shift."*).
2. **Empirical** /ɪmˈpɪr.ɪ.kəl/ (Adj): Based on verifiable observation or experimentation rather than pure theory (*"Empirical evidence corroborated the hypothesis."*).
3. **Synthesize** /ˈsɪn.θə.saɪz/ (Verb): To combine disparate ideas or elements into a coherent whole (*"The review synthesized forty clinical studies."*).
4. **Dichotomy** /daɪˈkɑː.t̬ə.mi/ (Noun): A division into two mutually exclusive parts (*"The false dichotomy between security and privacy."*).
5. **Ubiquitous** /juːˈbɪk.wə.t̬əs/ (Adj): Found everywhere; omnipresent (*"Smartphones have become ubiquitous."*).

📖 **Deep Dive Masterclass:** [50 High-Frequency Academic Words Guide](/blog/50-high-frequency-academic-words)`;
  }

  // Quiz on Demand
  if (
    lower.includes('quiz me') ||
    lower.includes('test me') ||
    lower.includes('give me a quiz') ||
    lower.includes('quiz question') ||
    lower.includes('practice question')
  ) {
    return `### 🧠 Interactive Pop Quiz Challenge!

Here is a quick question to test your English mastery:

**Question:** Which sentence is grammatically correct?

1. *Despite of the storm, we completed the flight on schedule.*
2. *Although the storm was severe, but we completed the flight on schedule.*
3. *Despite the storm, we completed the flight on schedule.*
4. *In spite the storm, we completed the flight on schedule.*

---

<details>
<summary><b>Click to Reveal the Answer & Explanation</b></summary>

✅ **Correct Answer: Option 3**

**Explanation:**
- "Despite" takes a noun phrase directly without "of" (*Despite the storm*).
- "In spite of" requires "of" (*In spite of the storm*).
- Option 2 is incorrect because you cannot combine "Although" with "but" in the same sentence.
</details>

Would you like another quiz question on grammar, vocabulary, or idioms?`;
  }

  return null;
}

/**
 * 4. Helper to find relevant lesson recommendations
 */
export function findMatchingLesson(query: string): Post | null {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 3);

  for (const post of SAMPLE_POSTS) {
    const titleLower = post.title.toLowerCase();
    const tagMatch = post.tags.some((t) => q.includes(t.toLowerCase()));
    const titleMatch = words.some((w) => titleLower.includes(w));

    if (tagMatch || titleMatch) {
      return post;
    }
  }
  return null;
}
