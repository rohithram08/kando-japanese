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

describe('ConversationPracticePage Component', () => {
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

  it('renders workspace title, mode switcher, and loads initial scenario', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Conversation Practice')).toBeDefined()
    expect(screen.getByText('会話練習')).toBeDefined()
    expect(screen.getByText(/Scenario Roleplay/i)).toBeDefined()
    expect(screen.getByText(/Free Talk/i)).toBeDefined()

    // Verifies startChat is invoked for scenario
    await waitFor(() => {
      expect(aiService.startChat).toHaveBeenCalled()
    })

    expect(screen.getByText('いらっしゃいませ！何にしますか？')).toBeDefined()
    expect(screen.getByText('Welcome! What will you have?')).toBeDefined()
  })

  it('displays quick reply buttons and clicking one sends a message', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('いらっしゃいませ！何にしますか？')).toBeDefined()
    })

    // Find a quick reply button by test id
    const quickButtons = screen.getAllByTestId('quick-reply-btn')
    expect(quickButtons.length).toBeGreaterThan(0)

    fireEvent.click(quickButtons[0])

    await waitFor(() => {
      expect(aiService.chat).toHaveBeenCalled()
      expect(mockAddChat).toHaveBeenCalled()
      expect(mockAddXP).toHaveBeenCalledWith(15)
    })
  })

  it('renders grammar correction card when AI identifies a learner mistake', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('いらっしゃいませ！何にしますか？')).toBeDefined()
    })

    const input = screen.getByPlaceholderText(/Type your response in Japanese/i)
    fireEvent.change(input, { target: { value: 'これ ください' } })

    const sendBtn = screen.getByRole('button', { name: /Send message/i })
    fireEvent.click(sendBtn)

    await waitFor(() => {
      expect(screen.getByText(/Grammar Tip & Correction/i)).toBeDefined()
      expect(screen.getByText(/これをお願いします/i)).toBeDefined()
    })
  })

  it('allows switching to Free Talk mode and displays level selector', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    const freeTalkTab = screen.getByRole('button', { name: /Free Talk/i })
    fireEvent.click(freeTalkTab)

    expect(screen.getByText(/Hana-sensei \(花先生\)/i)).toBeDefined()
    expect(screen.getByRole('button', { name: 'N5' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'N1' })).toBeDefined()
    expect(screen.getByText(/Daily Life & Routines/i)).toBeDefined()
  })

  it('plays Japanese audio when clicking voice button', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('いらっしゃいませ！何にしますか？')).toBeDefined()
    })

    const audioBtns = screen.getAllByRole('button', { name: /Listen audio/i })
    expect(audioBtns.length).toBeGreaterThan(0)

    fireEvent.click(audioBtns[0])
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('supports scenario completion, awards XP, and updates completed status', async () => {
    render(
      <MemoryRouter>
        <ConversationPracticePage />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('いらっしゃいませ！何にしますか？')).toBeDefined()
    })

    // Send a quick reply message so messages.length >= 2
    const quickReply = screen.getByText('こんにちは！')
    fireEvent.click(quickReply)

    await waitFor(() => {
      expect(screen.getByTestId('complete-scenario-btn')).toBeDefined()
    })

    const completeBtn = screen.getByTestId('complete-scenario-btn')
    fireEvent.click(completeBtn)

    // Verify localStorage has completed scenario
    const stored = JSON.parse(localStorage.getItem('nihongo_completed_scenarios') || '[]')
    expect(stored).toContain('greetings')
  })
})
