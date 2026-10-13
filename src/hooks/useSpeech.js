import { useState, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'

export function useSpeech({ onResult, onError, lang = 'ja-JP' }) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setSupported(false)
      return
    }

    setSupported(true)
    const recognition = new SpeechRecognition()

    recognition.lang = lang
    recognition.continuous = true
    recognition.interimResults = true
    recognition.maxAlternatives = 3

    recognition.onstart = () => {
      setIsListening(true)
      setTranscript('')
      setInterimTranscript('')
    }

    recognition.onresult = (event) => {
      let finalTranscript = ''
      let interimText = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimText += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript)
        onResult?.(finalTranscript)
      }
      setInterimTranscript(interimText)
    }

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error)
      setIsListening(false)
      setInterimTranscript('')

      const errorMessages = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'Microphone not found.',
        'not-allowed': 'Microphone permission denied.',
        'network': 'Network error. Check your connection.',
      }

      const message = errorMessages[event.error] || `Speech error: ${event.error}`
      toast.error(message)
      onError?.(event.error)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
    }
  }, [lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser')
      return
    }
    if (isListening) return

    try {
      recognitionRef.current.start()
      toast.success('🎤 Listening... Speak in Japanese!', { duration: 2000 })
    } catch (err) {
      console.error('Start listening error:', err)
    }
  }, [isListening])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
  }, [])

  return {
    isListening,
    transcript,
    interimTranscript,
    supported,
    startListening,
    stopListening,
    resetTranscript
  }
}