'use client';

import React, { useState, useEffect } from 'react';
import {
  Mic2,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Award,
  Layers,
  Repeat,
  CheckCircle,
  HelpCircle,
  Headphones,
  Loader2,
} from 'lucide-react';
import { speakWithPhilosopherVoice, stopSpeech } from '@/lib/utils/speech';

export interface ShadowingExercise {
  id: string;
  title: string;
  scenario: string;
  accent: 'General American' | 'Cultured Mid-Atlantic' | 'Workplace Executive';
  durationSec: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  transcript: string;
  phoneticBreakdown: {
    phrase: string;
    focus: string;
    ipaNotes: string;
  }[];
}

export const SHADOWING_EXERCISES: ShadowingExercise[] = [
  {
    id: 'sh-1',
    title: 'The Confident Elevator Pitch',
    scenario: 'Introducing your strategic expertise in a high-stakes executive interview.',
    accent: 'Workplace Executive',
    durationSec: 15,
    difficulty: 'Intermediate',
    transcript:
      'Over the past five years, / I’ve led cross-functional teams // to streamline operations and scale revenue by thirty percent. /// My passion lies in solving ambiguous bottlenecks / through data-driven clarity.',
    phoneticBreakdown: [
      {
        phrase: 'Over the past five years,',
        focus: 'Rising intonation on "years" indicating continuation',
        ipaNotes: '/ˈoʊ.vɚ ðə pæst faɪv jɪərz/',
      },
      {
        phrase: 'I’ve led cross-functional teams',
        focus: 'Compound noun stress: primary stress on "cross"',
        ipaNotes: '/aɪv lɛd ˌkrɔsˈfʌŋk.ʃən.əl tiːmz/',
      },
      {
        phrase: 'to streamline operations',
        focus: 'Flap T in operations; smooth vowel linking',
        ipaNotes: '/tu ˈstriːm.laɪn ˌɑː.pɚˈeɪ.ʃənz/',
      },
      {
        phrase: 'through data-driven clarity.',
        focus: 'Final falling pitch contour signifying authority',
        ipaNotes: '/θruː ˈdeɪ.t̬ə ˈdrɪv.ən ˈklær.ə.t̬i/',
      },
    ],
  },
  {
    id: 'sh-2',
    title: 'Diplomatic Disagreement in Meetings',
    scenario: 'Politely redirecting a colleague without sounding confrontational or defensive.',
    accent: 'Cultured Mid-Atlantic',
    durationSec: 14,
    difficulty: 'Intermediate',
    transcript:
      'I definitely see the merit in your proposal, / and I appreciate the thorough analysis. // However, / have we factored in the potential latency risks / for our international enterprise clients?',
    phoneticBreakdown: [
      {
        phrase: 'I definitely see the merit',
        focus: 'Stress on "definitely" and "merit" shows goodwill',
        ipaNotes: '/aɪ ˈdɛf.ən.ət.li siː ðə ˈmɛr.ɪt/',
      },
      {
        phrase: 'However, have we factored in',
        focus: 'Glottal pause after "However"; linked "factored-in"',
        ipaNotes: '/haʊˈɛv.ɚ / hæv wi ˈfæk.tɚd ɪn/',
      },
      {
        phrase: 'the potential latency risks',
        focus: 'Mid-vowel reduction to schwa in "potential"',
        ipaNotes: '/ðə pəˈtɛn.ʃəl ˈleɪ.tən.si rɪsks/',
      },
    ],
  },
  {
    id: 'sh-3',
    title: 'The Visionary Tech Keynote',
    scenario: 'Inspiring an audience with rhythmic storytelling and deliberate, dramatic pauses.',
    accent: 'General American',
    durationSec: 18,
    difficulty: 'Advanced',
    transcript:
      'Technology is at its best / not when it dazzles us with complexity, // but when it quietly disappears into the background / of our daily lives. /// True innovation / should feel like second nature.',
    phoneticBreakdown: [
      {
        phrase: 'Technology is at its best',
        focus: 'Flap T in "at its" sounds like [æ.dɪts]',
        ipaNotes: '/tɛkˈnɑː.lə.dʒi ɪz æt ɪts bɛst/',
      },
      {
        phrase: 'not when it dazzles us with complexity,',
        focus: 'Rhythmic staccato cadence; sharp stop on "not"',
        ipaNotes: '/nɑːt wɛn ɪt ˈdæz.əlz ʌs/',
      },
      {
        phrase: 'quietly disappears into the background',
        focus: 'Glottal stop in "quietly" [ˈkwaɪ.ət.li]',
        ipaNotes: '/ˈkwaɪ.ət.li ˌdɪs.əˈpɪrz/',
      },
      {
        phrase: 'True innovation should feel like second nature.',
        focus: 'Climactic resonance with final definitive cadence',
        ipaNotes: '/truː ˌɪn.əˈveɪ.ʃən ʃʊd fiːl laɪk ˈsɛk.ənd ˈneɪ.tʃɚ/',
      },
    ],
  },
];

