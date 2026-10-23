import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import ComprehensionQuiz from '../ComprehensionQuiz'
import { useProgressStore } from '../../../store/progressStore'

const questions = [
  {
    id: 'q1',
    type: 'particle',
    question: '「私＿学生です」に入る助詞は？',
    options: ['は', 'を', 'に'],
    correctAnswer: 0,
    explanation: 'は marks the topic of the sentence.',
    wrongExplanations: { 1: 'を marks a direct object; 学生です has no verb to take one.' },
  },
  {
    id: 'q2',
    type: 'vocabulary',
    question: '「学生」の意味は？',
    options: ['teacher', 'student', 'doctor'],
    correctAnswer: 1,
    explanation: '学生 means student.',
    wrongExplanations: { 0: '先生 is teacher, not 学生.' },
  },
]

const firstTime = {
  progress: {},
  xpAwarded: 100,
  rewards: { storyXp: 40, quizXp: 60, totalXp: 100, firstCompletion: true, alreadyCompleted: false },
  streak: { recorded: true, days: 4, firstActivityToday: true },
  synced: true,
}

function answerAll(correct: boolean) {
  // Q1
  fireEvent.click(screen.getByText(correct ? 'は' : 'を'))
  fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
  // Q2
  fireEvent.click(screen.getByText(correct ? 'student' : 'teacher'))
  fireEvent.click(screen.getByRole('button', { name: /See Results/i }))
}

describe('ComprehensionQuiz — story quiz, explanations and server-backed rewards', () => {
  beforeEach(() => {
    useProgressStore.setState({ totalXP: 100 } as any)
  })
  afterEach(() => cleanup())

  it('explains WHY a wrong particle is wrong, in the context of the story', () => {
    render(<ComprehensionQuiz questions={questions} isAuthenticated onSubmit={vi.fn()} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    fireEvent.click(screen.getByText('を'))
    expect(screen.getByText(/Why this option is incorrect/i)).toBeDefined()
    expect(screen.getByText(/direct object/i)).toBeDefined()
    expect(screen.getByText(/marks the topic/i)).toBeDefined() // why the right answer is right
  })

  it('submits automatically when the last question is answered (no separate save click) and shows what the SERVER granted', async () => {
    const onSubmit = vi.fn().mockResolvedValue(firstTime)
    render(<ComprehensionQuiz questions={questions} isAuthenticated onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(true)

    await waitFor(() => expect(screen.getByTestId('wave-xp-result').textContent).toMatch(/100/))
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(onSubmit).toHaveBeenCalledWith(100)
    expect(screen.getByText(/Story \+40/)).toBeDefined()
    expect(screen.getByTestId('streak-line').textContent).toMatch(/Jelly Streak: 4 days/)
    expect(screen.getByTestId('level-progress')).toBeDefined()
  })

  it('records the streak and the (smaller) reward even when the quiz is failed', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      ...firstTime,
      rewards: { storyXp: 40, quizXp: 30, totalXp: 70, firstCompletion: true, alreadyCompleted: false },
    })
    render(<ComprehensionQuiz questions={questions} isAuthenticated onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(false)

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(0))
    await waitFor(() => expect(screen.getByTestId('streak-line')).toBeDefined())
    expect(screen.getByText(/Needs Review/i)).toBeDefined()
    expect(screen.getByTestId('wave-xp-result').textContent).toMatch(/70/)
  })

  it('on a retake says the Wave XP was already earned and that today\'s streak is already counted', async () => {
    const onSubmit = vi.fn().mockResolvedValue({
      progress: {},
      xpAwarded: 0,
      rewards: { storyXp: 0, quizXp: 0, totalXp: 0, firstCompletion: false, alreadyCompleted: true },
      streak: { recorded: true, days: 4, firstActivityToday: false },
      synced: true,
    })
    render(<ComprehensionQuiz questions={questions} isAuthenticated alreadyCompleted onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(true)

    await waitFor(() => expect(screen.getByText(/already earned/i)).toBeDefined())
    expect(screen.getByTestId('wave-xp-result').textContent).toMatch(/\+0/)
    expect(screen.getByTestId('streak-line').textContent).toMatch(/already counted \(4 days\)/)
  })

  it('never claims rewards for guests, and tells them how to keep them', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ progress: {}, xpAwarded: 0, synced: false })
    render(<ComprehensionQuiz questions={questions} isAuthenticated={false} onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(true)

    await waitFor(() => expect(screen.getByTestId('streak-line').textContent).toMatch(/Sign in/i))
    expect(screen.queryByTestId('level-progress')).toBeNull()
    expect(screen.queryByText(/already earned/i)).toBeNull()
  })

  it('is honest when the server could not be reached', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ progress: {}, xpAwarded: 0, synced: false })
    render(<ComprehensionQuiz questions={questions} isAuthenticated onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(true)

    await waitFor(() => expect(screen.getByTestId('streak-line').textContent).toMatch(/not recorded/i))
  })

  it('retake resets the quiz and a second submission is a separate call (server dedupes rewards)', async () => {
    const onSubmit = vi.fn().mockResolvedValue(firstTime)
    render(<ComprehensionQuiz questions={questions} isAuthenticated onSubmit={onSubmit} onFinish={vi.fn()} onBackToStory={vi.fn()} />)
    answerAll(true)
    await waitFor(() => expect(screen.getByTestId('wave-xp-result')).toBeDefined())
    fireEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }))
    expect(screen.getByText(/Question 1 of 2/i)).toBeDefined()
    answerAll(true)
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(2))
  })
})
