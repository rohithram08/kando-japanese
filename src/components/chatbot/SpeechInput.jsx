import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '../../store/themeStore'

const BAR_COUNT = 5

const SpeechInput = ({
  onTranscript,
  language = 'ja-JP', disabled = false,
}) => {
  const { resolvedTheme } = useThemeStore()
  const isDark = resolvedTheme === 'dark'

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')
  const [audioLevel, setAudioLevel] = useState(0)

  const recognitionRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)
  const streamRef = useRef(null)
  const audioCtxRef = useRef(null)

  const isSupported =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)

  /* ── Audio Analyser (waveform visualiser) ─────────────── */
  const setupAudioAnalyser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const ctx = new (window.AudioContext || window.webkitAudioContext)()
      audioCtxRef.current = ctx

      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8
      source.connect(analyser)
      analyserRef.current = analyser

      const buffer = new Uint8Array(analyser.frequencyBinCount)

      const tick = () => {
        analyser.getByteFrequencyData(buffer)
        const avg = buffer.reduce((a, b) => a + b, 0) / buffer.length
        setAudioLevel(avg)
        animationRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      /* mic access denied — recognition still works, just no visualiser */
    }
  }, [])

  const teardownAudioAnalyser = useCallback(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close().catch(() => {})
    analyserRef.current = null
    streamRef.current = null
    audioCtxRef.current = null
    setAudioLevel(0)
  }, [])

  /* ── Start Recognition ────────────────────────────────── */
  const startListening = useCallback(async () => {
    if (!isSupported || disabled) return
    setError('')
    setTranscript('')

    await setupAudioAnalyser()

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SR()

    recognition.lang = language
    recognition.continuous = false
    recognition.interimResults = true
    recognition.maxAlternatives = 1

    recognition.onresult = (e) => {
      let interim = ''
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript
        else interim += r[0].transcript
      }
      const text = final || interim
      setTranscript(text)
      if (final) onTranscript?.(final)
    }

    recognition.onerror = (e) => {
      if (e.error !== 'no-speech') {
        setError(e.error === 'not-allowed' ? 'Microphone blocked' : `Error: ${e.error}`)
      }
      setIsListening(false)
      teardownAudioAnalyser()
    }

    recognition.onend = () => {
      setIsListening(false)
      teardownAudioAnalyser()
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }, [isSupported, disabled, language, onTranscript, setupAudioAnalyser, teardownAudioAnalyser])

  /* ── Stop Recognition ─────────────────────────────────── */
  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    teardownAudioAnalyser()
  }, [teardownAudioAnalyser])

  /* ── Cleanup ──────────────────────────────────────────── */
  useEffect(() => {
    return () => {
      teardownAudioAnalyser()
      recognitionRef.current?.stop()
      window.speechSynthesis?.cancel()
    }
  }, [teardownAudioAnalyser])

  /* ── Auto-clear error after 4 s ───────────────────────── */
  useEffect(() => {
    if (!error) return
    const id = setTimeout(() => setError(''), 4000)
    return () => clearTimeout(id)
  }, [error])

  /* ── Render ───────────────────────────────────────────── */
  return (
    <div className="flex items-center gap-2">
      {/* Waveform Bars */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-end gap-[3px] h-6 overflow-hidden"
          >
            {Array.from({ length: BAR_COUNT }, (_, i) => {
              const norm = Math.min(audioLevel / 180, 1)
              const h = Math.max(4, norm * 22 + Math.sin(i * 1.2) * 3)
              return (
                <motion.div
                  key={i}
                  className={`
                    w-[3px] rounded-full
                    bg-red-500 dark:bg-red-400
                  `}
                  animate={{ height: [4, h, 4] }}
                  transition={{
                    duration: 0.45,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.07,
                  }}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interim Transcript Chip */}
      <AnimatePresence>
        {transcript && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className={`
              inline-block text-[11px] leading-tight font-medium
              px-2.5 py-1 rounded-lg max-w-[140px] truncate select-none
              bg-gray-100 text-gray-600 ring-1 ring-gray-200 dark:bg-gray-700/80 dark:text-gray-300 dark:ring-1 dark:ring-gray-600/50
            `}
          >
            {transcript}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Mic Toggle */}
      <motion.button
        whileHover={!disabled && isSupported ? { scale: 1.08 } : {}}
        whileTap={!disabled && isSupported ? { scale: 0.9 } : {}}
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || !isSupported}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        title={
          !isSupported
            ? 'Speech recognition is not supported in this browser'
            : isListening
              ? 'Stop listening'
              : 'Start voice input'
        }
        className={`
          relative flex items-center justify-center
          w-9 h-9 rounded-xl transition-all duration-200 outline-none
          focus-visible:ring-2 focus-visible:ring-offset-2
          ${isListening
            ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 focus-visible:ring-red-400'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 focus-visible:ring-gray-400 dark:bg-white/[0.06] dark:text-gray-400 dark:hover:bg-white/[0.1] dark:hover:text-gray-200 dark:focus-visible:ring-gray-500'}
          ${disabled || !isSupported ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}

        {/* Active pulse ring */}
        {isListening && (
          <motion.span
            className="absolute inset-0 rounded-xl border-2 border-red-400/60 pointer-events-none"
            animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </motion.button>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className={`
              text-[10px] font-medium leading-tight px-2 py-0.5 rounded-md
              max-w-[120px] truncate select-none
              bg-red-50 text-red-500 ring-1 ring-red-200 dark:bg-red-900/40 dark:text-red-300 dark:ring-1 dark:ring-red-800/50
            `}
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SpeechInput