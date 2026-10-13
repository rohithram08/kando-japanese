import axios from 'axios'

// ─── SECURITY FIX ────────────────────────────────────────────────────────────
// AI requests are now proxied through our backend API.
// The Groq API key is NEVER exposed to the browser.
// The backend handles: authentication, rate limiting, key management.
// ─────────────────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || '/api'

class AIService {
  constructor() {
    this.conversationHistory = []
  }

  // ─── Core API Call (via backend proxy) ──────────────────────────────────────

  async _post(endpoint, data) {
    try {
      const response = await axios.post(`${API_BASE}/ai${endpoint}`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      })
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Please log in to use AI features')
      }
      if (error.response?.status === 429) {
        throw new Error('AI rate limit reached. Please wait a moment.')
      }
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message)
      }
      console.error('AI service error:', error.message)
      throw new Error('AI service unavailable')
    }
  }

  // ─── JSON Parser ──────────────────────────────────────────────────────────

  parseJSON(text) {
    try {
      // Strip markdown code blocks if present
      const jsonMatch =
        text.match(/```json\n?([\s\S]*?)\n?```/) ||
        text.match(/```\n?([\s\S]*?)\n?```/)

      const jsonStr = jsonMatch ? jsonMatch[1] : text

      // Find first object or array
      const objMatch = jsonStr.match(/\{[\s\S]*\}/)
      const arrMatch = jsonStr.match(/\[[\s\S]*\]/)

      if (objMatch) return JSON.parse(objMatch[0])
      if (arrMatch) return JSON.parse(arrMatch[0])

      return JSON.parse(jsonStr.trim())
    } catch (err) {
      console.warn('JSON parse failed, returning raw text:', err.message)
      return {
        message: text,
        romaji: '',
        translation: 'Could not parse translation',
        corrections: null,
      }
    }
  }

  // ─── Chat Methods ─────────────────────────────────────────────────────────

  async startChat(systemPrompt, scenario) {
    this.conversationHistory = []

    const result = await this._post('/chat/start', { systemPrompt, scenario })
    const parsed = typeof result.data === 'string' ? this.parseJSON(result.data) : result.data

    this.conversationHistory.push({
      role: 'assistant',
      content: parsed.message,
    })

    return parsed
  }

  async chat(messages, userMessage, systemPrompt) {
    this.conversationHistory = messages.map(m => ({
      role: m.role,
      content: m.content,
    }))

    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    })

    const result = await this._post('/chat', {
      messages: this.conversationHistory.slice(-10),
      userMessage,
      systemPrompt,
    })

    return typeof result.data === 'string' ? this.parseJSON(result.data) : result.data
  }

  // ─── Quiz Generation ──────────────────────────────────────────────────────

  async generateQuizQuestions(content, level, count = 5) {
    try {
      const result = await this._post('/generate-quiz', { content, level, count })
      return result.data || []
    } catch (err) {
      console.error('Quiz generation error:', err)
      return []
    }
  }

  // ─── Writing Checker ──────────────────────────────────────────────────────

  async checkWriting(text, level) {
    const result = await this._post('/check-writing', { text, level })
    return typeof result.data === 'string' ? this.parseJSON(result.data) : result.data
  }

  // ─── Mnemonic Generator ───────────────────────────────────────────────────

  async generateMnemonic(kanji, meaning) {
    const result = await this._post('/generate-mnemonic', { kanji, meaning })
    return typeof result.data === 'string' ? this.parseJSON(result.data) : result.data
  }

  // ─── Utility ──────────────────────────────────────────────────────────────

  resetHistory() {
    this.conversationHistory = []
  }
}

export const aiService = new AIService()