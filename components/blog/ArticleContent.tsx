import React from 'react';
import { GrammarExample } from '@/components/learning/GrammarExample';
import { VocabularyCard } from '@/components/learning/VocabularyCard';
import { InlineQuizBlock } from '@/components/quiz/InlineQuizBlock';
import { TongueTwisterCard } from '@/components/learning/TongueTwisterCard';
import { JamTopicStudio } from '@/components/speaking/JamTopicStudio';
import { ShadowingStudio } from '@/components/speaking/ShadowingStudio';
import { DiagramCard } from '@/components/learning/DiagramCard';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Split into custom blocks (:::grammar, :::vocab, :::quiz, :::twister) and regular markdown
  const parts = splitCustomBlocks(content);

  return (
    <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed">
      {parts.map((part, index) => {
        if (part.type === 'grammar') {
          return (
            <GrammarExample
              key={index}
              incorrect={part.data.incorrect}
              correct={part.data.correct}
              explanation={part.data.explanation}
              title={part.data.title}
            />
          );
        }

        if (part.type === 'vocab') {
          return (
            <VocabularyCard
              key={index}
              word={part.data.word}
              phonetic={part.data.phonetic}
              partOfSpeech={part.data.partOfSpeech}
              meaning={part.data.meaning}
              example={part.data.example}
              difficulty={part.data.difficulty}
            />
          );
        }

        if (part.type === 'quiz') {
          return (
            <InlineQuizBlock
              key={index}
              question={part.data.question}
              options={part.data.options}
              correctAnswer={part.data.correctAnswer}
              explanation={part.data.explanation}
            />
          );
        }

        if (part.type === 'twister') {
          return (
            <TongueTwisterCard
              key={index}
              title={part.data.title}
              text={part.data.text}
              focus={part.data.focus}
              difficulty={part.data.difficulty}
            />
          );
        }

        if (part.type === 'jam') {
          return <JamTopicStudio key={index} />;
        }

        if (part.type === 'shadowing') {
          return <ShadowingStudio key={index} />;
        }

        if (part.type === 'diagram') {
          return (
            <DiagramCard
              key={index}
              title={part.data?.title}
              subtitle={part.data?.subtitle}
              category={part.data?.category}
              content={part.data?.content || ''}
            />
          );
        }

        return <MarkdownRenderer key={index} text={part.raw} />;
      })}
    </div>
  );
}

