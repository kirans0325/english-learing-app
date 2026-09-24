'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Globe,
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Layers,
  Database,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Mic,
  Lightbulb,
} from 'lucide-react';
import { DailyTrendingDigest, TrendingNewsStory } from '@/models/types';
import { speakWithPhilosopherVoice, stopSpeech } from '@/lib/utils/speech';

interface TrendingStudioProps {
  initialDigest: DailyTrendingDigest;
}

export function TrendingStudio({ initialDigest }: TrendingStudioProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);

  // JAM Speaking Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  const stories = initialDigest.stories || [];
  const currentStory: TrendingNewsStory | undefined = stories[selectedStoryIndex];

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const handleStartTimer = () => {
    if (timerSeconds === 0) setTimerSeconds(60);
    setTimerRunning(true);
  };

  const handlePauseTimer = () => setTimerRunning(false);

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(60);
  };

  // Audio speech handler using The Philosopher Android voice
  const handlePlayVoice = async (text: string, key: string, rate = 0.96) => {
    if (speakingKey === key) {
      stopSpeech();
      setSpeakingKey(null);
      return;
    }

    setSpeakingKey(key);
    await speakWithPhilosopherVoice(text, {
      rate,
      pitch: 0.89,
      onEnd: () => setSpeakingKey(null),
      onError: () => setSpeakingKey(null),
    });
  };

  // Clean formatted date
  const displayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-6 sm:p-8 dark:border-slate-800 dark:from-emerald-950/30 dark:via-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/90 px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs backdrop-blur-xs dark:border-emerald-800/40 dark:bg-slate-800/80 dark:text-emerald-300">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>DAILY TRENDING ENGLISH EDITION</span>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {displayDate}
          </span>
        </div>

        <h1 className="mt-4 text-2xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Learn English Through Today&apos;s World News
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          Transform global current events into executive English fluency: analyze authentic news excerpts, master high-frequency workplace vocabulary with phonetic IPA, deconstruct journalistic grammar structures, and practice 60-second extempore speaking.
        </p>

        {/* M0 Free-Tier Optimization Badge */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/70 p-3.5 text-xs text-slate-600 shadow-2xs dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>MongoDB Atlas M0 Optimized</span>
          </div>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span>1 compact document per day (~4 KB)</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span>30-day auto-purging TTL index</span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">&lt; 0.02% total storage used</span>
        </div>
      </div>

      {/* Story Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {stories.map((story, idx) => {
          const isSelected = idx === selectedStoryIndex;
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => {
                setSelectedStoryIndex(idx);
                handleResetTimer();
                stopSpeech();
                setSpeakingKey(null);
              }}
              className={`flex min-w-[240px] flex-1 items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-white shadow-md ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-slate-800/90'
                  : 'border-slate-200 bg-slate-50/60 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                0{idx + 1}
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {story.category}
                </span>
                <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {story.headline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Selected Story View */}
      {currentStory && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: News Excerpt & Vocabulary (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            {/* Story Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {currentStory.category}
                </span>
                <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                  Source: {currentStory.source}
                </span>
              </div>

              <h2 className="mt-4 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">
                {currentStory.headline}
              </h2>

              <p className="mt-3 text-base leading-relaxed text-slate-700 dark:text-slate-300">
                {currentStory.summary}
              </p>

              {/* Philosopher Voice Read Aloud */}
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-emerald-50/70 p-3 dark:bg-slate-800/60">
                <button
                  type="button"
                  onClick={() =>
                    handlePlayVoice(
                      `${currentStory.headline}. ${currentStory.summary}`,
                      `story-${currentStory.id}`
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
                  aria-label="Listen to news story"
                >
                  {speakingKey === `story-${currentStory.id}` ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {speakingKey === `story-${currentStory.id}` ? 'Playing audio...' : 'Listen to News Story'}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Narrated with The Philosopher Android AI Voice (natural cadence)
                  </p>
                </div>
              </div>

              {/* Key Takeaway Callout */}
              <div className="mt-4 rounded-xl border border-teal-200/70 bg-teal-50/50 p-3.5 text-xs text-teal-900 dark:border-teal-900/50 dark:bg-teal-950/20 dark:text-teal-200">
                <span className="font-bold">Key Insight: </span>
                {currentStory.keyTakeaway}
              </div>
            </div>

            {/* Vocabulary in the News */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Trending Vocabulary in Context
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                High-frequency professional words extracted directly from today&apos;s story
              </p>

              <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
                {currentStory.vocabulary.map((vocab, vIdx) => {
                  const vocabKey = `vocab-${currentStory.id}-${vIdx}`;
                  return (
                    <div key={vocab.word} className="py-4 first:pt-2 last:pb-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            {vocab.word}
                          </span>
                          <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                            {vocab.phonetic}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            {vocab.partOfSpeech}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handlePlayVoice(
                              `${vocab.word}. Definition: ${vocab.meaning}. Example: ${vocab.example}`,
                              vocabKey,
                              0.92
                            )
                          }
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Pronounce</span>
                        </button>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-white">Meaning: </span>
                        {vocab.meaning}
                      </p>

                      <div className="mt-2 rounded-xl bg-slate-50 p-2.5 text-xs text-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
                        <p className="italic text-slate-700 dark:text-slate-300">
                          &ldquo;{vocab.inTheNewsQuote}&rdquo;
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          <strong className="text-slate-600 dark:text-slate-400">Daily usage: </strong>
                          {vocab.example}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Grammar in the News Breakdown */}
            <div className="rounded-3xl border border-indigo-100 bg-indigo-50/30 p-6 shadow-sm dark:border-indigo-950 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-indigo-950 dark:text-indigo-200">
                  Grammar in the News: {currentStory.grammarFocus.concept}
                </h3>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-indigo-900/90 dark:text-indigo-300">
                {currentStory.grammarFocus.explanation}
              </p>

              <div className="mt-3 rounded-2xl border border-indigo-200/80 bg-white/90 p-3 text-xs font-mono text-indigo-900 dark:border-indigo-900 dark:bg-slate-900 dark:text-indigo-300">
                <strong>Model Pattern: </strong>
                {currentStory.grammarFocus.sampleSentence}
              </div>
            </div>
          </div>

          {/* Right Column: 60-Second JAM Speaking Challenge (5 cols) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="sticky top-20 rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    Today&apos;s 60s JAM Speech
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Extempore Drill
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Speak for exactly 60 seconds on today&apos;s trending issue without hesitation or repetition.
              </p>

              {/* Topic Prompt */}
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Topic Prompt
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                  {currentStory.jamTopic.prompt}
                </p>
              </div>

              {/* Circular Timer Visual */}
              <div className="mt-6 flex flex-col items-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                  <div
                    className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-1000"
                    style={{
                      clipPath: `inset(0 0 ${100 - (timerSeconds / 60) * 100}% 0)`,
                    }}
                  />
                  <div className="text-center z-10">
                    <span className="font-mono text-3xl font-black text-slate-900 dark:text-white">
                      {timerSeconds}
                    </span>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">
                      seconds
                    </span>
                  </div>
                </div>

                {/* Timer Controls */}
                <div className="mt-4 flex items-center gap-2">
                  {timerRunning ? (
                    <button
                      type="button"
                      onClick={handlePauseTimer}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-amber-600 active:scale-95"
                    >
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartTimer}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:scale-95"
                    >
                      <Play className="h-4 w-4" />
                      <span>{timerSeconds < 60 && timerSeconds > 0 ? 'Resume' : 'Start 60s JAM'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:hover:bg-slate-800"
                    title="Reset timer"
                    aria-label="Reset timer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Recommended Talking Points */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  3 Key Speaking Anchors:
                </span>
                <ul className="mt-2 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {currentStory.jamTopic.talkingPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model Exemplar Speech with Philosopher Audio */}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Model 60s Exemplar Speech
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handlePlayVoice(
                        currentStory.jamTopic.modelSpeech,
                        `model-speech-${currentStory.id}`,
                        0.96
                      )
                    }
                    className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>{speakingKey === `model-speech-${currentStory.id}` ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
                <p className="mt-2 text-xs italic leading-relaxed text-slate-600 dark:text-slate-300">
                  &ldquo;{currentStory.jamTopic.modelSpeech}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
