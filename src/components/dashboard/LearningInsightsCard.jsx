// "How you learn best": measured from your own answers, not a learning-style quiz.
// Research basis (shown in the card): learning-style matching is unsupported (Pashler et al. 2008);
// retrieval + spaced practice at ~85% accuracy is (Dunlosky 2013, Cepeda 2006, Wilson 2019).
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Brain, Target, AlertTriangle, ChevronDown } from 'lucide-react'
import { getInsights } from '../../api/learning'
import { useI18n } from '../../i18n'

const pct = (n) => (n == null ? '–' : `${Math.round(n * 100)}%`)

function suggestionText(t, s) {
  const raw = s.params || {}
  // Localise the category words that get dropped into sentences.
  const p = {
    ...raw,
    best: raw.best ? t(`insights.mod_${raw.best}`, raw.best) : raw.best,
    worst: raw.worst ? t(`insights.mod_${raw.worst}`, raw.worst) : raw.worst,
    block: raw.block ? t(`insights.blk_${raw.block}`, raw.block) : raw.block,
    only: raw.only ? t(`insights.type_${raw.only}`, raw.only) : raw.only,
  }
  switch (s.code) {
    case 'collect_more_data':
      return t('insights.s_collect', { n: p.needed }, `Answer ${p.needed} more review cards and I'll start spotting your patterns.`)
    case 'review_leeches':
      return t('insights.s_leeches', { n: p.count }, `${p.count} item(s) keep slipping. Try a mnemonic, write them out, or hear them aloud instead of repeating the same way.`)
    case 'slow_down_new_items':
      return t('insights.s_slow', { n: p.cap }, `Accuracy is low: cap new items at ${p.cap}/day until reviews feel comfortable.`)
    case 'add_new_items':
      return t('insights.s_more', { n: p.cap }, `You're cruising. Raise new items to ${p.cap}/day for more challenge.`)
    case 'prefer_modality':
      return t('insights.s_modality', { best: p.best, worst: p.worst, n: raw.gapPct }, `You score ${raw.gapPct} points higher on ${p.best} than ${p.worst}. Add extra ${p.worst} practice, since that is where the gap is.`)
    case 'schedule_block':
      return t('insights.s_time', { block: p.block, n: raw.gapPct }, `Your accuracy is ${raw.gapPct} points higher in the ${p.block}. Schedule hard material then.`)
    case 'build_consistency':
      return t('insights.s_consistency', { n: p.days }, `You studied ${p.days} of the last 14 days. Short daily sessions beat long irregular ones.`)
    case 'mix_item_types':
      return t('insights.s_mix', { only: p.only }, `You only practised ${p.only}. Mix in other item types: interleaving helps you tell similar items apart.`)
    default:
      return null
  }
}

export default function LearningInsightsCard() {
  const { t } = useI18n()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [showEvidence, setShowEvidence] = useState(false)

  useEffect(() => {
    let alive = true
    getInsights().then((d) => alive && setData(d)).catch(() => alive && setError(true))
    return () => { alive = false }
  }, [])

  if (error || !data) return null // optional widget: never block the dashboard
  const { insights: i, evidence } = data
  const suggestions = i.suggestions.map((s) => ({ s, text: suggestionText(t, s) })).filter((x) => x.text)

  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm" aria-labelledby="insights-title">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"><Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /></div>
          <div>
            <h3 id="insights-title" className="text-sm font-bold text-foreground">{t('insights.title', 'How you learn best')}</h3>
            <p className="text-xs text-muted-foreground">
              {t('insights.subtitle', { n: i.windowDays }, `Measured from your last ${i.windowDays} days of answers`)} · {t(`insights.conf_${i.confidence}`, `${i.confidence} confidence`)}
            </p>
          </div>
        </div>
        <Link to="/review" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0">{t('insights.go_review', 'Review now')}</Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="rounded-xl bg-muted/50 p-3"><div className="text-lg font-bold text-foreground">{pct(i.overall.accuracy)}</div><div className="text-[11px] text-muted-foreground">{t('insights.accuracy', 'Accuracy')}</div></div>
        <div className="rounded-xl bg-muted/50 p-3"><div className="text-lg font-bold text-foreground">{i.overall.attempts}</div><div className="text-[11px] text-muted-foreground">{t('insights.answers', 'Answers')}</div></div>
        <div className="rounded-xl bg-muted/50 p-3"><div className="text-lg font-bold text-foreground flex items-center gap-1"><Target className="w-4 h-4 text-emerald-500" />{i.plan.newItemsCap}</div><div className="text-[11px] text-muted-foreground">{t('insights.new_cap', 'New items / day')}</div></div>
      </div>

      {i.leeches.length > 0 && (
        <div className="mt-4 flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 rounded-xl p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{t('insights.leech_list', 'Not sticking yet')}: {i.leeches.slice(0, 5).map((l) => `${l.itemId} (${pct(l.accuracy)})`).join(', ')}</span>
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-4 space-y-2">
          {suggestions.map(({ s, text }) => (
            <li key={s.code} className="text-sm text-foreground/90 flex gap-2"><span aria-hidden>💡</span><span>{text}</span></li>
          ))}
        </ul>
      )}

      <button onClick={() => setShowEvidence((v) => !v)} aria-expanded={showEvidence} className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEvidence ? 'rotate-180' : ''}`} />
        {t('insights.why', 'Why these suggestions? (research)')}
      </button>
      {showEvidence && (
        <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
          {evidence.map((e) => (
            <li key={e.id}><a href={e.url} target="_blank" rel="noreferrer noopener" className="underline hover:text-foreground">{e.cite}</a><br />{e.supports}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
