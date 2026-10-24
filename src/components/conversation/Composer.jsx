// Message composer. Quick replies live in ONE scrollable line right above the box
// (the thing you reach for most); the longer hints moved into the Coach panel.
import React from 'react'
import { Send, Lightbulb } from 'lucide-react'
import SpeechInput from '../chatbot/SpeechInput'
import { useI18n } from '../../i18n'

export default function Composer({ input, setInput, onSend, loading, quickReplies, inputRef, onToggleCoach, coachOpen }) {
  const { t } = useI18n()
  return (
    <div className="border-t border-border bg-background/95 backdrop-blur px-3 sm:px-5 pt-2.5 pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleCoach}
            aria-pressed={coachOpen}
            aria-label={t('conversation.coach', 'Coach')}
            className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              coachOpen ? 'border-amber-500/50 bg-amber-500/15 text-amber-500' : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('conversation.coach', 'Coach')}</span>
          </button>
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={t('conversation.quick_replies', 'Quick replies')}>
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                data-testid="quick-reply-btn"
                disabled={loading}
                onClick={() => onSend(reply)}
                lang="ja"
                className="shrink-0 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] text-foreground hover:border-primary/50 hover:bg-primary/5 active:scale-95 disabled:opacity-50 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); onSend() }}
          className="flex items-center gap-2 rounded-2xl border border-border bg-surface p-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('conversation.input_placeholder', 'Type in Japanese or English…')}
            disabled={loading}
            data-testid="conversation-input"
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <SpeechInput onTranscript={(tr) => setInput((prev) => (prev ? `${prev} ${tr}` : tr))} disabled={loading} />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label={t('conversation.send', 'Send message')}
            className="shrink-0 rounded-xl bg-primary p-2.5 text-primary-foreground hover:bg-primary/90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
