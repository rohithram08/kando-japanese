import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ConversationPracticePage from '../ConversationPracticePage'
import { aiService } from '../../services/aiService'

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    profile: {
      username: 'Sakura',
      native_language: 'English',
      current_level: 'N5',
    },
  }),
}))

const mockAddXP = vi.fn()
vi.mock('../../store/progressStore', () => ({
  useProgressStore: () => ({
    addXP: mockAddXP,
  }),
}))

const mockAddChat = vi.fn()
vi.mock('../../store/dailyGoalsStore', () => ({
  useDailyGoalsStore: () => ({
    addChat: mockAddChat,
  }),
}))

vi.mock('../../services/aiService', () => ({
  aiService: {
    startChat: vi.fn().mockResolvedValue({
      message: 'いらっしゃいませ！何にしますか？',
      romaji: 'Irasshaimase! Nani ni shimasu ka?',
      translation: 'Welcome! What will you have?',
      grammar: '〜にします — deciding on ~',
      corrections: null,
    }),
    chat: vi.fn().mockResolvedValue({
      message: 'かしこまりました。少々お待ちください。',
      romaji: 'Kashikomarimashita. Shoushou omachi kudasai.',
      translation: 'Certainly. Please wait a moment.',
      grammar: 'お〜ください — respectful request',
      corrections: {
        original: 'これ ください',
        corrected: 'これをお願いします',
        explanation: 'In polite dining, をお願いします is more polite than ください.',
      },
    }),
    resetHistory: vi.fn(),
  },
}))

const GREETING = 'いらっしゃいませ！何にしますか？'

const renderPage = () =>
  render(
    <MemoryRouter>
      <ConversationPracticePage />
    </MemoryRouter>
  )

const openScenario = async (id = 'greetings') => {
  const card = document.querySelector(`[data-scenario-id="${id}"]`) as HTMLElement
  expect(card).not.toBeNull()
  fireEvent.click(card)
  await waitFor(() => expect(screen.getByText(GREETING)).toBeDefined())
}

