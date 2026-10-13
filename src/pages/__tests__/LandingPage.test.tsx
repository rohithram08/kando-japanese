import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../LandingPage'

const mockUser = { id: 'u1', username: 'TestLearner', email: 'test@example.com' }
let currentMockUser: any = null

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: currentMockUser,
    profile: currentMockUser,
  }),
}))

vi.mock('../../store/themeStore', () => ({
  useThemeStore: () => ({
    theme: 'light',
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  }),
}))

describe('LandingPage Component', () => {
  beforeEach(() => {
    currentMockUser = null
    vi.clearAllMocks()

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
  })

  afterEach(() => {
    cleanup()
  })

  it('renders hero title, Japanese brand subtitle, and 2D Hana-sensei presentation', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    // Brand and headline
    const brands = screen.getAllByText('Nihongo Master')
    expect(brands.length).toBeGreaterThan(0)
    expect(screen.getByText('日本語マスター')).toBeDefined()
    expect(screen.getByText(/Master Japanese as a/i)).toBeDefined()
    expect(screen.getByText(/Learn Japanese\./i)).toBeDefined()
    expect(screen.getByText(/Live the Language\./i)).toBeDefined()

    // 2D Hana-sensei character presentation
    expect(screen.getByAltText(/Hana-sensei anime tutor character/i)).toBeDefined()
    expect(screen.getByText(/「こんにちは！一緒に日本語を勉強しましょう！」/i)).toBeDefined()

    // Ensure no WebGL Canvas is embedded on the landing page
    expect(document.querySelector('canvas')).toBeNull()
  })

  it('renders call to action buttons for unauthenticated guests', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    const getStartedBtns = screen.getAllByRole('button', { name: /Start Learning Free|Get Started Free/i })
    expect(getStartedBtns.length).toBeGreaterThan(0)
    const signInBtns = screen.getAllByRole('button', { name: /Sign In/i })
    expect(signInBtns.length).toBeGreaterThan(0)

    // Public guest exploration links
    expect(screen.getByText(/Graded Reader \(6 Stories\)/i)).toBeDefined()
    const kanaLinks = screen.getAllByText(/Kana Studio/i)
    expect(kanaLinks.length).toBeGreaterThan(0)
  })

  it('renders dashboard redirect button when user is logged in', () => {
    currentMockUser = mockUser
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    const dashBtns = screen.getAllByRole('button', { name: /Dashboard/i })
    expect(dashBtns.length).toBeGreaterThan(0)
  })

  it('allows switching between JLPT levels and updates sample sentences', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    // Initially on N5
    expect(screen.getByText('Beginner Foundations')).toBeDefined()
    expect(screen.getByText(/毎朝七時に起きて、学校へ行きます。/i)).toBeDefined()

    // Click N4 tab
    const n4Tab = screen.getByRole('button', { name: /N4/i })
    fireEvent.click(n4Tab)

    expect(screen.getByText('Elementary Conversational')).toBeDefined()
    expect(screen.getByText(/京都駅に着いた時、少し心配になりました。/i)).toBeDefined()

    // Click N1 tab
    const n1Tab = screen.getByRole('button', { name: /N1/i })
    fireEvent.click(n1Tab)

    expect(screen.getByText('Mastery & Nuance')).toBeDefined()
    expect(screen.getByText(/言葉の持つ多様な響きを味わいながら対話を深めます。/i)).toBeDefined()
  })

  it('invokes speech synthesis when clicking Listen Audio', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    const listenBtn = screen.getByRole('button', { name: /Listen to sample sentence/i })
    fireEvent.click(listenBtn)

    expect(window.speechSynthesis.cancel).toHaveBeenCalled()
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('cycles through Hana-sensei Japanese greetings and plays speech', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    // Initial greeting
    expect(screen.getByText(/「こんにちは！一緒に日本語を勉強しましょう！」/i)).toBeDefined()

    // Click next greeting button
    const nextGreetingBtn = screen.getByRole('button', { name: /Next Japanese greeting/i })
    fireEvent.click(nextGreetingBtn)

    // Second greeting appears
    expect(screen.getByText(/「今日も一歩ずつ、楽しく学びましょう！」/i)).toBeDefined()

    // Click listen button on speech bubble
    const listenBubbleBtn = screen.getByRole('button', { name: /Listen to Hana-sensei greeting/i })
    fireEvent.click(listenBubbleBtn)

    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('renders interactive floating kana and plays pronunciation on click', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    const hiraganaA = screen.getByRole('button', { name: /Hiragana character あ/i })
    expect(hiraganaA).toBeDefined()

    fireEvent.click(hiraganaA)
    expect(window.speechSynthesis.speak).toHaveBeenCalled()
  })

  it('renders connected learning journey roadmap steps', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    expect(screen.getByText(/A Complete Learning Journey/i)).toBeDefined()
    expect(screen.getByText(/Kana Studio & Pronunciation/i)).toBeDefined()
    expect(screen.getByText(/学生の一日/i)).toBeDefined()
    expect(screen.getByText(/Unified Conversation Practice/i)).toBeDefined()
    expect(screen.getByText(/Spaced Repetition System \(SRS\)/i)).toBeDefined()
  })

  it('renders all key feature highlights and maintains zero canvas tags', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    )

    const readerMatches = screen.getAllByText(/JLPT Graded Readers/i)
    expect(readerMatches.length).toBeGreaterThan(0)
    const convMatches = screen.getAllByText(/Conversation Practice/i)
    expect(convMatches.length).toBeGreaterThan(0)
    const kanaMatches = screen.getAllByText(/Kana Studio/i)
    expect(kanaMatches.length).toBeGreaterThan(0)
    expect(screen.getByText('Spaced Repetition System')).toBeDefined()

    // Absolute zero WebGL canvas requirement
    expect(document.querySelectorAll('canvas').length).toBe(0)
  })
})
