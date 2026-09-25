import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting: 30 requests per 5 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 5 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 30) {
    return false;
  }
  entry.count += 1;
  return true;
}

// Curated high-yield fallbacks for JAM Topics
const FALLBACK_JAM_TOPICS = [
  {
    category: 'Workplace',
    title: 'Managing Asynchronous Teams Across Timezones',
    prompt: 'How can modern organizations maintain team cohesion when colleagues never share the same working hours?',
    keyVocabulary: ['asynchronous documentation', 'cognitive fatigue', 'transparent workflows', 'autonomous ownership', 'slack fatigue'],
    framework: {
      point: 'Asynchronous communication succeeds only when documentation replaces ad-hoc meetings as the single source of truth.',
      evidence: 'Leading distributed engineering teams resolve 70% of blockers through structured memos rather than impromptu video calls.',
      explanation: 'Constant calendar interruptions destroy deep work, whereas deliberate asynchronous exchanges foster thoughtful decision-making.',
      link: 'Consequently, the future of work belongs to organizations that master written operational clarity.',
    },
    sampleResponse:
      'Operating across global time zones requires a fundamental mindset shift from presence to documented accountability. In traditional offices, communication happens haphazardly through hallway chatter or urgent calendar invites. In contrast, high-performing asynchronous teams operate through transparent, written documentation. Every strategic decision, project specification, and engineering review is logged where anyone from Tokyo to San Francisco can audit it at their peak energy hours. By replacing hurried video meetings with structured written memos, we eliminate the tyranny of time zones and give professionals back their uninterrupted focus.',
  },
  {
    category: 'Technology',
    title: 'The Ethics of Autonomous Decision Systems',
    prompt: 'Should automated algorithms be allowed to make critical financial or hiring decisions without human veto power?',
    keyVocabulary: ['algorithmic accountability', 'black-box opacity', 'human-in-the-loop', 'unconscious bias', 'systemic equity'],
    framework: {
      point: 'Critical decisions affecting human livelihoods must mandate human-in-the-loop oversight to prevent systemic algorithmic discrimination.',
      evidence: 'Historical hiring models have repeatedly penalized qualified candidates due to biased legacy training datasets.',
      explanation: 'While machine learning models identify statistical correlations with speed, they cannot comprehend moral context or institutional equity.',
      link: 'Therefore, artificial intelligence should serve as an advisor, never the final judge.',
    },
    sampleResponse:
      'The allure of fully autonomous decision-making lies in speed and perceived impartiality. However, delegating critical decisions like credit approvals or job candidate screening to closed black-box models is profoundly dangerous. Machine learning models do not invent principles; they extrapolate from historical patterns, often codifying and amplifying the very prejudices society strives to eradicate. A human-in-the-loop architecture ensures that moral nuance, personal context, and ethical empathy remain central to governance. We must use algorithms to flag insights, but preserve human conscience as the ultimate arbiter.',
  },
  {
    category: 'Personal Growth',
    title: 'The Discipline of Radical Simplification',
    prompt: 'Why do high achievers deliberately choose minimalism in an era of endless consumption and stimulation?',
    keyVocabulary: ['cognitive overload', 'deliberate minimalism', 'essentialism', 'mental bandwidth', 'superficial trivialities'],
    framework: {
      point: 'True productivity is achieved not by doing more things, but by eliminating non-essential commitments.',
      evidence: 'Steve Jobs and Barack Obama adopted daily signature wardrobes specifically to eradicate decision fatigue on trivial choices.',
      explanation: 'Every notification, subscription, and casual meeting extracts a cognitive toll on our finite daily willpower.',
      link: 'Simplifying our environment unlocks the deep cognitive energy required for creative breakthroughs.',
    },
    sampleResponse:
      'We live in a culture that equates busyness with significance. Yet, when you study the world’s most impactful creators and thinkers, you discover an obsession with radical simplicity. Every morning we awaken with a limited reservoir of cognitive energy. If we exhaust that willpower deciding what to wear, scrolling through superficial social feeds, or attending unfocused meetings, we leave our deepest creative ambitions starving. Minimalism is not about deprivation; it is about radical intentionality. By saying no to the good, we reserve our best energy for what is truly extraordinary.',
  },
  {
    category: 'Society',
    title: 'Bridging the Generational Workplace Divide',
    prompt: 'How can multi-generational teams turn differing values on hierarchy and work ethic into a competitive advantage?',
    keyVocabulary: ['intergenerational synergy', 'tacit institutional knowledge', 'digital fluency', 'mutual mentorship', 'cross-generational empathy'],
    framework: {
      point: 'High-performing teams pair the seasoned institutional judgment of veterans with the digital fluency of younger entrants.',
      evidence: 'Reverse mentorship programs have helped traditional banks accelerate digital adoption by over 40%.',
      explanation: 'Senior leaders provide risk mitigation and political savvy, while junior contributors bring fresh perspectives and agile methodologies.',
      link: 'When mutual respect supersedes generational stereotypes, diversity transforms into market resilience.',
    },
    sampleResponse:
      'In today’s workplace, for the first time in modern history, four distinct generations collaborate under the same corporate umbrella. It is easy to succumb to superficial stereotypes: labeling younger professionals as impatient or older colleagues as resistant to change. However, visionary organizations view this demographic blend as an unmatched competitive advantage. Younger employees bring native fluency with AI and emerging digital ecosystems, while seasoned colleagues contribute deep institutional memory, client crisis management, and diplomatic tact. By establishing two-way mentorship, we foster an environment of continuous learning where everyone leads and everyone learns.',
  },
  {
    category: 'Creative',
    title: 'The Paradox of Constraints in Innovation',
    prompt: 'Does having unlimited resources inspire better creative work, or do tight limitations produce superior ideas?',
    keyVocabulary: ['creative friction', 'resourcefulness', 'paralysis of choice', 'frugal innovation', 'catalytic constraints'],
    framework: {
      point: 'Strict constraints act as a catalyst for creative breakthroughs by eliminating the paralysis of infinite choice.',
      evidence: 'Dr. Seuss wrote "Green Eggs and Ham" using a strict publisher-enforced bet of exactly fifty unique words.',
      explanation: 'When resources are limitless, teams default to throwing money at problems; when restricted, they are forced to invent novel solutions.',
      link: 'Embracing boundaries is the hallmark of genuine artistic and technical mastery.',
    },
    sampleResponse:
      'There is a widespread misconception that creativity thrives in boundless freedom. In reality, unlimited resources and infinite options frequently breed paralysis and creative bloat. When you are told you can build anything with no budget or deadline, you waste months debating abstract possibilities. But when you are given three weeks, a shoestring budget, and a strict five-feature ceiling, creative friction takes over. Constraints force you to strip away vanity metrics, interrogate core assumptions, and uncover unconventional shortcuts. As the architect Frank Gehry once noted, constraints are the artist’s greatest ally.',
  },
];

