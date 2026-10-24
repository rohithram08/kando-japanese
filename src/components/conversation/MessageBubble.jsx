// One chat message. Reading order: Japanese → (romaji) → (translation) → grammar
// note → quiet action row. A correction from Hana-sensei hangs below as its own card.
import React from 'react'
import { Volume2, Copy, Check, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react'
import HanaSenseiCharacter2D from '../sensei/HanaSenseiCharacter2D'
import { useI18n } from '../../i18n'

const ActionBtn = ({ label, onClick, active, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    aria-label={label}
    aria-pressed={active}
    className="p-1.5 rounded-lg text-muted-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
  >
    {children}
  </button>
)

export default function MessageBubble({
  msg, showRomaji, showTranslations, speaking, copied, bookmarked, onSpeak, onCopy, onBookmark,
}) {
  const { t } = useI18n()
  const isUser = msg.role === 'user'

  return (
    <div
      data-testid="chat-message"
      data-role={msg.role}
      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 mt-1 shadow-sm flex items-center justify-center bg-surface">
          <HanaSenseiCharacter2D size="xs" state="idle" showStatusPill={false} />
        </div>
      )}

      <div className={`flex flex-col min-w-0 max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm break-words ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-surface border border-border text-foreground rounded-bl-md'
          }`}
        >
          <p className="text-base sm:text-[17px] font-medium leading-relaxed" lang="ja">{msg.content}</p>

          {!isUser && showRomaji && msg.romaji && (
            <p className="mt-1.5 text-xs text-muted-foreground font-mono leading-relaxed">{msg.romaji}</p>
          )}
          {!isUser && showTranslations && msg.translation && (
            <p className="mt-1 text-[13px] text-muted-foreground italic leading-relaxed">{msg.translation}</p>
          )}
          {!isUser && msg.grammar && (
            <p className="mt-2.5 inline-flex max-w-full items-start gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
              <span aria-hidden="true">💡</span><span className="min-w-0">{msg.grammar}</span>
            </p>
          )}
        </div>

        <div className={`mt-0.5 flex items-center ${isUser ? 'justify-end' : ''}`}>
          <ActionBtn label={t('conversation.listen_audio', 'Listen audio')} onClick={() => onSpeak(msg.content, msg.id)}>
            <Volume2 className={`w-3.5 h-3.5 ${speaking ? 'text-primary animate-pulse' : ''}`} />
          </ActionBtn>
          <ActionBtn label={t('conversation.copy_text', 'Copy text')} onClick={() => onCopy(msg.content, msg.id)}>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </ActionBtn>
          <ActionBtn label={t('conversation.save_phrase', 'Save phrase')} onClick={() => onBookmark(msg.id)} active={bookmarked}>
            {bookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-500" /> : <Bookmark className="w-3.5 h-3.5" />}
          </ActionBtn>
        </div>

        {!isUser && msg.corrections && (
          <div className="mt-1.5 w-full rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs">
            <div className="mb-2 flex items-center gap-1.5 font-bold text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('conversation.correction_title', 'Grammar Tip & Correction')}</span>
            </div>
            <p className="line-through text-muted-foreground" lang="ja">❌ {msg.corrections.original}</p>
            <p className="mt-1 font-semibold text-emerald-600 dark:text-emerald-400" lang="ja">✅ {msg.corrections.corrected}</p>
            <p className="mt-2 text-muted-foreground leading-relaxed">{msg.corrections.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  const { t } = useI18n()
  return (
    <div className="flex items-center gap-2.5" role="status" aria-live="polite">
      <div className="w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 flex items-center justify-center bg-surface">
        <HanaSenseiCharacter2D size="xs" state="thinking" showStatusPill={false} />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-surface px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        <span className="ml-1.5 text-[11px] font-medium text-muted-foreground">{t('conversation.thinking', 'Thinking… 考え中')}</span>
      </div>
    </div>
  )
}
