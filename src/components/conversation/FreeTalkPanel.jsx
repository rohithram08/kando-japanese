// Free talk setup: pick your level, then a topic (or just start chatting).
import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n'

const TOPIC_EMOJI = { daily: '🌤️', food: '🍜', travel: '🗾', hobbies: '🎮', study: '📚' }

export default function FreeTalkPanel({ levels, topics, level, onLevelChange, onStart }) {
  const { t } = useI18n()
  return (
    <div className="space-y-6" data-testid="free-talk-panel">
      <section aria-labelledby="ft-level">
        <h2 id="ft-level" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {t('conversation.your_level', 'Your level')}
        </h2>
        <div className="flex flex-wrap gap-2">
          {levels.map(({ level: lv, label, color }) => (
            <button
              key={lv}
              type="button"
              aria-label={lv}
              aria-pressed={level === lv}
              onClick={() => onLevelChange(lv)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                level === lv ? `${color} shadow-sm scale-[1.03]` : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/30'
              }`}
            >
              <span>{lv}</span>
              <span className="hidden sm:inline text-[11px] font-medium opacity-80"> · {label.replace(/^N\d\s/, '')}</span>
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="ft-topic">
        <h2 id="ft-topic" className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
          {t('conversation.pick_topic', 'Pick a topic')}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <motion.button
            type="button"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onStart(level, null)}
            data-testid="free-open-chat"
            className="sm:col-span-2 lg:col-span-1 text-left rounded-2xl p-4 border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent hover:shadow-lg hover:shadow-primary/10 transition-shadow"
          >
            <div className="flex items-center gap-3">
              <span className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><Sparkles className="w-6 h-6" /></span>
              <div>
                <p className="font-semibold text-sm text-foreground">{t('conversation.open_chat', 'Open chat')}</p>
                <p className="text-xs text-muted-foreground">{t('conversation.open_chat_desc', 'Let Hana-sensei lead — talk about anything')}</p>
              </div>
            </div>
          </motion.button>

          {topics.map((topic) => (
            <motion.button
              key={topic.id}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onStart(level, topic.starter)}
              className="text-left rounded-2xl p-4 border border-border bg-surface hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">{TOPIC_EMOJI[topic.id] || '💬'}</span>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{topic.label}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><MessageCircle className="w-3 h-3" />{t('conversation.start_topic', 'Start this topic')}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  )
}
