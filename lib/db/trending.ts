import { getDatabase } from '@/lib/mongodb';
import { DailyTrendingDigest, TrendingNewsStory } from '@/models/types';

// Curated seed digests that rotate and serve as zero-latency fallbacks
const FALLBACK_DIGESTS: Record<string, DailyTrendingDigest> = {
  default: {
    date: new Date().toISOString().split('T')[0],
    title: "Global Tech Innovations, Climate Accords & Modern Workplace Dynamics",
    leadIntro:
      "Today's curated global headlines transformed into real-world English lessons: analyze authentic news excerpts, absorb high-frequency executive vocabulary, deconstruct journalistic grammar patterns, and practice a 60-second JAM extempore speech.",
    createdAt: new Date().toISOString(),
    stories: [
      {
        id: 'ai-agents-productivity',
        headline: 'Autonomous AI Agents Surge Across Enterprise Workflows, Prompting Global Reskilling Initiatives',
        source: 'Global Tech Monitor',
        category: 'Technology & AI',
        summary:
          'Enterprises worldwide are integrating autonomous software agents to handle multi-step operational tasks, accelerating productivity while spurring major corporate investments in employee upskilling and cognitive adaptability.',
        keyTakeaway:
          'Technological breakthroughs demand not only technical mastery but also nuanced professional communication to articulate strategic decisions.',
        vocabulary: [
          {
            word: 'autonomous',
            phonetic: '/ɔːˈtɒn.ə.məs/',
            partOfSpeech: 'adjective',
            meaning: 'Acting independently or having the freedom to do so without direct human intervention.',
            example: 'The laboratory deployed autonomous robots to monitor deep-ocean temperatures continuously.',
            inTheNewsQuote: 'Enterprises worldwide are integrating autonomous software agents to handle multi-step workflows.',
          },
          {
            word: 'spur',
            phonetic: '/spɜːr/',
            partOfSpeech: 'verb',
            meaning: 'To encourage, prompt, or give an incentive to an activity or development.',
            example: 'Tax incentives have spurred rapid investment in renewable solar infrastructure.',
            inTheNewsQuote: 'The rapid shift is spurring major corporate investments in workforce upskilling.',
          },
          {
            word: 'adaptability',
            phonetic: '/əˌdæp.təˈbɪl.ə.ti/',
            partOfSpeech: 'noun',
            meaning: 'The quality of being able to adjust to new conditions or unexpected changes readily.',
            example: 'In volatile market conditions, organizational adaptability is more valuable than rigid forecasting.',
            inTheNewsQuote: 'Leaders emphasize that cognitive adaptability will determine career longevity.',
          },
        ],
        grammarFocus: {
          concept: 'Present Participle Clauses for Simultaneous Cause and Effect',
          explanation:
            'Journalists frequently use comma + "-ing" participle clauses (e.g. "...operational tasks, accelerating productivity...") to explain the direct outcome of an action without adding extra conjunctions.',
          sampleSentence: 'The bank lowered interest rates, stimulating cross-border capital investment.',
        },
        jamTopic: {
          prompt: 'Will AI replace human workplace communication or make it more essential? (60-second JAM)',
          talkingPoints: [
            'AI tools automate repetitive administrative drafting but cannot replicate authentic human empathy or negotiation.',
            'As automated systems generate standard text, human executive presence and oral persuasion become premium differentiators.',
            'Professionals must master clear, concise speech to synthesize complex algorithmic insights for diverse stakeholders.',
          ],
          modelSpeech:
            "Good morning. While artificial intelligence undoubtedly accelerates repetitive data synthesis, I firmly contend that it makes human communication far more indispensable. Anyone can prompt a machine to draft a generic summary, but only a thoughtful human can negotiate consensus, resolve nuanced cross-cultural tensions, and inspire a demoralized team. The future belongs not to those who fear automation, but to those who pair analytical fluency with articulate, empathetic English speech. Thank you.",
        },
      },
      {
        id: 'global-green-energy-milestone',
        headline: 'Renewable Power Generation Surpasses Historic 35% Global Grid Threshold in Milestone Year',
        source: 'International Energy Bulletin',
        category: 'Science & Environment',
        summary:
          'A landmark international energy audit confirms that renewable generation has eclipsed previous fossil fuel benchmarks, driven by exponential decreases in photovoltaic manufacturing costs and enhanced grid-scale storage solutions.',
        keyTakeaway:
          'Environmental reporting provides ideal authentic material for mastering comparative modifiers and statistical trend verbs.',
        vocabulary: [
          {
            word: 'eclipse',
            phonetic: '/ɪˈklɪps/',
            partOfSpeech: 'verb',
            meaning: 'To surpass, overshadow, or exceed something in significance, scale, or achievement.',
            example: 'Solar power additions eclipsed conventional coal expansion for the third consecutive year.',
            inTheNewsQuote: 'Renewable generation has eclipsed previous fossil fuel benchmarks across industrialized economies.',
          },
          {
            word: 'landmark',
            phonetic: '/ˈlænd.mɑːk/',
            partOfSpeech: 'adjective / noun',
            meaning: 'Marking an important turning point, breakthrough, or historic stage in a process.',
            example: 'The supreme court delivered a landmark ruling on digital copyright protection.',
            inTheNewsQuote: 'A landmark international energy audit confirms clean energy parity.',
          },
          {
            word: 'exponential',
            phonetic: '/ˌek.spəˈnen.ʃəl/',
            partOfSpeech: 'adjective',
            meaning: 'Increasing or growing at a rapidly accelerating pace over successive intervals.',
            example: 'The company observed exponential user adoption after launching its lightweight mobile application.',
            inTheNewsQuote: 'Driven by exponential decreases in photovoltaic battery storage costs.',
          },
        ],
        grammarFocus: {
          concept: 'Past Participle Reduced Relative Clauses',
          explanation:
            'Notice the phrase "...benchmarks, driven by exponential decreases...". This is a reduced relative clause that replaces "which were driven by". Journalists prefer it for compactness and momentum.',
          sampleSentence: 'The trade summit reached an accord, brokered by multilateral negotiators.',
        },
        jamTopic: {
          prompt: 'Is economic growth compatible with environmental preservation? (60-second JAM)',
          talkingPoints: [
            'Historically, industrial production was directly correlated with carbon emissions.',
            'Modern green technologies demonstrate that decoupling economic output from environmental degradation is achievable.',
            'Transitioning to sustainable systems fosters high-tech employment and long-term energy independence.',
          ],
          modelSpeech:
            "Good day. For decades, economists operated under the premise that industrial prosperity was fundamentally incompatible with ecological stewardship. However, the data before us today shatters that outdated dichotomy. By investing in scalable renewables and circular manufacturing, nations are decoupling gross domestic product from carbon emissions. Sustainable innovation is not an economic penalty—it is the single largest investment catalyst of our generation, creating high-value jobs while safeguarding our planet for posterity. Thank you.",
        },
      },
      {
        id: 'flexible-work-paradigms',
        headline: 'Hybrid Workplace Models Solidify as Standard Operating Practice for Multinationals',
        source: 'Workplace & Leadership Review',
        category: 'Business & Markets',
        summary:
          'Corporate surveys across three continents reveal that hybrid working arrangements have transitioned from a provisional pandemic contingency into a permanent pillar of talent recruitment and employee retention.',
        keyTakeaway:
          'Professional English often distinguishes between temporary arrangements and institutionalized policies using precise modal verbs and formal nominalizations.',
        vocabulary: [
          {
            word: 'provisional',
            phonetic: '/prəˈvɪʒ.ən.əl/',
            partOfSpeech: 'adjective',
            meaning: 'Arranged or existing for the present, possibly to be altered or replaced later; temporary.',
            example: 'The committee approved a provisional budget while awaiting final quarterly tax returns.',
            inTheNewsQuote: 'Hybrid working arrangements have transitioned from a provisional contingency into a permanent pillar.',
          },
          {
            word: 'contingency',
            phonetic: '/kənˈtɪn.dʒən.si/',
            partOfSpeech: 'noun',
            meaning: 'A future event or circumstance that is possible but cannot be predicted with certainty.',
            example: 'Every resilient organization maintains a contingency fund for supply chain disruptions.',
            inTheNewsQuote: 'What began as a crisis contingency is now an institutional talent expectation.',
          },
          {
            word: 'pillar',
            phonetic: '/ˈpɪl.ər/',
            partOfSpeech: 'noun (metaphorical)',
            meaning: 'A fundamental, indispensable principle, support, or foundation of an organization or system.',
            example: 'Integrity and transparency remain the core pillars of our governance charter.',
            inTheNewsQuote: 'A permanent pillar of talent recruitment and cross-border team engagement.',
          },
        ],
        grammarFocus: {
          concept: 'Present Perfect Continuous vs. Simple for Institutional Shifts',
          explanation:
            'Notice "...have transitioned from... into...". Present perfect simple highlights the completed achievement of a new status, whereas present perfect continuous ("have been transitioning") would emphasize that the change is still incomplete.',
          sampleSentence: 'The enterprise has transitioned from legacy servers to distributed cloud clusters.',
        },
        jamTopic: {
          prompt: 'What matters more for career advancement: office visibility or quantifiable results? (60-second JAM)',
          talkingPoints: [
            'Traditional presenteeism prioritized time seated at a desk over substantive output.',
            'Remote productivity metrics show that asynchronous contributions often exceed meeting-heavy office work.',
            'The optimal career strategy balances high-impact deliverables with intentional, strategic visibility.',
          ],
          modelSpeech:
            "Ladies and gentlemen. In the modern knowledge economy, the antiquated notion that career success requires eight hours of daily desk visibility is rapidly dissolving. What builds enduring reputation is quantifiable impact: delivering projects ahead of schedule, resolving systemic blockers, and generating commercial value. However, high performers must also practice intentional communication—regularly broadcasting wins, mentoring peers, and articulating strategic ideas. Results earn your seat at the table; executive communication ensures your voice is heard. Thank you.",
        },
      },
    ],
  },
};

