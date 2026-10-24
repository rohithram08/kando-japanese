// Side panel (bottom sheet on phones) holding the help that used to crowd the chat:
// phrase hints (tap to drop one into the message box), saved phrases and session stats.
import React from 'react'
import { X, Lightbulb, Bookmark, BarChart3, Volume2 } from 'lucide-react'
import { useI18n } from '../../i18n'
import { splitHint, formatDuration } from '../../utils/conversationHelpers'

export default function CoachPanel({ open, onClose, hints, saved, stats, onUsePhrase, onSpeak }) {
  const { t } = useI18n()
  if (!open) return null
  return (
    <>
      <button type="button" aria-label={t('common.close', 'Close')} onClick={onClose} className="fixed inset-0 z-[55] bg-black/50 lg:hidden" />
      <aside
        aria-label={t('conversation.coach', 'Coach')}
        data-testid="coach-panel"
        className="fixed inset-x-0 bottom-0 z-[60] max-h-[75vh] overflow-y-auto rounded-t-3xl border border-border bg-surface p-4 shadow-2xl
                   lg:static lg:z-auto lg:m-3 lg:ml-0 lg:max-h-[calc(100%-1.5rem)] lg:w-72 lg:shrink-0 lg:self-start lg:rounded-2xl lg:shadow-none"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
            <Lightbulb className="w-4 h-4 text-amber-400" />{t('conversation.coach', 'Coach')}
          </h2>
          <button type="button" onClick={onClose} aria-label={t('common.close', 'Close')} className="rounded-lg p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <section className="mb-5">
          <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t('conversation.useful_phrases', 'Useful phrases')}</h3>
          <ul className="space-y-2">
            {hints.map((hint) => {
              const { label, phrase } = splitHint(hint)
              return (
                <li key={hint}>
                  <button
                    type="button"
                    onClick={() => onUsePhrase(phrase)}
                    className="w-full rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-left transition hover:border-amber-500/50 active:scale-[0.99]"
                  >
                    {label && <span className="block text-[11px] text-muted-foreground">{label}</span>}
                    <span className="block text-sm font-medium text-foreground" lang="ja">{phrase}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">{t('conversation.tap_to_use', 'Tap a phrase to drop it into your message.')}</p>
        </section>

        <section className="mb-5">
          <h3 className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <Bookmark className="w-3 h-3" />{t('conversation.saved_phrases', 'Saved phrases')}
          </h3>
          {saved.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t('conversation.no_saved', 'Tap the bookmark under any message to keep it here.')}</p>
          ) : (
            <ul className="space-y-2">
              {saved.map((m) => (
                <li key={m.id} className="flex items-start justify-between gap-2 rounded-xl border border-border bg-background/60 px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm text-foreground" lang="ja">{m.content}</p>
                    {m.translation && <p className="mt-0.5 text-[11px] italic text-muted-foreground">{m.translation}</p>}
                  </div>
                  <button type="button" aria-label={t('conversation.listen_audio', 'Listen audio')} onClick={() => onSpeak(m.content, m.id)} className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h3 className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <BarChart3 className="w-3 h-3" />{t('conversation.this_session', 'This session')}
          </h3>
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              [t('conversation.stat_time', 'Time'), formatDuration(stats.duration)],
              [t('conversation.stat_turns', 'Turns'), stats.turns],
              [t('conversation.stat_tips', 'Tips'), stats.corrections],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-background/60 border border-border py-2">
                <dd className="text-base font-bold text-foreground tabular-nums">{v}</dd>
                <dt className="text-[10px] text-muted-foreground">{k}</dt>
              </div>
            ))}
          </dl>
        </section>
      </aside>
    </>
  )
}
