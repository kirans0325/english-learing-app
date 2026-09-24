'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  RefreshCw,
  HelpCircle,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { speakWithPhilosopherVoice, stopSpeech } from '@/lib/utils/speech';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  '⏳ Past Perfect vs Simple Past',
  '🇺🇸 Flap T rule in American accent',
  '📝 "I am agree" — is this correct?',
  '💼 Business email follow-up phrases',
  '💡 Daily idiom with example',
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'bot',
      text: "👋 Hi there! I'm **Flowy**, your AI English tutor. I'm here 24/7 to help you with grammar explanations, vocabulary, American pronunciation, and sentence corrections.\n\nWhat would you like to practice today?",
      time: 'Now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSpeakMessage = async (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeech();
      setSpeakingMsgId(null);
      return;
    }

    setSpeakingMsgId(msgId);
    await speakWithPhilosopherVoice(text, {
      rate: 0.95,
      pitch: 0.89,
      onEnd: () => setSpeakingMsgId(null),
      onError: () => setSpeakingMsgId(null),
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || "I'm ready for your next English question!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: 'Oops, I encountered a temporary network issue. Please ask again!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render markdown text simply (bolding, headers, lists)
  const renderMessageContent = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-sm mt-1 mb-0.5">
                {line.replace(/^###\s+/, '')}
              </h4>
            );
          }
          if (line.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-semibold text-slate-800 text-xs mt-1 mb-0.5">
                {line.replace(/^####\s+/, '')}
              </h5>
            );
          }
          if (line.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-emerald-500 pl-2 text-slate-700 italic my-1 bg-emerald-50/50 py-0.5 rounded-r"
              >
                {line.replace(/^>\s+/, '')}
              </blockquote>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const content = line.replace(/^[-*]\s+/, '');
            return (
              <li key={idx} className="ml-3 list-disc">
                <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </li>
            );
          }
          if (/^\d+\.\s+/.test(line)) {
            const num = line.match(/^(\d+)\.\s+/)?.[1] || '';
            const content = line.replace(/^\d+\.\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-1.5 ml-1">
                <span className="font-bold text-emerald-700">{num}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
              </div>
            );
          }

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatInline(line) }}
              className="text-slate-700"
            />
          );
        })}
      </div>
    );
  };

  const formatInline = (str: string) => {
    // Escape HTML first to prevent XSS in chat messages
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 text-emerald-700 px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
  };

  return (
    <div className="chatbot-widget fixed bottom-5 right-5 z-40 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 px-4 py-3 text-white shadow-xl shadow-emerald-700/25 transition-all hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          aria-label="Open English AI Tutor"
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-xs">
            <Bot className="h-5 w-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-[11px] font-semibold text-emerald-100 leading-none">English Tutor</p>
            <p className="text-xs font-bold leading-tight">Ask Flowy</p>
          </div>

          <Sparkles className="h-4 w-4 text-emerald-200 transition-transform group-hover:rotate-12" />
        </button>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-3 sm:static sm:inset-auto sm:w-[390px] h-[540px] max-h-[85vh] rounded-3xl bg-white shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-600 to-teal-700 px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xs">
                <Bot className="h-5 w-5 text-white" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-emerald-700" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold leading-none">Flowy</h3>
                  <span className="rounded-full bg-emerald-500/40 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-100">
                    AI Tutor
                  </span>
                </div>
                <p className="text-[10px] text-emerald-100/90 mt-0.5">24/7 English Learning Coach</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'msg-reset',
                      sender: 'bot',
                      text: "Conversation refreshed! How can I help you practice your English now?",
                      time: 'Now',
                    },
                  ])
                }
                title="Reset conversation"
                className="rounded-lg p-1.5 text-emerald-100 hover:bg-white/10 transition"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="rounded-lg p-1.5 text-emerald-100 hover:bg-white/10 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs text-xs">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-[82%] rounded-2xl p-3 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs text-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="text-xs leading-relaxed">{msg.text}</p>
                  ) : (
                    renderMessageContent(msg.text)
                  )}
                  {msg.sender === 'bot' ? (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2 text-[10px]">
                      <button
                        type="button"
                        onClick={() => toggleSpeakMessage(msg.id, msg.text)}
                        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium transition active:scale-95 ${
                          speakingMsgId === msg.id
                            ? 'bg-emerald-100 text-emerald-800 font-semibold'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                        title={speakingMsgId === msg.id ? 'Stop audio' : 'Listen with The Philosopher Android AI voice'}
                      >
                        {speakingMsgId === msg.id ? (
                          <>
                            <VolumeX className="h-3 w-3 text-emerald-700 animate-pulse" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3 text-emerald-600" />
                            <span>Listen (Philosopher AI)</span>
                          </>
                        )}
                      </button>
                      <span className="text-slate-400">{msg.time}</span>
                    </div>
                  ) : (
                    <span className="block text-[9px] mt-1.5 text-right text-emerald-100">
                      {msg.time}
                    </span>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700 text-xs">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs bg-white border border-slate-200/80 rounded-2xl p-3 w-fit">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                <span>Flowy is typing explanation...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="border-t border-slate-100 bg-white px-3 py-2 overflow-x-auto scrollbar-none flex gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={loading}
                className="whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="border-t border-slate-200 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about grammar, vocabulary, pronunciation..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || loading}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
              <span>🔒 Dedicated to English learning. Safe & secure pair-tutor.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