function splitCustomBlocks(raw: string) {
  const blocks: Array<{
    type: 'markdown' | 'grammar' | 'vocab' | 'quiz' | 'twister' | 'jam' | 'shadowing' | 'diagram';
    raw: string;
    data?: any;
  }> = [];

  const regex = /:::(grammar|vocab|quiz|twister|jam|shadowing|diagram|illustration)([\s\S]*?):::/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    const markdownChunk = raw.slice(lastIndex, match.index);
    if (markdownChunk.trim()) {
      blocks.push({ type: 'markdown', raw: markdownChunk });
    }

    const blockType = match[1];
    const blockBody = match[2];

    if (blockType === 'grammar') {
      const incorrectMatch = blockBody.match(/INCORRECT:\s*(.*)/i);
      const correctMatch = blockBody.match(/CORRECT:\s*(.*)/i);
      const explanationMatch = blockBody.match(/EXPLANATION:\s*([\s\S]*)/i);
      const titleMatch = blockBody.match(/TITLE:\s*(.*)/i);
      blocks.push({
        type: 'grammar',
        raw: match[0],
        data: {
          incorrect: incorrectMatch ? incorrectMatch[1].trim() : '',
          correct: correctMatch ? correctMatch[1].trim() : '',
          explanation: explanationMatch ? explanationMatch[1].trim() : '',
          title: titleMatch ? titleMatch[1].trim() : undefined,
        },
      });
    } else if (blockType === 'vocab') {
      const wordMatch = blockBody.match(/WORD:\s*(.*)/i);
      const phoneticMatch = blockBody.match(/PHONETIC:\s*(.*)/i);
      const posMatch = blockBody.match(/PART_OF_SPEECH:\s*(.*)/i);
      const meaningMatch = blockBody.match(/MEANING:\s*(.*)/i);
      const exampleMatch = blockBody.match(/EXAMPLE:\s*(.*)/i);
      const diffMatch = blockBody.match(/DIFFICULTY:\s*(.*)/i);

      blocks.push({
        type: 'vocab',
        raw: match[0],
        data: {
          word: wordMatch ? wordMatch[1].trim() : '',
          phonetic: phoneticMatch ? phoneticMatch[1].trim() : '',
          partOfSpeech: posMatch ? posMatch[1].trim() : '',
          meaning: meaningMatch ? meaningMatch[1].trim() : '',
          example: exampleMatch ? exampleMatch[1].trim() : '',
          difficulty: diffMatch ? (diffMatch[1].trim() as any) : undefined,
        },
      });
    } else if (blockType === 'quiz') {
      const qMatch = blockBody.match(/QUESTION:\s*(.*)/i);
      const options = Array.from(blockBody.matchAll(/OPTION:\s*(.*)/gi)).map((m) => m[1].trim());
      const ansMatch = blockBody.match(/ANSWER:\s*(\d+)/i);
      const explMatch = blockBody.match(/EXPLANATION:\s*([\s\S]*)/i);

      blocks.push({
        type: 'quiz',
        raw: match[0],
        data: {
          question: qMatch ? qMatch[1].trim() : '',
          options,
          correctAnswer: ansMatch ? parseInt(ansMatch[1], 10) : 0,
          explanation: explMatch ? explMatch[1].trim() : '',
        },
      });
    } else if (blockType === 'twister') {
      const titleMatch = blockBody.match(/TITLE:\s*(.*)/i);
      const textMatch = blockBody.match(/TEXT:\s*(.*)/i);
      const focusMatch = blockBody.match(/FOCUS:\s*(.*)/i);
      const diffMatch = blockBody.match(/DIFFICULTY:\s*(.*)/i);

      blocks.push({
        type: 'twister',
        raw: match[0],
        data: {
          title: titleMatch ? titleMatch[1].trim() : undefined,
          text: textMatch ? textMatch[1].trim() : '',
          focus: focusMatch ? focusMatch[1].trim() : undefined,
          difficulty: diffMatch ? (diffMatch[1].trim() as any) : undefined,
        },
      });
    } else if (blockType === 'jam') {
      blocks.push({
        type: 'jam',
        raw: match[0],
      });
    } else if (blockType === 'shadowing') {
      blocks.push({
        type: 'shadowing',
        raw: match[0],
      });
    } else if (blockType === 'diagram' || blockType === 'illustration') {
      const titleMatch = blockBody.match(/TITLE:\s*(.*)/i);
      const subtitleMatch = blockBody.match(/SUBTITLE:\s*(.*)/i);
      const categoryMatch = blockBody.match(/CATEGORY:\s*(.*)/i);

      // Clean the body to isolate the diagram illustration content
      let content = blockBody
        .replace(/TITLE:\s*.*\n?/i, '')
        .replace(/SUBTITLE:\s*.*\n?/i, '')
        .replace(/CATEGORY:\s*.*\n?/i, '')
        .trim();

      // If wrapped in markdown code fences, unwrap them cleanly
      content = content.replace(/^```[a-z]*\n([\s\S]*?)\n```$/i, '$1');

      blocks.push({
        type: 'diagram',
        raw: match[0],
        data: {
          title: titleMatch ? titleMatch[1].trim() : 'Architectural Blueprint',
          subtitle: subtitleMatch ? subtitleMatch[1].trim() : undefined,
          category: categoryMatch ? categoryMatch[1].trim() : 'Visual Blueprint',
          content,
        },
      });
    }

    lastIndex = regex.lastIndex;
  }

  const remaining = raw.slice(lastIndex);
  if (remaining.trim()) {
    blocks.push({ type: 'markdown', raw: remaining });
  }

  return blocks;
}

interface ParsedBlock {
  type: 'h2' | 'h3' | 'ul' | 'ol' | 'blockquote' | 'code' | 'table' | 'hr' | 'p';
  title?: string;
  id?: string;
  items?: string[];
  content?: string;
  headers?: string[];
  rows?: string[][];
  code?: string;
}