export function ShadowingStudio() {
  const [exercises, setExercises] = useState<ShadowingExercise[]>(SHADOWING_EXERCISES);
  const [activeExercise, setActiveExercise] = useState<ShadowingExercise>(SHADOWING_EXERCISES[0]);
  const [speed, setSpeed] = useState<number>(0.92);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'curated' | null>(null);
  const [desiredScenarioInput, setDesiredScenarioInput] = useState<string>('');

  const cleanScript = activeExercise.transcript.replace(/[/]+/g, '');

  const handleFetchAiShadowingExercise = async (customScenarioParam?: string) => {
    stopSpeech();
    setIsPlaying(false);
    setIsGeneratingAi(true);

    try {
      const res = await fetch('/api/speaking/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'shadowing',
          customTopic: customScenarioParam?.trim() || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.exercise) {
          setExercises((prev) => [data.exercise, ...prev.filter((e) => e.id !== data.exercise.id)]);
          setActiveExercise(data.exercise);
          setGenerationSource(data.source === 'gemini' ? 'gemini' : 'curated');
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handlePlayVoice = async (customRate?: number) => {
    const rateToUse = customRate ?? speed;
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    await speakWithPhilosopherVoice(cleanScript, {
      rate: rateToUse,
      pitch: 0.89, // Philosopher baritone resonance
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-indigo-200/90 bg-linear-to-b from-white via-indigo-50/20 to-white shadow-md">
      {/* Studio Header */}
      <div className="border-b border-indigo-100 bg-linear-to-r from-indigo-700 via-purple-700 to-indigo-800 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-xs">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold leading-tight">Interactive Shadowing Studio</h3>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-100">
                  Phonetic Muscle Training
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 mt-0.5">
                Listen, mimic, and shadow natural speech cadence powered by The Philosopher Android AI Voice
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-400/30 text-emerald-100 border border-emerald-300/40 px-2.5 py-0.5 text-[10px] font-bold">
              🎙️ The Philosopher AI Voice Active
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Methodology Guide Pills */}
      <div className="border-b border-slate-100 bg-slate-50/70 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={() => setActiveStep(1)}
            className={`rounded-xl p-2.5 border transition ${
              activeStep === 1
                ? 'bg-white border-indigo-300 text-indigo-900 shadow-2xs font-bold'
                : 'border-slate-200/60 bg-transparent text-slate-500 hover:bg-white'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-600 font-extrabold">Step 1</span>
            <span>Listen & Absorb</span>
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`rounded-xl p-2.5 border transition ${
              activeStep === 2
                ? 'bg-white border-indigo-300 text-indigo-900 shadow-2xs font-bold'
                : 'border-slate-200/60 bg-transparent text-slate-500 hover:bg-white'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-600 font-extrabold">Step 2</span>
            <span>Rhythm & Pauses</span>
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`rounded-xl p-2.5 border transition ${
              activeStep === 3
                ? 'bg-white border-indigo-300 text-indigo-900 shadow-2xs font-bold'
                : 'border-slate-200/60 bg-transparent text-slate-500 hover:bg-white'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-600 font-extrabold">Step 3</span>
            <span>Shadow (0.2s Lag)</span>
          </button>
          <button
            onClick={() => setActiveStep(4)}
            className={`rounded-xl p-2.5 border transition ${
              activeStep === 4
                ? 'bg-white border-indigo-300 text-indigo-900 shadow-2xs font-bold'
                : 'border-slate-200/60 bg-transparent text-slate-500 hover:bg-white'
            }`}
          >
            <span className="block text-[10px] uppercase text-indigo-600 font-extrabold">Step 4</span>
            <span>Self-Evaluate</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Exercise Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                stopSpeech();
                setIsPlaying(false);
                setActiveExercise(ex);
              }}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                activeExercise.id === ex.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200/70'
              }`}
            >
              {ex.title}
            </button>
          ))}

          <button
            onClick={() => handleFetchAiShadowingExercise()}
            disabled={isGeneratingAi}
            className="rounded-xl px-3.5 py-2 text-xs font-bold transition flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs hover:opacity-95 active:scale-95 disabled:opacity-50"
            title="Generate a brand new shadowing speech script in real-time with Google Gemini AI"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating Speech...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-purple-200 animate-pulse" />
                <span>🎲 AI Random (Gemini)</span>
              </>
            )}
          </button>
        </div>

        {/* Desired Scenario Custom Input & Explore Button (near random button) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (desiredScenarioInput.trim()) {
              handleFetchAiShadowingExercise(desiredScenarioInput);
            }
          }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-indigo-50/70 border border-indigo-100"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={desiredScenarioInput}
              onChange={(e) => setDesiredScenarioInput(e.target.value)}
              placeholder="Enter your desired speaking scenario (e.g. Ted Talk on biology, Salary negotiation, Crisis apology)..."
              disabled={isGeneratingAi}
              className="w-full rounded-xl border border-indigo-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition shadow-2xs"
            />
          </div>
          <button
            type="submit"
            disabled={isGeneratingAi || !desiredScenarioInput.trim()}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:opacity-95 active:scale-95 disabled:opacity-50 transition shrink-0"
            title="Explore your desired speaking scenario using Gemini AI"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                <span>Explore Scenario</span>
              </>
            )}
          </button>
        </form>

        {/* Active Exercise Card */}
        <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                  {activeExercise.accent} • {activeExercise.difficulty}
                </span>
                {generationSource === 'gemini' && (
                  <span className="rounded-full bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5 text-purple-600" />
                    <span>Gemini AI Speech</span>
                  </span>
                )}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{activeExercise.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{activeExercise.scenario}</p>
            </div>

            {/* Playback Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Speed Buttons */}
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
                {[
                  { label: '0.75x', val: 0.75 },
                  { label: '0.92x', val: 0.92 },
                  { label: '1.15x', val: 1.15 },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => {
                      setSpeed(s.val);
                      if (isPlaying) {
                        handlePlayVoice(s.val);
                      }
                    }}
                    className={`rounded-lg px-2.5 py-1 font-bold transition ${
                      speed === s.val
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Main Play / Stop Button */}
              <button
                onClick={() => handlePlayVoice()}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-xs transition active:scale-95 ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-700 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {isPlaying ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Stop Shadowing Track</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Start Shadowing with Philosopher AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transcript with Breath & Pause Markers */}
          <div className="rounded-2xl bg-indigo-50/40 p-5 border border-indigo-100/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-2">
              <span>CADENCE TRANSCRIPT: &quot;/&quot; = short breath, &quot;//&quot; = deliberate pause</span>
              <span className="text-indigo-700 font-bold">Follow 0.2s behind audio</span>
            </div>
            <p className="text-base sm:text-lg text-slate-900 font-medium leading-loose">
              {activeExercise.transcript}
            </p>
          </div>

          {/* Detailed Phonetic & Intonation Breakdown */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Chunk-by-Chunk Intonation & Reduction Analysis:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeExercise.phoneticBreakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/90 bg-slate-50/60 p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{item.phrase}</span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {item.ipaNotes}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{item.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
