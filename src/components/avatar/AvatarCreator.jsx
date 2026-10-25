// src/components/avatar/AvatarCreator.jsx
// ─────────────────────────────────────────────────────────────
// Build-your-own cartoon avatar ("Bitmoji-style"). Lazy-loaded from the profile page,
// so DiceBear never touches the main bundle. The result is a tiny recipe
// { style, seed, options } - never an image - which UserAvatar renders everywhere.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useMemo, useState } from 'react'
import { Shuffle, RotateCcw, X, Check, Ban } from 'lucide-react'
import { useI18n } from '../../i18n'
import {
  AVATAR_STYLES, humanizeOption, makeDefaultConfig, normalizeAvatarConfig, randomSeed,
} from '../../utils/avatarConfig'
import {
  renderAvatarDataUri, getStyleControls, applyChoice, currentChoice, randomizeOptions, loadStyle, isStyleLoaded,
} from '../../utils/avatarRenderer'

function Thumb({ src, selected, label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      title={label}
      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-muted transition-all
        ${selected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
    >
      {src ? <img src={src} alt="" draggable={false} className="h-full w-full object-cover" /> : children}
    </button>
  )
}

export default function AvatarCreator({ initialConfig, onSave, onClose, saving = false }) {
  const { t } = useI18n()
  const [config, setConfig] = useState(() => normalizeAvatarConfig(initialConfig) || makeDefaultConfig())
  // Each art style is a separate download; wait for the selected one before drawing anything.
  const [, setLoadedTick] = useState(0)
  useEffect(() => {
    let alive = true
    loadStyle(config.style).then(() => { if (alive) setLoadedTick((n) => n + 1) })
    return () => { alive = false }
  }, [config.style])
  const ready = isStyleLoaded(config.style)
  const controls = useMemo(() => (ready ? getStyleControls(config.style) : []), [config.style, ready])
  const [activeKey, setActiveKey] = useState(undefined)
  const control = controls.find((c) => c.key === activeKey) || controls[0]

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && !saving) onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, saving])

  const preview = renderAvatarDataUri(config)

  // Thumbnails: the current avatar with each candidate value applied.
  const tiles = useMemo(() => {
    if (!ready || !control || control.kind !== 'enum') return []
    return control.values.map((value) => ({
      value,
      src: renderAvatarDataUri({ ...config, options: applyChoice(config.options, control, value) }),
    }))
  }, [config, control, ready])

  const choice = control ? currentChoice(config.options, control) : undefined
  const pick = (value) => setConfig((c) => ({ ...c, options: applyChoice(c.options, control, value) }))
  const switchStyle = (style) => {
    // options are style-specific, so a new style starts from its own defaults (same seed => similar face)
    setConfig((c) => ({ style, seed: c.seed, options: {} }))
    setActiveKey(undefined) // falls back to the new style's first control
  }
  const surprise = () => setConfig((c) => ({ ...c, seed: randomSeed(), options: randomizeOptions(c.style) }))
  const reset = () => setConfig((c) => ({ style: c.style, seed: c.seed, options: {} }))

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={() => !saving && onClose?.()}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t('avatar.title', 'Create your avatar')}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-border bg-surface shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <h3 className="text-lg font-bold text-foreground">{t('avatar.title', 'Create your avatar')}</h3>
          <button type="button" onClick={onClose} disabled={saving} aria-label={t('common.close', 'Close')} className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 gap-5 overflow-y-auto p-5 md:grid-cols-[220px_1fr]">
          {/* Preview + style */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-44 w-44 overflow-hidden rounded-3xl border-4 border-surface bg-muted shadow-lg" role="img" aria-label={t('avatar.preview', 'Avatar preview')}>
              {preview
                ? <img src={preview} alt="" draggable={false} className="h-full w-full object-cover" />
                : <div className="h-full w-full animate-pulse bg-muted" aria-busy="true" />}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={surprise} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-white">
                <Shuffle className="h-3.5 w-3.5" aria-hidden /> {t('avatar.surprise', 'Surprise me')}
              </button>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden /> {t('avatar.reset', 'Reset')}
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-1.5" role="group" aria-label={t('avatar.style', 'Art style')}>
              {AVATAR_STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={config.style === s.id}
                  onClick={() => switchStyle(s.id)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${config.style === s.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="min-w-0">
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2" role="tablist" aria-label={t('avatar.features', 'Features')}>
              {controls.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  role="tab"
                  aria-selected={c.key === control?.key}
                  onClick={() => setActiveKey(c.key)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${c.key === control?.key ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="mt-2 flex max-h-72 flex-wrap gap-2 overflow-y-auto pr-1" role="tabpanel">
              {control?.optional && (
                <Thumb selected={choice === null} label={t('avatar.none', 'None')} onClick={() => pick(null)}>
                  <span className="flex h-full w-full items-center justify-center text-muted-foreground"><Ban className="h-5 w-5" aria-hidden /></span>
                </Thumb>
              )}
              {control?.kind === 'enum' && tiles.map((tile) => (
                <Thumb key={tile.value} src={tile.src} selected={choice === tile.value} label={humanizeOption(tile.value)} onClick={() => pick(tile.value)} />
              ))}
              {control?.kind === 'color' && control.values.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-pressed={choice === hex}
                  aria-label={hex === 'transparent' ? t('avatar.no_background', 'No background') : `#${hex}`}
                  onClick={() => pick(hex)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${choice === hex ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'}`}
                  style={hex === 'transparent' ? undefined : { backgroundColor: `#${hex}` }}
                >
                  {hex === 'transparent' && <Ban className="h-4 w-4 text-muted-foreground" aria-hidden />}
                  {choice === hex && hex !== 'transparent' && <Check className="h-4 w-4 text-white mix-blend-difference" aria-hidden />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">
            {t('common.cancel', 'Cancel')}
          </button>
          <button
            type="button"
            onClick={() => onSave?.(config)}
            disabled={saving}
            className="rounded-xl bg-primary px-5 py-2 text-sm font-bold text-white disabled:opacity-60"
          >
            {saving ? t('common.saving', 'Saving…') : t('avatar.save', 'Save avatar')}
          </button>
        </div>
      </div>
    </div>
  )
}