// Curated high-yield fallbacks for Shadowing Exercises
const FALLBACK_SHADOWING = [
  {
    title: 'Negotiating Terms with Quiet Confidence',
    scenario: 'Setting firm commercial boundaries in a multi-party enterprise contract dispute.',
    accent: 'Workplace Executive' as const,
    durationSec: 16,
    difficulty: 'Advanced' as const,
    transcript:
      'While we fully respect your position on pricing, / we cannot compromise on our ninety-nine point nine percent service SLA. // Reliability is the bedrock of our partnership; /// therefore, / let us explore alternative concession points / that protect your budget.',
    phoneticBreakdown: [
      {
        phrase: 'While we fully respect your position',
        focus: 'Smooth rhythmic cadence; unreduced /fʊl.i/ with polite tone',
        ipaNotes: '/waɪl wiː ˈfʊl.i rɪˈspɛkt jɔːr pəˈzɪʃ.ən/',
      },
      {
        phrase: 'we cannot compromise on our',
        focus: 'Definitive stress on "cannot" and "compromise"',
        ipaNotes: '/wi ˈkæn.ɑːt ˈkɑːm.prə.maɪz ɑːn aʊ.ɚ/',
      },
      {
        phrase: 'ninety-nine point nine percent',
        focus: 'Flap T in ninety-nine; crisp numerical precision',
        ipaNotes: '/ˈnaɪn.t̬i naɪn pɔɪnt naɪn pɚˈsɛnt/',
      },
      {
        phrase: 'Reliability is the bedrock',
        focus: 'Primary stress on "Reliability" and "bedrock"',
        ipaNotes: '/rɪˌlaɪ.əˈbɪl.ə.t̬i ɪz ðə ˈbɛd.rɑːk/',
      },
    ],
  },
  {
    title: 'The Inspiring Townhall Address',
    scenario: 'Rallying a global team after navigating a challenging fiscal quarter.',
    accent: 'General American' as const,
    durationSec: 15,
    difficulty: 'Intermediate' as const,
    transcript:
      'Every milestone we reached this quarter / was forged through your grit and ingenuity. // Market headwinds will test us, / but our conviction / has never been stronger. /// Thank you for showing up / with unmatched excellence.',
    phoneticBreakdown: [
      {
        phrase: 'Every milestone we reached',
        focus: 'Compound stress on "milestone"; linked "reached this"',
        ipaNotes: '/ˈɛv.ri ˈmaɪl.stoʊn wiː riːtʃt/',
      },
      {
        phrase: 'was forged through your grit',
        focus: 'Voiced dental fricative /ð/ in "through"; crisp /t/ in "grit"',
        ipaNotes: '/wʌz fɔːrdʒd θruː jɔːr ɡrɪt/',
      },
      {
        phrase: 'has never been stronger.',
        focus: 'Melodic falling contour expressing unwavering resolve',
        ipaNotes: '/hæz ˈnɛv.ɚ bɪn ˈstrɔːŋ.ɡɚ/',
      },
    ],
  },
  {
    title: 'The Architectural Engineering Brief',
    scenario: 'Explaining a complex cloud microservices refactor to stakeholders.',
    accent: 'Cultured Mid-Atlantic' as const,
    durationSec: 17,
    difficulty: 'Advanced' as const,
    transcript:
      'By decoupling the monolithic database / into event-driven serverless functions, / we eliminate single points of failure. // The result / is not merely improved throughput, / but instantaneous resilience / under extreme traffic spikes.',
    phoneticBreakdown: [
      {
        phrase: 'By decoupling the monolithic database',
        focus: 'Secondary stress on "decoupling"; clear syllabification',
        ipaNotes: '/baɪ diːˈkʌp.lɪŋ ðə ˌmɑː.nəˈlɪθ.ɪk ˈdeɪ.t̬ə.beɪs/',
      },
      {
        phrase: 'into event-driven serverless functions,',
        focus: 'Connected speech linking; clean flap T in event-driven',
        ipaNotes: '/ˈɪn.tuː ɪˈvɛnt ˌdrɪv.ən ˈsɝː.vɚ.ləs ˈfʌŋk.ʃənz/',
      },
      {
        phrase: 'but instantaneous resilience',
        focus: 'Vowel reduction in /ˌɪn.stənˈteɪ.ni.əs rɪˈzɪl.jəns/',
        ipaNotes: '/bʌt ˌɪn.stənˈteɪ.ni.əs rɪˈzɪl.jəns/',
      },
    ],
  },
];

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Speaking studio generation limit reached. Please wait a few minutes.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const type = body.type || 'jam';
    const category = body.category && body.category !== 'All' ? body.category : undefined;

    const geminiKey = process.env.GEMINI_API_KEY;

    if (type === 'jam') {
      if (geminiKey) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6500);

          const promptText = `You are a master English speech coach. Generate ONE fresh, intellectually engaging 60-Second JAM (Just-A-Minute) Speaking Topic.
${category ? `Category preferred: ${category}.` : 'Choose any compelling category: Workplace, Technology, Personal Growth, Society, or Creative.'}

Respond ONLY with a valid JSON object strictly matching this schema with NO markdown code fences, NO preamble, and NO extra text:
{
  "category": "Workplace",
  "title": "Topic Title (4-7 words)",
  "prompt": "Thought-provoking question for the speaker",
  "keyVocabulary": ["power phrase 1", "vocabulary 2", "collocation 3", "idiom 4", "term 5"],
  "framework": {
    "point": "PEEL Point: 1 clear opening thesis sentence (approx 10-15 words)",
    "evidence": "PEEL Evidence: 1 concrete factual or observational example",
    "explanation": "PEEL Explanation: 1 deeper analytical insight",
    "link": "PEEL Link: 1 concluding takeaway sentence"
  },
  "sampleResponse": "An articulate, spoken-English masterclass model response (110-135 words) delivered in a warm, dignified cadence suitable for audio playback."
}`;

          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 600,
              },
            }),
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleanJson = rawText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);
              if (parsed.title && parsed.prompt && parsed.framework) {
                return NextResponse.json({
                  success: true,
                  source: 'gemini',
                  topic: {
                    id: `jam-ai-${Date.now()}`,
                    category: parsed.category || category || 'Workplace',
                    title: parsed.title,
                    prompt: parsed.prompt,
                    keyVocabulary: parsed.keyVocabulary || ['clarity', 'perspective', 'articulation', 'nuance', 'impact'],
                    framework: parsed.framework,
                    sampleResponse: parsed.sampleResponse,
                  },
                });
              }
            }
          }
        } catch {
          // Fall through to curated randomized generator
        }
      }

      // High-quality curated random fallback
      const filtered = category ? FALLBACK_JAM_TOPICS.filter((t) => t.category === category) : FALLBACK_JAM_TOPICS;
      const pool = filtered.length > 0 ? filtered : FALLBACK_JAM_TOPICS;
      const pick = pool[Math.floor(Math.random() * pool.length)];

      return NextResponse.json({
        success: true,
        source: 'curated_fallback',
        topic: {
          ...pick,
          id: `jam-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      });
    }

    if (type === 'shadowing') {
      if (geminiKey) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6500);

          const promptText = `You are an elite Hollywood & Executive English Accent Coach. Generate ONE original speech shadowing exercise for advanced spoken cadence.
Respond ONLY with a valid JSON object with NO markdown code fences, NO preamble, and NO extra text:
{
  "title": "Concise Descriptive Title (4-6 words)",
  "scenario": "Specific workplace, diplomatic, or keynote speaking context",
  "accent": "General American",
  "durationSec": 15,
  "difficulty": "Intermediate",
  "transcript": "Natural spoken sentence with single slash / for brief pauses, double slash // for breath pauses, and triple slash /// for major emphatic pauses (40-60 words).",
  "phoneticBreakdown": [
    {
      "phrase": "Short excerpt phrase",
      "focus": "Exact accent mechanism (e.g. Flap T, Schwa reduction, Linked consonants, Pitch contour)",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Second excerpt phrase",
      "focus": "Intonation or stress guidance",
      "ipaNotes": "/IPA transcription/"
    }
  ]
}`;

          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: promptText }] }],
              generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 600,
              },
            }),
          });
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawText) {
              const cleanJson = rawText.replace(/```[a-z]*\n?/gi, '').replace(/```/g, '').trim();
              const parsed = JSON.parse(cleanJson);
              if (parsed.title && parsed.transcript && parsed.phoneticBreakdown) {
                return NextResponse.json({
                  success: true,
                  source: 'gemini',
                  exercise: {
                    id: `sh-ai-${Date.now()}`,
                    title: parsed.title,
                    scenario: parsed.scenario || 'Executive workplace communication.',
                    accent: parsed.accent || 'General American',
                    durationSec: parsed.durationSec || 15,
                    difficulty: parsed.difficulty || 'Intermediate',
                    transcript: parsed.transcript,
                    phoneticBreakdown: parsed.phoneticBreakdown,
                  },
                });
              }
            }
          }
        } catch {
          // Fall through to curated fallback
        }
      }

      const pick = FALLBACK_SHADOWING[Math.floor(Math.random() * FALLBACK_SHADOWING.length)];
      return NextResponse.json({
        success: true,
        source: 'curated_fallback',
        exercise: {
          ...pick,
          id: `sh-ai-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid generation type specified' }, { status: 400 });
  } catch (err) {
    console.error('Speaking generation error:', err);
    return NextResponse.json({ error: 'Failed to generate speaking topic' }, { status: 500 });
  }
}
