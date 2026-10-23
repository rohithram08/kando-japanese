import React from 'react';

interface SenseiMarkdownProps {
  content: string;
  className?: string;
}

export function formatInlineText(text: string): React.ReactNode[] {
  if (!text) return [];

  // Match bold (**bold** or __bold__), inline code (`code`), or italic (*italic* or _italic_)
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*|_[^_]+_)/g;
  const parts = text.split(regex);

  parts.forEach((part, idx) => {
    if (!part) return;

    if (part.startsWith('**') && part.endsWith('**')) {
      tokens.push(
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('__') && part.endsWith('__')) {
      tokens.push(
        <strong key={idx} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    } else if (part.startsWith('`') && part.endsWith('`')) {
      tokens.push(
        <code key={idx} className="px-1.5 py-0.5 mx-0.5 rounded bg-background/60 font-mono text-xs text-primary border border-border/40">
          {part.slice(1, -1)}
        </code>
      );
    } else if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      tokens.push(
        <em key={idx} className="italic text-foreground/90">
          {part.slice(1, -1)}
        </em>
      );
    } else {
      tokens.push(<React.Fragment key={idx}>{part}</React.Fragment>);
    }
  });

  return tokens;
}

export default function SenseiMarkdown({ content, className = '' }: SenseiMarkdownProps) {
  if (!content) return null;

  // Support both actual newlines and escaped newlines (\n) from JSON/LLM responses
  const normalizedContent = content.replace(/\\n/g, '\n');
  const lines = normalizedContent.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-1.5 space-y-1 pl-1">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      return;
    }

    // Headers: #, ##, ###, ####
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      flushList();
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const inlineChildren = formatInlineText(text);

      if (level === 1) {
        elements.push(
          <h1 key={`h1-${lineIdx}`} className="text-base sm:text-lg font-bold text-foreground border-b border-border/30 pb-0.5 mt-2 mb-1">
            {inlineChildren}
          </h1>
        );
      } else if (level === 2) {
        elements.push(
          <h2 key={`h2-${lineIdx}`} className="text-sm sm:text-base font-bold text-foreground border-b border-border/20 pb-0.5 mt-2 mb-1">
            {inlineChildren}
          </h2>
        );
      } else if (level === 3) {
        elements.push(
          <h3 key={`h3-${lineIdx}`} className="text-sm font-bold text-primary mt-1.5 mb-0.5">
            {inlineChildren}
          </h3>
        );
      } else {
        elements.push(
          <h4 key={`h4-${lineIdx}`} className="text-xs sm:text-sm font-semibold text-primary mt-1 mb-0.5">
            {inlineChildren}
          </h4>
        );
      }
      return;
    }

    // Bullet points: *, -, +, •
    const bulletMatch = trimmed.match(/^[-*+•]\s+(.+)$/);
    if (bulletMatch) {
      const itemText = bulletMatch[1];
      currentList.push(
        <li key={`li-${lineIdx}`} className="flex items-start gap-2 text-sm leading-relaxed">
          <span className="text-primary mt-1 text-xs select-none">•</span>
          <span className="flex-1">{formatInlineText(itemText)}</span>
        </li>
      );
      return;
    }

    // Numbered lists: 1. Item
    const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (numMatch) {
      flushList();
      elements.push(
        <div key={`num-${lineIdx}`} className="flex items-start gap-2 text-sm leading-relaxed my-0.5">
          <span className="font-semibold text-primary select-none">{numMatch[1]}.</span>
          <span className="flex-1">{formatInlineText(numMatch[2])}</span>
        </div>
      );
      return;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${lineIdx}`} className="text-sm leading-relaxed my-1">
        {formatInlineText(trimmed)}
      </p>
    );
  });

  flushList();

  return <div className={`space-y-0.5 ${className}`}>{elements}</div>;
}
