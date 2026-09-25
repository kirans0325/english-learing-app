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
    title: 'Remote Work vs. Office Collaboration',
    prompt: 'Should companies allow employees to work remotely forever, or is in-person collaboration essential?',
    keyVocabulary: ['productivity', 'work-life integration', 'serendipitous hallway conversations', 'tangible deliverables', 'hybrid model'],
    framework: {
      point: 'A blended hybrid model delivers the highest sustainable productivity and employee well-being.',
      evidence: 'Studies show deep focus tasks thrive in home offices, while complex team brainstorming benefits from in-person energy.',
      explanation: 'Remote flexibility reduces burnout from daily commutes, but complete isolation weakens company culture over time.',
      link: 'Therefore, modern leaders should measure output rather than physical presence.',
    },
    sampleResponse:
      'In today’s fast-paced economy, the debate between remote work and office presence boils down to intentionality. I believe a balanced hybrid model offers the best of both worlds. For focused, analytical tasks like coding or strategic writing, working from home eliminates grueling commutes and unnecessary interruptions. However, when it comes to creative brainstorming and cross-functional team trust, face-to-face interactions spark spontaneous ideas that digital chats simply cannot replicate. Ultimately, companies shouldn’t force employees into rigid extremes; rather, we should measure employees by tangible deliverables and value, empowering professionals to choose the optimal environment for each task.',
  },
  {
    id: 'jam-2',
    category: 'Technology',
    title: 'Artificial Intelligence in Everyday Education',
    prompt: 'Is AI helping students learn faster, or is it making critical thinking obsolete?',
    keyVocabulary: ['personalized pedagogy', 'cognitive offloading', 'critical evaluation', 'interactive tutor', 'synthesis'],
    framework: {
      point: 'AI is a multiplier for curious minds, provided we teach students verification rather than blind acceptance.',
      evidence: 'Language learners can now practice conversational English 24/7 with instant grammatical feedback.',
      explanation: 'When AI acts as a patient coach rather than an answer cheat sheet, deep conceptual comprehension skyrockets.',
      link: 'The priority of modern education is shifting from memorization to rigorous critical evaluation.',
    },
    sampleResponse:
      'Artificial intelligence is neither a villain nor a savior—it is an amplifier of human intent. In modern education, AI provides unprecedented personalized tutoring. A student struggling with complex grammar or calculus can ask for ten different analogies until the concept clicks, something a single classroom teacher rarely has time to provide. The real danger is cognitive passivity—copying answers without understanding the underlying mechanics. As educators, our mission is no longer to test rote memorization, but to train students in critical evaluation, ethical inquiry, and original synthesis.',
  },
  {
    id: 'jam-3',
    category: 'Personal Growth',
    title: 'The Value of Embracing Public Failure',
    prompt: 'Why is failure often a more reliable teacher than immediate success?',
    keyVocabulary: ['resilience', 'iterative improvement', 'complacency', 'humility', 'growth mindset'],
    framework: {
      point: 'Early failure shatters illusions of competence and forces rigorous self-examination.',
      evidence: 'Every master speaker was once a nervous beginner who stumbled through awkward pauses.',
      explanation: 'Success often breeds complacency, while constructive failure isolates the precise skills needing refinement.',
      link: 'Embracing discomfort is the only proven shortcut to mastery.',
    },
    sampleResponse:
      'Most people run away from failure because our culture glorifies effortless triumph. Yet, in my experience, failure is the only genuine catalyst for long-term mastery. When you succeed on your first attempt, you rarely understand why—you might simply have been lucky. But when you stumble during a presentation or fail a challenging exam, the pain forces you to examine your assumptions, identify blind spots, and rebuild with intentional discipline. Failure strips away ego and builds true resilience. As the philosopher Seneca observed, difficulties strengthen the mind, as labor does the body.',
  },
  {
    id: 'jam-4',
    category: 'Society',
    title: 'Social Media: Connection or Digital Isolation?',
    prompt: 'Has social media brought people closer together or increased loneliness?',
    keyVocabulary: ['algorithmic echo chambers', 'curated highlights', 'superficial connectivity', 'meaningful community', 'digital detox'],
    framework: {
      point: 'Social platforms offer boundless connectivity but shallow emotional intimacy.',
      evidence: 'We know what an acquaintance had for breakfast 5,000 miles away, yet feel unable to call anyone in a crisis.',
      explanation: 'Comparing raw everyday lives to polished digital highlight reels generates chronic inadequacy.',
      link: 'We must cultivate offline presence while using digital tools purely as utilitarian communication channels.',
    },
    sampleResponse:
      'We are living in the most hyper-connected era in human history, yet study after study reveals epidemic levels of loneliness. Social media provides the illusion of companionship without the demands of real intimacy. We scroll through hundreds of curated highlight reels, subconsciously comparing our messy behind-the-scenes realities with others’ staged triumphs. While these platforms can mobilize movements and keep far-flung families in touch, they cannot replace the warmth of shared silence, eye contact, and authentic vulnerability. True belonging requires being seen in our entirety, not through a polished filter.',
  },
  {
    id: 'jam-5',
    category: 'Creative',
    title: 'If You Could Teach the World One Skill',
    prompt: 'If you had the power to instantly give every human being one skill, what would it be?',
    keyVocabulary: ['empathic listening', 'de-escalation', 'cognitive empathy', 'constructive dialogue', 'unconscious bias'],
    framework: {
      point: 'The single most transformative skill humanity needs is active, non-judgmental listening.',
      evidence: 'Most international conflicts and personal divorces stem from individuals feeling invalidated and unheard.',
      explanation: 'We spend years teaching children how to read and speak, but virtually zero time teaching them how to truly hear others.',
      link: 'Genuine listening dissolves hostility before polarization takes root.',
    },
    sampleResponse:
      'If I could bestow one superpower upon humanity, it would not be coding, rhetoric, or economics—it would be the rare art of empathic listening. Most people do not listen with the intent to understand; they listen with the intent to reply. We reload our arguments while the other person is still speaking. If everyone possessed the ability to quiet their inner monologue, set aside defensive pride, and genuinely step into another person’s lived experience for sixty seconds, the vast majority of our political polarization and relationship breakdowns would dissolve. When people feel deeply understood, conflict transforms into collaboration.',
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

  const handleFetchAiRandomTopic = async () => {
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
            onClick={handleFetchAiRandomTopic}
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

      {/* Category Tabs */}
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
          onClick={handleFetchAiRandomTopic}
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
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic">
                &ldquo;{activeTopic.sampleResponse}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