function parseMarkdownLines(rawText: string): ParsedBlock[] {
  const normalized = rawText.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const blocks: ParsedBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced Code Block: starts with ``` or ~~~ or \```
    if (trimmed.startsWith('```') || trimmed.startsWith('~~~') || trimmed.startsWith('\\```')) {
      const fenceMarker = trimmed.startsWith('~~~') ? '~~~' : '```';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length) {
        const cur = lines[i];
        if (
          cur.trim().startsWith(fenceMarker) ||
          cur.trim().startsWith('\\```') ||
          (fenceMarker === '```' && cur.trim().endsWith('```'))
        ) {
          i++;
          break;
        }
        codeLines.push(cur);
        i++;
      }
      blocks.push({ type: 'code', code: codeLines.join('\n') });
      continue;
    }

    // Horizontal Rule
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading 2
    if (trimmed.startsWith('## ')) {
      const title = trimmed.replace(/^##\s+/, '').trim();
      const id = title.toLowerCase().replace(/[^\w]+/g, '-');
      blocks.push({ type: 'h2', title, id });
      i++;
      continue;
    }

    // Heading 3
    if (trimmed.startsWith('### ')) {
      const title = trimmed.replace(/^###\s+/, '').trim();
      const id = title.toLowerCase().replace(/[^\w]+/g, '-');
      blocks.push({ type: 'h3', title, id });
      i++;
      continue;
    }

    // Markdown Table: begins with '|'
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const parseCells = (row: string) =>
          row
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim());

        const headers = parseCells(tableLines[0]);
        // Skip separator row if present (e.g. |:---|:---|)
        const dataStartIdx = tableLines[1].includes('---') ? 2 : 1;
        const rows = tableLines.slice(dataStartIdx).map(parseCells);

        blocks.push({ type: 'table', headers, rows });
        continue;
      }
    }

    // Blockquote
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s*/, ''));
        i++;
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') });
      continue;
    }

    // Ordered List (1. , 2. )
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    // Unordered List (- or *)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    // Normal Paragraph: collect lines until a blank line or special block starter
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('## ') &&
      !lines[i].trim().startsWith('### ') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('~~~') &&
      !lines[i].trim().startsWith('\\```') &&
      !lines[i].trim().startsWith('---') &&
      !lines[i].trim().startsWith('***') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !(lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|'))
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }

    if (paraLines.length > 0) {
      blocks.push({ type: 'p', content: paraLines.join(' ') });
    }
  }

  return blocks;
}

function MarkdownRenderer({ text }: { text: string }) {
  const blocks = parseMarkdownLines(text);

  return (
    <>
      {blocks.map((block, idx) => {
        if (block.type === 'hr') {
          return <hr key={idx} className="my-8 border-slate-200" />;
        }

        if (block.type === 'code') {
          return (
            <div
              key={idx}
              className="my-5 overflow-x-auto rounded-xl bg-slate-900 p-4 font-mono text-xs sm:text-sm text-slate-100 shadow-xs border border-slate-800"
            >
              <pre className="whitespace-pre font-mono leading-relaxed">{block.code}</pre>
            </div>
          );
        }

        if (block.type === 'table') {
          return (
            <div
              key={idx}
              className="my-6 overflow-x-auto rounded-xl border border-slate-200/90 bg-white shadow-2xs"
            >
              <table className="w-full min-w-[500px] border-collapse text-left text-sm">
                {block.headers && block.headers.length > 0 && (
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      {block.headers.map((h, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-4 py-3 font-bold text-xs uppercase tracking-wider text-slate-700"
                          dangerouslySetInnerHTML={{ __html: formatInline(h) }}
                        />
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="divide-y divide-slate-100">
                  {block.rows?.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-slate-700 text-sm align-top leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: formatInline(cell) }}
                        />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        if (block.type === 'h2') {
          return (
            <h2
              key={idx}
              id={block.id}
              className="mt-8 mb-4 scroll-mt-24 text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-100 pb-2"
              dangerouslySetInnerHTML={{ __html: formatInline(block.title || '') }}
            />
          );
        }

        if (block.type === 'h3') {
          return (
            <h3
              key={idx}
              id={block.id}
              className="mt-6 mb-3 scroll-mt-24 text-xl font-bold text-slate-900"
              dangerouslySetInnerHTML={{ __html: formatInline(block.title || '') }}
            />
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={idx} className="my-4 list-disc pl-6 space-y-2 text-slate-700 text-base">
              {block.items?.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  dangerouslySetInnerHTML={{ __html: formatInline(item) }}
                />
              ))}
            </ul>
          );
        }

        if (block.type === 'ol') {
          return (
            <ol key={idx} className="my-4 list-decimal pl-6 space-y-2 text-slate-700 text-base">
              {block.items?.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  dangerouslySetInnerHTML={{ __html: formatInline(item) }}
                />
              ))}
            </ol>
          );
        }

        if (block.type === 'blockquote') {
          return (
            <blockquote
              key={idx}
              className="my-5 border-l-4 border-emerald-500 bg-emerald-50/40 py-2.5 px-4 rounded-r-xl italic text-slate-700 text-base"
              dangerouslySetInnerHTML={{ __html: formatInline(block.content || '') }}
            />
          );
        }

        // Paragraph
        return (
          <p
            key={idx}
            className="my-4 text-base text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInline(block.content || '') }}
          />
        );
      })}
    </>
  );
}

function formatInline(str: string): string {
  if (!str) return '';
  return str
    // Sanitize any raw stray backslash-escaped backticks
    .replace(/\\`/g, '`')
    // Bold: **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    // Italic: *text*
    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
    // Inline code: `code`
    .replace(/`([^`]+)`/g, '<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-emerald-800 border border-slate-200/60">$1</code>')
    // Markdown link: [text](url)
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-700 font-medium underline hover:text-emerald-800">$1</a>');
}
