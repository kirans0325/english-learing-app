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
    title: 'Negotiating Terms with Quiet Confidence',
    scenario: 'Setting firm commercial boundaries in a multi-party enterprise contract dispute.',
    accent: 'Workplace Executive',
    durationSec: 36,
    difficulty: 'Advanced',
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
    id: 'sh-2',
    title: 'The Inspiring Townhall Address',
    scenario: 'Rallying a global team after navigating a challenging fiscal quarter.',
    accent: 'General American',
    durationSec: 35,
    difficulty: 'Intermediate',
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
    id: 'sh-3',
    title: 'The Architectural Engineering Brief',
    scenario: 'Explaining a complex cloud microservices refactor to executive stakeholders.',
    accent: 'Cultured Mid-Atlantic',
    durationSec: 38,
    difficulty: 'Advanced',
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

export function ShadowingStudio() {
  const [exercises, setExercises] = useState<ShadowingExercise[]>(SHADOWING_EXERCISES);
  const [activeExercise, setActiveExercise] = useState<ShadowingExercise>(SHADOWING_EXERCISES[0]);
  const [speed, setSpeed] = useState<number>(0.92);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<'gemini' | 'curated' | null>(null);
  const [desiredScenarioInput, setDesiredScenarioInput] = useState<string>('');

  const cleanScript = activeExercise.transcript.replace(/\s*\/+\s*/g, ' ').trim();

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
