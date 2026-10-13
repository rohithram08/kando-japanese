import { useState, useCallback, useRef } from 'react'

export function useAudio() {
  const [playing, setPlaying] = useState(false)
  const [currentText, setCurrentText] = useState('')
  const utteranceRef = useRef(null)

  const speak = useCallback((text, lang = 'ja-JP', rate = 0.85) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = rate
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Try to find native Japanese voice
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const jpVoice = voices.find(v =>
        v.lang.startsWith('ja') && v.localService
      ) || voices.find(v => v.lang.startsWith('ja'))

      if (jpVoice) utterance.voice = jpVoice
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoices()
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    utterance.onstart = () => {
      setPlaying(true)
      setCurrentText(text)
    }
    utterance.onend = () => {
      setPlaying(false)
      setCurrentText('')
    }
    utterance.onerror = () => {
      setPlaying(false)
      setCurrentText('')
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setPlaying(false)
    setCurrentText('')
  }, [])

  const speakSlow = useCallback((text) => {
    speak(text, 'ja-JP', 0.6)
  }, [speak])

  const speakNormal = useCallback((text) => {
    speak(text, 'ja-JP', 0.85)
  }, [speak])

  const speakFast = useCallback((text) => {
    speak(text, 'ja-JP', 1.1)
  }, [speak])

  return {
    speak,
    stop,
    speakSlow,
    speakNormal,
    speakFast,
    playing,
    currentText
  }
}