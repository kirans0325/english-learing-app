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
      evidence: 'Leading distributed engineering teams resolve over 75% of operational blockers through structured memos rather than impromptu video calls.',
      explanation: 'Constant calendar interruptions destroy deep work and generate cognitive fatigue, whereas deliberate asynchronous exchanges foster thoughtful decision-making.',
      link: 'Consequently, the future of global work belongs to organizations that master written operational clarity.',
    },
    sampleResponse:
      'Operating across global time zones requires a fundamental mindset shift from presence to documented accountability. In traditional office environments, communication happens haphazardly through hallway chatter or urgent calendar invites. While this feels fast, it frequently excludes distributed colleagues and fragments focus.\n\nIn contrast, high-performing asynchronous organizations operate on a disciplined principle: if it is not documented transparently, it does not exist. Every strategic decision, project specification, and architectural review is logged in clear written prose. A developer in Tokyo can review a proposal drafted in London, leaving thoughtful, nuanced feedback during their peak energy hours rather than groggily joining a midnight video conference.\n\nBy replacing hurried meetings with well-crafted memos, we eliminate the tyranny of time zones, protect deep intellectual focus, and empower colleagues with true autonomous ownership. The future of sustainable enterprise leadership is written, deliberate, and asynchronous.',
  },
  {
    category: 'Technology',
    title: 'The Ethics of Autonomous Decision Systems',
    prompt: 'Should automated algorithms be allowed to make critical financial or hiring decisions without human veto power?',
    keyVocabulary: ['algorithmic accountability', 'black-box opacity', 'human-in-the-loop', 'unconscious bias', 'systemic equity'],
    framework: {
      point: 'Critical decisions affecting human livelihoods must mandate human-in-the-loop oversight to prevent systemic algorithmic discrimination.',
      evidence: 'Historical predictive models have repeatedly penalized qualified candidates due to biased legacy training datasets and black-box opacity.',
      explanation: 'While machine learning models identify statistical correlations with speed, they cannot comprehend moral context or institutional equity.',
      link: 'Therefore, artificial intelligence should serve as an advisor, never the final judge.',
    },
    sampleResponse:
      'The allure of fully autonomous decision-making lies in speed, efficiency, and perceived mathematical impartiality. However, delegating life-altering decisions—such as credit approvals, medical triage, or job candidate screening—to closed black-box models is profoundly dangerous.\n\nMachine learning models do not invent original moral principles; they extrapolate from historical patterns. When legacy datasets contain systemic bias, algorithms do not eliminate prejudice—they codify and amplify it at scale with cold mathematical precision. A hiring algorithm trained on past corporate promotions may quietly penalize non-traditional candidates simply because they do not match legacy keywords.\n\nA robust human-in-the-loop architecture ensures that moral nuance, personal context, and ethical empathy remain central to governance. Algorithms should be leveraged to surface patterns, flag anomalies, and digest vast datasets, but the final verdict must always rest with human conscience. Technology must inform judgment, never replace responsibility.',
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
      'We live in a culture that dangerously equates busyness with significance. We are bombarded with notifications, meetings, and endless micro-decisions that scatter our attention across trivialities. Yet, when you study the world’s most impactful creators, researchers, and leaders, you discover a fierce commitment to radical simplification.\n\nEvery human being awakens each morning with a finite reservoir of cognitive energy. If we exhaust that mental bandwidth deciding what outfit to wear, arguing in social media comment sections, or attending ill-defined status meetings, we leave our deepest creative ambitions starved of fuel. Figures like Steve Jobs and Nobel laureates deliberately designed minimalist environments to eliminate decision fatigue on secondary matters.\n\nRadical simplification is not about deprivation or living with empty shelves; it is about essentialism. It is the courage to say a decisive "no" to trivial opportunities so that we can channel our full, undivided genius into the work that truly matters. Simplicity is the ultimate sophistication.',
  },
  {
    category: 'Society',
    title: 'Bridging the Generational Workplace Divide',
    prompt: 'How can multi-generational teams turn differing values on hierarchy and work ethic into a competitive advantage?',
    keyVocabulary: ['intergenerational synergy', 'tacit institutional knowledge', 'digital fluency', 'mutual mentorship', 'cross-generational empathy'],
    framework: {
      point: 'High-performing teams pair the seasoned institutional judgment of veterans with the digital fluency of younger entrants.',
      evidence: 'Reverse mentorship programs have helped traditional Fortune 500 banks accelerate digital adoption by over 40%.',
      explanation: 'Senior leaders provide risk mitigation and political savvy, while junior contributors bring fresh perspectives and agile methodologies.',
      link: 'When mutual respect supersedes generational stereotypes, diversity transforms into market resilience.',
    },
    sampleResponse:
      'For the first time in modern economic history, four distinct generations share the corporate workplace—from Baby Boomers and Gen X to Millennials and Gen Z. It is tempting to reduce these demographic differences to simplistic workplace memes, labeling younger colleagues as impatient or veterans as resistant to innovation.\n\nHowever, visionary leaders recognize that intergenerational friction can be transmuted into an unmatched competitive advantage. Seasoned professionals possess tacit institutional knowledge, crisis management composure, and an intuitive grasp of human diplomacy that cannot be downloaded from an online course. Concurrently, younger entrants bring native fluency with artificial intelligence, rapid prototyping, and a healthy skepticism toward outdated legacy processes.\n\nWhen organizations establish mutual two-way mentorship, the magic happens: senior executives gain digital fluency, while emerging talents learn political finesse and stakeholder alignment. By cultivating cross-generational empathy, we build resilient teams where experience guides energy, and innovation rejuvenates wisdom.',
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
      'There is a widespread misconception that artistic and technological innovation thrives in absolute freedom. In reality, unlimited resources and infinite options frequently breed paralysis and creative complacency. When an engineering team has an infinite budget and no hard deadline, they waste quarters debating abstract architectures and accumulating bloated features.\n\nIntroduce a strict boundary, however, and human ingenuity explodes. When Dr. Seuss was challenged by his publisher to write an engaging children’s book using strictly fifty vocabulary words, the result was "Green Eggs and Ham"—one of the best-selling books in literary history. The constraint forced him to examine every syllable, eliminate filler, and maximize comedic rhythm.\n\nConstraints act as intellectual guardrails. They force us to strip away vanity metrics, interrogate our core assumptions, and discover unconventional workarounds that abundance would have obscured. Do not lament your limitations; embrace them as the exact blueprint of your next breakthrough.',
  },
];