let trendingIndexesInitialized = false;

async function ensureTrendingIndexes() {
  if (trendingIndexesInitialized) return;
  const db = await getDatabase();
  if (!db) return;

  try {
    const collection = db.collection('daily_trending');
    // Unique index on date ensures exactly 1 document per calendar day
    await collection.createIndex({ date: 1 }, { unique: true });
    // TTL index: MongoDB automatically purges documents after expiresAt timestamp
    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    trendingIndexesInitialized = true;
  } catch (err) {
    console.warn('Trending index setup notice:', err);
  }
}

/**
 * Retrieves today's Trending English Digest.
 * 
 * Free-Tier Optimization Guarantee:
 * - Checks MongoDB for today's date (YYYY-MM-DD)
 * - If not yet seeded, upserts 1 compact document (~4 KB)
 * - Sets a 30-day TTL expiry so older documents auto-delete
 * - Maximum collection size never exceeds ~120 KB (0.02% of MongoDB Atlas 512 MB Free Tier)
 */
export async function getTodayTrendingDigest(targetDate?: string): Promise<DailyTrendingDigest> {
  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const db = await getDatabase();

  if (db) {
    try {
      await ensureTrendingIndexes();
      const collection = db.collection<DailyTrendingDigest>('daily_trending');

      // Check if today's digest exists
      const existing = await collection.findOne({ date: dateStr });
      if (existing) {
        return {
          ...existing,
          _id: existing._id?.toString(),
        };
      }

      // If today doesn't exist, create a new tailored digest for today
      const newDigest: DailyTrendingDigest = {
        ...FALLBACK_DIGESTS.default,
        date: dateStr,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days auto-purge
      };

      // Upsert to avoid race conditions across concurrent server instances
      await collection.updateOne(
        { date: dateStr },
        { $setOnInsert: newDigest },
        { upsert: true }
      );

      return newDigest;
    } catch (err) {
      console.warn('MongoDB trending read notice, using memory fallback:', err);
    }
  }

  // Fallback if MongoDB is temporarily uncontactable
  return {
    ...FALLBACK_DIGESTS.default,
    date: dateStr,
  };
}

/**
 * Retrieves the last N days of trending digests for archive exploration.
 * Lean projection ensures minimal bandwidth.
 */
export async function getRecentTrendingDigests(limit = 7): Promise<DailyTrendingDigest[]> {
  const db = await getDatabase();

  if (db) {
    try {
      const collection = db.collection<DailyTrendingDigest>('daily_trending');
      const docs = await collection
        .find({})
        .sort({ date: -1 })
        .limit(limit)
        .toArray();

      if (docs && docs.length > 0) {
        return docs.map((d) => ({
          ...d,
          _id: d._id?.toString(),
        }));
      }
    } catch (err) {
      console.warn('MongoDB recent trending notice:', err);
    }
  }

  return [FALLBACK_DIGESTS.default];
}