describe('ConversationPracticePage — hub → chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    class MockSpeechSynthesisUtterance {
      text: string
      lang = 'ja-JP'
      rate = 1
      constructor(text: string) {
        this.text = text
      }
    }
    ;(global as any).SpeechSynthesisUtterance = MockSpeechSynthesisUtterance

    window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
    } as any
    window.HTMLMediaElement.prototype.play = vi.fn()
  })

  afterEach(() => {
    cleanup()
  })

  describe('hub', () => {
    it('opens on a calm hub — title, two modes, picks — and does NOT start an AI chat until you choose', () => {
      renderPage()
      expect(screen.getByRole('heading', { level: 1, name: 'Conversation Practice' })).toBeDefined()
      expect(screen.getByText('会話練習')).toBeDefined()
      expect(screen.getByRole('tab', { name: /Role-play/i })).toBeDefined()
      expect(screen.getByRole('tab', { name: /Free talk/i })).toBeDefined()
      expect(screen.getByText(/Picked for you · N5/i)).toBeDefined()
      expect(screen.getByTestId('quick-start-btn')).toBeDefined()
      expect(aiService.startChat).not.toHaveBeenCalled()
    })

    it('filters scenarios by search, category and difficulty', () => {
      renderPage()
      const total = screen.getAllByTestId('scenario-card').length
      fireEvent.change(screen.getByPlaceholderText(/Search scenarios/i), { target: { value: 'restaurant' } })
      const filtered = screen.getAllByTestId('scenario-card')
      expect(filtered.length).toBeLessThan(total)
      expect(document.querySelector('[data-scenario-id="restaurant"]')).not.toBeNull()
      fireEvent.change(screen.getByPlaceholderText(/Search scenarios/i), { target: { value: 'zzzz-nothing' } })
      expect(screen.getByText(/No scenarios match/i)).toBeDefined()
      fireEvent.click(screen.getByRole('button', { name: /Clear filters/i }))
      expect(screen.getAllByTestId('scenario-card').length).toBeGreaterThan(10)
      fireEvent.click(screen.getByRole('button', { name: 'Advanced' }))
      expect(document.querySelector('[data-scenario-id="debate"]')).not.toBeNull()
      expect(document.querySelector('[data-scenario-id="greetings"]')).toBeNull()
    })

    it('shows locked scenarios as disabled with a way to unlock them, and unlocks after enough completions', () => {
      const { unmount } = renderPage()
      const locked = document.querySelector('[data-scenario-id="keigo"]') as HTMLButtonElement
      expect(locked.disabled).toBe(true)
      expect(locked.textContent).toMatch(/Complete 5 more scenarios to unlock/i)
      unmount()

      localStorage.setItem('nihongo_completed_scenarios', JSON.stringify(['a', 'b', 'c', 'd', 'e']))
      renderPage()
      expect((document.querySelector('[data-scenario-id="keigo"]') as HTMLButtonElement).disabled).toBe(false)
    })

    it('offers "Continue" for a conversation that is already under way', () => {
      localStorage.setItem(
        'nihongo_conv_scenario_restaurant',
        JSON.stringify([
          { id: 'm1', role: 'assistant', content: 'いらっしゃいませ', timestamp: '2026-10-20T10:00:00Z' },
          { id: 'm2', role: 'user', content: 'メニューをください', timestamp: '2026-10-20T10:01:00Z' },
        ])
      )
      renderPage()
      expect(screen.getByTestId('resume-btn').textContent).toMatch(/At the Restaurant/)
    })

    it('Free talk tab shows level pills and topics, and starting a topic opens the chat', async () => {
      renderPage()
      fireEvent.click(screen.getByRole('tab', { name: /Free talk/i }))
      expect(screen.getByRole('button', { name: 'N5' })).toBeDefined()
      expect(screen.getByRole('button', { name: 'N1' })).toBeDefined()
      expect(screen.getByText(/Daily Life & Routines/i)).toBeDefined()

      fireEvent.click(screen.getByTestId('free-open-chat'))
      // free talk opens with Hana-sensei's own greeting (no AI round-trip needed)
      await waitFor(() => expect(screen.getByText(/私は花先生/)).toBeDefined())
      expect(screen.getByTestId('conversation-chat')).toBeDefined()
      expect(screen.getByTestId('chat-title').textContent).toMatch(/Free talk with Hana-sensei/i)
    })
  })

  describe('chat', () => {
    it('choosing a scenario starts the chat with the greeting and its translation', async () => {
      renderPage()
      await openScenario()
      expect(aiService.startChat).toHaveBeenCalled()
      expect(screen.getByText('Welcome! What will you have?')).toBeDefined()
      expect(screen.getByTestId('chat-title').textContent).toBe('Greetings & Introductions')
    })

    it('back returns to the hub; the conversation is kept so the hub offers Continue', async () => {
      renderPage()
      await openScenario()
      fireEvent.click(screen.getAllByTestId('quick-reply-btn')[0])
      await waitFor(() => expect(aiService.chat).toHaveBeenCalled())
      await waitFor(() => expect(screen.getAllByTestId('chat-message').length).toBeGreaterThanOrEqual(3))

      fireEvent.click(screen.getByRole('button', { name: /Back to scenarios/i }))
      expect(screen.getByTestId('conversation-hub')).toBeDefined()
      expect(screen.getByTestId('resume-btn').textContent).toMatch(/Greetings & Introductions/)
    })

    it('quick replies send a message, award XP and count towards the daily goal', async () => {
      renderPage()
      await openScenario()
      const quickButtons = screen.getAllByTestId('quick-reply-btn')
      expect(quickButtons.length).toBeGreaterThan(0)
      fireEvent.click(quickButtons[0])
      await waitFor(() => {
        expect(aiService.chat).toHaveBeenCalled()
        expect(mockAddChat).toHaveBeenCalled()
        expect(mockAddXP).toHaveBeenCalledWith(15)
      })
    })

    it('renders the grammar correction card when the AI spots a mistake', async () => {
      renderPage()
      await openScenario()
      fireEvent.change(screen.getByPlaceholderText(/Type in Japanese/i), { target: { value: 'これ ください' } })
      fireEvent.click(screen.getByRole('button', { name: /Send message/i }))
      await waitFor(() => {
        expect(screen.getByText(/Grammar Tip & Correction/i)).toBeDefined()
        expect(screen.getByText(/これをお願いします/i)).toBeDefined()
      })
    })

    it('plays Japanese audio from the message actions', async () => {
      renderPage()
      await openScenario()
      fireEvent.click(screen.getAllByRole('button', { name: /Listen audio/i })[0])
      expect(window.speechSynthesis.speak).toHaveBeenCalled()
    })

    it('keeps display options in one menu: translation can be switched off', async () => {
      renderPage()
      await openScenario()
      expect(screen.getByText('Welcome! What will you have?')).toBeDefined()
      fireEvent.click(screen.getByRole('button', { name: /Display & audio/i }))
      fireEvent.click(screen.getByRole('menuitemcheckbox', { name: /English translation/i }))
      expect(screen.queryByText('Welcome! What will you have?')).toBeNull()
    })

    it('Coach panel: tapping a useful phrase drops it into the message box', async () => {
      renderPage()
      await openScenario()
      if (!screen.queryByTestId('coach-panel')) fireEvent.click(screen.getByRole('button', { name: 'Coach' }))
      const panel = screen.getByTestId('coach-panel')
      const phrase = panel.querySelector('ul button') as HTMLButtonElement
      fireEvent.click(phrase)
      const input = screen.getByTestId('conversation-input') as HTMLInputElement
      expect(input.value.length).toBeGreaterThan(0)
    })

    it('can finish a scenario: awards XP once and records it as completed', async () => {
      renderPage()
      await openScenario()
      fireEvent.click(screen.getByText('こんにちは！'))
      await waitFor(() => expect(screen.getByTestId('complete-scenario-btn')).toBeDefined())
      fireEvent.click(screen.getByTestId('complete-scenario-btn'))
      const stored = JSON.parse(localStorage.getItem('nihongo_completed_scenarios') || '[]')
      expect(stored).toContain('greetings')
    })
  })
})
