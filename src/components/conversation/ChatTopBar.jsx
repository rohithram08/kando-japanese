// Slim header for the chat. Everything rarely-used is tucked into two menus:
//   Aa  → how messages are shown (translation / romaji / slow audio)
//   ⋯   → session actions (export / restart / fullscreen)
// A thin strip below shows time + turns and the one primary action: Finish.
import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Type, MoreHorizontal, Download, RotateCcw, Maximize2, Minimize2, Clock, MessageSquare, CheckCircle2 } from 'lucide-react'
import { useI18n } from '../../i18n'
import { formatDuration } from '../../utils/conversationHelpers'

function Popover({ label, icon: Icon, children, align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`p-2.5 rounded-xl border transition-colors ${open ? 'border-primary/50 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
      >
        <Icon className="w-4 h-4" />
      </button>
      {open && (
        <div role="menu" className={`absolute top-full z-30 mt-2 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl ${align === 'right' ? 'right-0' : 'left-0'}`}>
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      )}
    </div>
  )
}

const Switch = ({ label, hint, checked, onChange }) => (
  <button
    type="button"
    role="menuitemcheckbox"
    aria-checked={checked}
    onClick={onChange}
    className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-foreground/5"
  >
    <span className="min-w-0">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </span>
    <span className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-foreground/20'}`}>
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[18px]' : 'left-0.5'}`} />
    </span>
  </button>
)

const MenuItem = ({ icon: Icon, label, onClick }) => (
  <button type="button" role="menuitem" onClick={onClick} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground hover:bg-foreground/5">
    <Icon className="w-4 h-4 text-muted-foreground" />{label}
  </button>
)

export default function ChatTopBar({
  mode, title, subtitle, icon, level, duration, turns,
  showTranslations, showRomaji, slowAudio, onToggle,
  onBack, onExport, onReset, onFullscreen, isFullscreen,
  canComplete, alreadyCompleted, onComplete,
}) {
  const { t } = useI18n()
  return (
    <header className="shrink-0 border-b border-border bg-surface/80 backdrop-blur">
      <div className="flex items-center gap-2 px-3 sm:px-5 py-2.5">
        <button
          type="button"
          onClick={onBack}
          aria-label={t('conversation.back', 'Back to scenarios')}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-2.5 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">{t('conversation.all_scenarios', 'All scenarios')}</span>
        </button>

        <div className="mx-1 flex min-w-0 flex-1 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xl" aria-hidden="true">{icon}</span>
          <div className="min-w-0">
            <h2 className="truncate text-sm sm:text-base font-semibold text-foreground leading-tight" data-testid="chat-title">{title}</h2>
            <p className="truncate text-[11px] sm:text-xs text-muted-foreground">
              {subtitle}{level && <span className="ml-1.5 rounded-md bg-foreground/10 px-1.5 py-0.5 text-[10px] font-bold text-foreground/80">{level}</span>}
            </p>
          </div>
        </div>

        <Popover label={t('conversation.display_menu', 'Display & audio')} icon={Type}>
          <p className="px-3 pb-1 pt-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{t('conversation.display_menu', 'Display & audio')}</p>
          <Switch label={t('conversation.show_translation', 'English translation')} checked={showTranslations} onChange={() => onToggle('translations')} />
          <Switch label={t('conversation.show_romaji', 'Romaji')} checked={showRomaji} onChange={() => onToggle('romaji')} />
          <Switch label={t('conversation.slow_audio', 'Slow audio')} hint="0.6×" checked={slowAudio} onChange={() => onToggle('slow')} />
        </Popover>

        <Popover label={t('conversation.more', 'More options')} icon={MoreHorizontal}>
          {(close) => (
            <>
              <MenuItem icon={Download} label={t('conversation.export', 'Export transcript')} onClick={() => { onExport(); close() }} />
              <MenuItem icon={RotateCcw} label={t('conversation.restart', 'Restart conversation')} onClick={() => { onReset(); close() }} />
              <MenuItem icon={isFullscreen ? Minimize2 : Maximize2} label={isFullscreen ? t('conversation.exit_fullscreen', 'Exit full screen') : t('conversation.fullscreen', 'Full screen')} onClick={() => { onFullscreen(); close() }} />
            </>
          )}
        </Popover>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border/60 px-3 sm:px-5 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 tabular-nums" aria-label={t('conversation.session_time', 'Session time')}><Clock className="w-3.5 h-3.5" />{formatDuration(duration)}</span>
          <span className="inline-flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />{turns === 1 ? t('conversation.turn_one', '1 turn') : t('conversation.turns', { count: turns }, `${turns} turns`)}</span>
        </div>
        {mode === 'scenario' && canComplete && (
          <button
            type="button"
            onClick={onComplete}
            data-testid="complete-scenario-btn"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-600 active:scale-95 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            {alreadyCompleted
              ? t('conversation.finish_again', 'Finish · +10 Wave XP')
              : t('conversation.finish', 'Finish · +50 Wave XP')}
          </button>
        )}
      </div>
    </header>
  )
}
