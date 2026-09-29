'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  CheckCircle2,
  Shuffle,
  Lightbulb,
  Award,
  ChevronRight,
  Bot,
  Loader2,
} from 'lucide-react';
import { speakWithPhilosopherVoice, stopSpeech } from '@/lib/utils/speech';

export interface JamTopic {
  id: string;
  category: 'Workplace' | 'Technology' | 'Personal Growth' | 'Society' | 'Creative';
  title: string;
  prompt: string;
  keyVocabulary: string[];
  framework: {
    point: string;
    evidence: string;
    explanation: string;
    link: string;
  };
  sampleResponse: string;
}

export const JAM_TOPICS: JamTopic[] = [
  {
    id: 'jam-1',
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
    id: 'jam-2',
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
    id: 'jam-3',
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
    id: 'jam-4',
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
    id: 'jam-5',
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

export function JamTopicStudio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTopic, setActiveTopic] = useState<JamTopic>(JAM_TOPICS[0]);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSpeakingSample, setIsSpeakingSample] = useState<boolean>(false);
  const [showSample, setShowSample] = useState<boolean>(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'curated' | null>(null);
  const [desiredTopicInput, setDesiredTopicInput] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ['All', 'Workplace', 'Technology', 'Personal Growth', 'Society', 'Creative'];

  const filteredTopics =
    selectedCategory === 'All'
      ? JAM_TOPICS
      : JAM_TOPICS.filter((t) => t.category === selectedCategory);

  // Countdown timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleStartTimer = () => {
    setIsRunning(true);
  };

  const handlePauseTimer = () => {
    setIsRunning(false);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(60);
  };

  const handleRandomTopic = () => {
    stopSpeech();
    setIsSpeakingSample(false);
    handleResetTimer();
    setShowSample(false);
    const available = filteredTopics.filter((t) => t.id !== activeTopic.id);
    const pick = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : activeTopic;
    setActiveTopic(pick);
  };

  const handleFetchAiTopic = async (customTopicParam?: string) => {
    stopSpeech();
    setIsSpeakingSample(false);
    handleResetTimer();
    setShowSample(false);
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/speaking/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'jam',
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          customTopic: customTopicParam?.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.topic) {
          setActiveTopic(data.topic);
          setGenerationSource(data.source === 'gemini' ? 'gemini' : 'curated');
          return;
        }
      }
    } catch {
      // Fallback below
    } finally {
      setIsGeneratingAi(false);
    }

    // Client-side fallback if network or API unavailable
    handleRandomTopic();
  };

  const toggleSampleVoice = async () => {
    if (isSpeakingSample) {
      stopSpeech();
      setIsSpeakingSample(false);
      return;
    }

    setIsSpeakingSample(true);
    await speakWithPhilosopherVoice(activeTopic.sampleResponse, {
      rate: 0.98,
      pitch: 0.89,
      onEnd: () => setIsSpeakingSample(false),
      onError: () => setIsSpeakingSample(false),
    });
  };

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-sky-200/90 bg-linear-to-b from-white via-sky-50/20 to-white shadow-md">
      {/* Studio Header */}
      <div className="border-b border-sky-100 bg-linear-to-r from-sky-600 via-teal-600 to-sky-700 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
              <Timer className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold leading-tight">JAM Speaking Studio</h3>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-100">
                  Just A Minute (60s)
                </span>
              </div>
              <p className="text-xs text-sky-100/90 mt-0.5">
                Practice spontaneous speech with structured PEEL framework & Philosopher AI audio
              </p>
            </div>
          </div>

          <button
            onClick={() => handleFetchAiTopic()}
            disabled={isGeneratingAi}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/25 active:scale-95 transition disabled:opacity-50"
            title="Generate a brand new topic using Gemini API"
          >
            {isGeneratingAi ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Shuffle className="h-3.5 w-3.5" />
            )}
            <span>{isGeneratingAi ? 'Generating...' : 'Random Topic (AI)'}</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Random Button */}
      <div className="flex items-center overflow-x-auto border-b border-slate-100 bg-slate-50/60 px-6 py-2.5 gap-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              const list = cat === 'All' ? JAM_TOPICS : JAM_TOPICS.filter((t) => t.category === cat);
              if (list.length > 0) setActiveTopic(list[0]);
              setGenerationSource(null);
              handleResetTimer();
            }}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition shrink-0 ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-sky-50 hover:text-sky-800'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={() => handleFetchAiTopic()}
          disabled={isGeneratingAi}
          className="rounded-lg px-3 py-1 text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white shadow-xs hover:opacity-95 active:scale-95 disabled:opacity-50 shrink-0 ml-auto sm:ml-2"
          title="Generate a brand new topic in real-time with Google Gemini AI"
        >
          {isGeneratingAi ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 text-emerald-200 animate-pulse" />
              <span>🎲 AI Random (Gemini)</span>
            </>
          )}
        </button>
      </div>

      {/* Desired Topic Custom Input & Explore Button (near random button) */}
      <div className="border-b border-sky-100/70 bg-gradient-to-r from-sky-50/80 via-white to-teal-50/50 px-6 py-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (desiredTopicInput.trim()) {
              handleFetchAiTopic(desiredTopicInput);
            }
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={desiredTopicInput}
              onChange={(e) => setDesiredTopicInput(e.target.value)}
              placeholder="Enter your desired topic (e.g. Climate change, Job interview, AI in medicine)..."
              disabled={isGeneratingAi}
              className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={isGeneratingAi || !desiredTopicInput.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 active:scale-95 disabled:opacity-50 transition shrink-0"
            title="Explore your desired topic using Gemini AI"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-sky-200" />
                <span>Explore Topic</span>
              </>
            )}
          </button>
        </form>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {/* Active Prompt Card & Timer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Prompt Details (8 cols) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[11px] font-bold text-sky-800">
                {activeTopic.category}
              </span>
              <span className="text-xs text-slate-400">• 60-Second Challenge</span>
              {generationSource === 'gemini' && (
                <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5 text-emerald-600" />
                  <span>Gemini AI Generated</span>
                </span>
              )}
            </div>

            <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {activeTopic.title}
            </h4>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-sky-50/60 p-4 rounded-2xl border border-sky-100">
              &ldquo;{activeTopic.prompt}&rdquo;
            </p>

            {/* Key Vocabulary to inject */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Target Power Vocabulary to Include:
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activeTopic.keyVocabulary.map((word, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200"
                  >
                    #{word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Countdown Timer (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-3xl bg-linear-to-b from-slate-900 to-slate-800 text-white shadow-lg">
            <div className="relative flex items-center justify-center">
              <div className="text-center">
                <span className="block text-5xl font-black tracking-tight font-mono">
                  {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
                  {String(timeLeft % 60).padStart(2, '0')}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-slate-400 font-semibold mt-1">
                  {timeLeft === 0 ? 'Time Up! Excellent Job!' : isRunning ? 'Speaking Now...' : 'Ready to Speak'}
                </span>
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 10 ? 'bg-rose-500' : 'bg-emerald-400'
                }`}
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 mt-5">
              {!isRunning ? (
                <button
                  onClick={handleStartTimer}
                  disabled={timeLeft === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-600 active:scale-95 transition disabled:opacity-40"
                >
                  <Play className="h-3.5 w-3.5" />
                  <span>Start 60s</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTimer}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 active:scale-95 transition"
                >
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </button>
              )}

              <button
                onClick={handleResetTimer}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-700 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-600 active:scale-95 transition"
                title="Reset timer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Structured 4-Step PEEL Framework Outline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800">
            <Lightbulb className="h-4 w-4 text-sky-600" />
            <span>Recommended 60-Second PEEL Outline Strategy</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="rounded-xl bg-sky-50/60 p-3 border border-sky-100">
              <span className="font-bold text-sky-900 block mb-1">1. Point (10s)</span>
              <p className="text-slate-700 leading-relaxed">{activeTopic.framework.point}</p>
            </div>
            <div className="rounded-xl bg-emerald-50/60 p-3 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">2. Evidence (20s)</span>
              <p className="text-slate-700 leading-relaxed">{activeTopic.framework.evidence}</p>
            </div>
            <div className="rounded-xl bg-indigo-50/60 p-3 border border-indigo-100">
              <span className="font-bold text-indigo-900 block mb-1">3. Explanation (20s)</span>
              <p className="text-slate-700 leading-relaxed">{activeTopic.framework.explanation}</p>
            </div>
            <div className="rounded-xl bg-purple-50/60 p-3 border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">4. Link / Conclusion (10s)</span>
              <p className="text-slate-700 leading-relaxed">{activeTopic.framework.link}</p>
            </div>
          </div>
        </div>

        {/* Model Response with Philosopher AI Audio */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Model 60-Second Exemplar Response
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSampleVoice}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold shadow-2xs transition active:scale-95 ${
                  isSpeakingSample
                    ? 'border-emerald-500 bg-emerald-600 text-white'
                    : 'border-emerald-300 bg-white text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                {isSpeakingSample ? (
                  <>
                    <VolumeX className="h-3.5 w-3.5 animate-pulse" />
                    <span>Stop Philosopher Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Listen (The Philosopher AI)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowSample(!showSample)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                {showSample ? 'Hide Script' : 'Show Script'}
              </button>
            </div>
          </div>

          {showSample && (
            <div className="rounded-xl bg-white p-4 border border-emerald-100/80 shadow-2xs animate-in fade-in">
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic whitespace-pre-line">
                &ldquo;{activeTopic.sampleResponse}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