// Curated high-yield fallbacks for Shadowing Exercises
const FALLBACK_SHADOWING = [
  {
    title: 'Negotiating Terms with Quiet Confidence',
    scenario: 'Setting firm commercial boundaries in a multi-party enterprise contract dispute.',
    accent: 'Workplace Executive' as const,
    durationSec: 36,
    difficulty: 'Advanced' as const,
    transcript:
      'While we fully respect your position on pricing, / we cannot compromise on our ninety-nine point nine percent service SLA. // Reliability is the bedrock of our enterprise partnership; /// cutting corners today / will cost both of our organizations / exponentially more tomorrow. // Let us explore creative concession points / on multi-year payment terms, /// while keeping our performance architecture / completely uncompromised.',
    phoneticBreakdown: [
      {
        phrase: 'While we fully respect your position',
        focus: 'Smooth rhythmic cadence; unreduced /fʊl.i/ with polite, diplomatic tone',
        ipaNotes: '/waɪl wiː ˈfʊl.i rɪˈspɛkt jɔːr pəˈzɪʃ.ən/',
      },
      {
        phrase: 'we cannot compromise on our',
        focus: 'Definitive stress on "cannot" and "compromise"',
        ipaNotes: '/wi ˈkæn.ɑːt ˈkɑːm.prə.maɪz ɑːn aʊ.ɚ/',
      },
      {
        phrase: 'exponentially more tomorrow.',
        focus: 'Crisp rhythm on multi-syllabic "ex-po-nen-tial-ly"',
        ipaNotes: '/ˌɛk.spoʊˈnɛn.ʃəl.i mɔːr təˈmɑːr.oʊ/',
      },
      {
        phrase: 'completely uncompromised.',
        focus: 'Terminal falling intonation asserting executive authority',
        ipaNotes: '/kəmˈpliːt.li ˌʌnˈkɑːm.prə.maɪzd/',
      },
    ],
  },
  {
    title: 'The Inspiring Townhall Address',
    scenario: 'Rallying a global team after navigating a challenging fiscal quarter.',
    accent: 'General American' as const,
    durationSec: 35,
    difficulty: 'Intermediate' as const,
    transcript:
      'Every milestone we reached this quarter / was forged through your grit, / intellectual curiosity, / and relentless ingenuity. // Market headwinds will inevitably test us, / but our underlying conviction / has never been stronger. /// True leadership / is not proven during tranquil seas, / but during turbulent storms. /// Thank you for showing up every single day / with unmatched excellence.',
    phoneticBreakdown: [
      {
        phrase: 'Every milestone we reached this quarter',
        focus: 'Compound stress on "milestone"; linked "reached this"',
        ipaNotes: '/ˈɛv.ri ˈmaɪl.stoʊn wiː riːtʃt ðɪs ˈkwɔːr.t̬ɚ/',
      },
      {
        phrase: 'was forged through your grit,',
        focus: 'Voiced dental fricative /ð/ in "through"; sharp /t/ in "grit"',
        ipaNotes: '/wʌz fɔːrdʒd θruː jɔːr ɡrɪt/',
      },
      {
        phrase: 'is not proven during tranquil seas,',
        focus: 'Breath cadence pause after "seas" before rhythmic contrast',
        ipaNotes: '/ɪz nɑːt ˈpruː.vən ˈdʊr.ɪŋ ˈtræŋ.kwəl siːz/',
      },
      {
        phrase: 'with unmatched excellence.',
        focus: 'Melodic falling contour expressing profound executive gratitude',
        ipaNotes: '/wɪð ʌnˈmætʃt ˈɛk.səl.əns/',
      },
    ],
  },
  {
    title: 'The Architectural Engineering Brief',
    scenario: 'Explaining a complex cloud microservices refactor to executive stakeholders.',
    accent: 'Cultured Mid-Atlantic' as const,
    durationSec: 38,
    difficulty: 'Advanced' as const,
    transcript:
      'By decoupling our legacy monolithic database / into event-driven serverless functions, / we eliminate single points of failure across the board. // The architectural result / is not merely improved millisecond throughput, / but instantaneous resilience / under extreme traffic spikes. /// In short, / we are building a platform / that scales seamlessly / with global customer demand.',
    phoneticBreakdown: [
      {
        phrase: 'By decoupling our legacy monolithic database',
        focus: 'Secondary stress on "decoupling"; clear syllabification',
        ipaNotes: '/baɪ diːˈkʌp.lɪŋ aʊ.ɚ ˈlɛɡ.ə.si ˌmɑː.nəˈlɪθ.ɪk ˈdeɪ.t̬ə.beɪs/',
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
      {
        phrase: 'that scales seamlessly with global demand.',
        focus: 'Sibilant /s/ articulation and decisive finality cadence',
        ipaNotes: '/ðæt skeɪlz ˈsiːm.ləs.li wɪð ˈɡloʊ.bəl dɪˈmænd/',
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
    const customTopic =
      typeof body.customTopic === 'string' && body.customTopic.trim() ? body.customTopic.trim() : undefined;

    const geminiKey = process.env.GEMINI_API_KEY;

    if (type === 'jam') {
      if (geminiKey) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 9500);

          const promptText = customTopic
            ? `You are an elite master English speech coach. The user wants to practice a 60-Second JAM (Just-A-Minute) Speaking Challenge specifically on this DESIRED TOPIC: "${customTopic}".
Generate ONE intellectually engaging 60-Second JAM Speaking Topic directly addressing "${customTopic}".
${category ? `Category context: ${category}.` : ''}

Respond ONLY with a valid JSON object strictly matching this schema with NO markdown code fences, NO preamble, and NO extra text:
{
  "category": "${category || 'Custom'}",
  "title": "Engaging Title for ${customTopic} (4-7 words)",
  "prompt": "Thought-provoking question for the speaker directly on ${customTopic}",
  "keyVocabulary": ["power phrase 1", "vocabulary 2", "collocation 3", "idiom 4", "term 5"],
  "framework": {
    "point": "PEEL Point: 1 clear thesis sentence on ${customTopic} (approx 10-15 words)",
    "evidence": "PEEL Evidence: 1 concrete factual or observational example",
    "explanation": "PEEL Explanation: 1 analytical rationale",
    "link": "PEEL Link: 1 concluding takeaway sentence"
  },
  "sampleResponse": "A comprehensive, articulate, multi-paragraph masterclass model speech (190-240 words) strictly adhering to the PEEL framework (Point, Evidence, Explanation, Link). Separate into 2-3 logical paragraphs using double newlines (\\n\\n) to ensure a structured, elegant delivery suitable for audio playback."
}`
            : `You are a master English speech coach. Generate ONE fresh, intellectually engaging 60-Second JAM (Just-A-Minute) Speaking Topic.
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
  "sampleResponse": "A comprehensive, articulate, multi-paragraph masterclass model speech (190-240 words) strictly adhering to the PEEL framework (Point, Evidence, Explanation, Link). Separate into 2-3 logical paragraphs using double newlines (\\n\\n) to ensure a structured, elegant delivery suitable for audio playback."
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
                maxOutputTokens: 1200,
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

      // Custom topic fallback if Gemini call missed
      if (customTopic) {
        return NextResponse.json({
          success: true,
          source: 'custom_fallback',
          topic: {
            id: `jam-ai-${Date.now()}`,
            category: category || 'Custom Topic',
            title: customTopic.length > 40 ? customTopic.slice(0, 40) : customTopic,
            prompt: `Why is ${customTopic} one of the most critical topics in today's landscape, and how should we approach it?`,
            keyVocabulary: ['strategic clarity', 'nuanced perspective', 'actionable implementation', 'paradigm shift', 'sustainable impact'],
            framework: {
              point: `Addressing ${customTopic} requires moving past superficial assumptions to foundational principles.`,
              evidence: `Industry leaders who proactively innovate in ${customTopic} achieve significant strategic resilience.`,
              explanation: `Failing to navigate the nuances of ${customTopic} creates systemic vulnerabilities over the long term.`,
              link: `Ultimately, mastering our approach to ${customTopic} defines our capacity for forward-looking leadership.`,
            },
            sampleResponse: `When we critically examine ${customTopic}, the central imperative is not merely operational, but foundational to how forward-thinking leaders navigate complexity. In a rapidly changing landscape, superficial answers quickly succumb to diminishing returns, whereas disciplined strategic depth creates compounding, enduring value.\n\nConsider how leading innovators approach ${customTopic}. Rather than reacting impulsively to short-term disruptions, they establish clear architectural frameworks, foster psychological safety across cross-functional teams, and rigorously test their assumptions against empirical reality. By treating ${customTopic} as a core strategic capability rather than an isolated checklist item, they build systems that remain resilient even under intense pressure.\n\nUltimately, our approach to ${customTopic} reveals our organizational maturity. When we combine intellectual curiosity with decisive, transparent execution, we turn ambiguity into our greatest competitive differentiator.`,
          },
        });
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
          const timeoutId = setTimeout(() => controller.abort(), 9500);

          const promptText = customTopic
            ? `You are an elite Hollywood & Executive English Accent Coach. The user wants to practice speech shadowing specifically on this DESIRED TOPIC / SCENARIO: "${customTopic}".
Generate ONE comprehensive, original speech shadowing masterclass exercise for advanced spoken cadence specifically about "${customTopic}".
Respond ONLY with a valid JSON object strictly matching this schema with NO markdown code fences, NO preamble, and NO extra text:
{
  "title": "Concise Descriptive Title for ${customTopic} (4-6 words)",
  "scenario": "Speaking context: ${customTopic}",
  "accent": "General American",
  "durationSec": 35,
  "difficulty": "Intermediate",
  "transcript": "A comprehensive, rhythmic 3-movement spoken speech passage (80-115 words). Use single slash / for momentary rhythm pauses, double slash // for conscious breath pauses, and triple slash /// for dramatic transitions between movements.",
  "phoneticBreakdown": [
    {
      "phrase": "First key rhythmic chunk (3-6 words)",
      "focus": "Exact accent mechanism (e.g. Flap T, Schwa reduction, Linked consonants, Pitch contour)",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Second key rhythmic chunk (3-6 words)",
      "focus": "Stress, reduction, or liaison guidance",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Third key rhythmic chunk (3-6 words)",
      "focus": "Prosodic inflection or cadence focus",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Fourth key rhythmic chunk (3-6 words)",
      "focus": "Terminal falling contour or decisive cadence",
      "ipaNotes": "/IPA transcription/"
    }
  ]
}`
            : `You are an elite Hollywood & Executive English Accent Coach. Generate ONE comprehensive, original speech shadowing masterclass exercise for advanced spoken cadence.
Respond ONLY with a valid JSON object strictly matching this schema with NO markdown code fences, NO preamble, and NO extra text:
{
  "title": "Concise Descriptive Title (4-6 words)",
  "scenario": "Specific workplace, diplomatic, or keynote speaking context",
  "accent": "General American",
  "durationSec": 35,
  "difficulty": "Intermediate",
  "transcript": "A comprehensive, rhythmic 3-movement spoken speech passage (80-115 words). Use single slash / for momentary rhythm pauses, double slash // for conscious breath pauses, and triple slash /// for dramatic transitions between movements.",
  "phoneticBreakdown": [
    {
      "phrase": "First key rhythmic chunk (3-6 words)",
      "focus": "Exact accent mechanism (e.g. Flap T, Schwa reduction, Linked consonants, Pitch contour)",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Second key rhythmic chunk (3-6 words)",
      "focus": "Stress, reduction, or liaison guidance",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Third key rhythmic chunk (3-6 words)",
      "focus": "Prosodic inflection or cadence focus",
      "ipaNotes": "/IPA transcription/"
    },
    {
      "phrase": "Fourth key rhythmic chunk (3-6 words)",
      "focus": "Terminal falling contour or decisive cadence",
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
                maxOutputTokens: 1200,
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
                    durationSec: parsed.durationSec || 35,
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

      if (customTopic) {
        return NextResponse.json({
          success: true,
          source: 'custom_fallback',
          exercise: {
            id: `sh-ai-${Date.now()}`,
            title: customTopic.length > 35 ? customTopic.slice(0, 35) : customTopic,
            scenario: `Executive keynote & strategic reflection on ${customTopic}.`,
            accent: 'General American' as const,
            durationSec: 36,
            difficulty: 'Advanced' as const,
            transcript: `When we critically evaluate ${customTopic}, / we must look beyond immediate surface metrics // to the fundamental architecture that sustains our vision. /// Every enduring breakthrough / in modern industry / was forged not in moments of effortless stability, / but through rigorous, / deliberate iteration. /// If we commit ourselves / to uncompromising execution today, / we lay the groundwork / for exponential value / tomorrow.`,
            phoneticBreakdown: [
              {
                phrase: `When we critically evaluate ${customTopic}`,
                focus: 'Polysyllabic cadence on "critically evaluate"; smooth rising pitch inflection before pause',
                ipaNotes: '/wɛn wi ˈkrɪt̬.ɪ.kli ɪˈvæl.ju.eɪt/',
              },
              {
                phrase: 'to the fundamental architecture that sustains our vision',
                focus: 'Secondary rhythmic stress on "fundamental architecture"; voiceless /s/ linking in sustains',
                ipaNotes: '/tuː ðə ˌfʌn.dəˈmɛn.t̬əl ˈɑːr.kə.tɛk.tʃɚ ðæt səˈsteɪnz aʊ.ɚ ˈvɪʒ.ən/',
              },
              {
                phrase: 'was forged not in moments of effortless stability',
                focus: 'Voiced /d/ coda in "forged"; crisp alveolar /t/ taps in "effortless stability"',
                ipaNotes: '/wʌz fɔːrdʒd nɑːt ɪn ˈmoʊ.mənts əv ˈɛf.ɚt.ləs stəˈbɪl.ə.t̬i/',
              },
              {
                phrase: 'for exponential value tomorrow',
                focus: 'Falling terminal intonation contour conveying decisive executive certainty',
                ipaNotes: '/fɔːr ˌɛk.spoʊˈnɛn.ʃəl ˈvæl.juː təˈmɔːr.oʊ/',
              },
            ],
          },
        });
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
