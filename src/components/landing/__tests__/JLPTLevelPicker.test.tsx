// src/components/landing/__tests__/JLPTLevelPicker.test.tsx
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import JLPTLevelPicker from '../JLPTLevelPicker'

describe('JLPTLevelPicker Component (Phase D — Level Picker & Polish)', () => {
  const mockSpeak = vi.fn()
  const mockOnSelectLevel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders all 5 JLPT level selectable cards with N5 active by default', () => {
    render(
      <MemoryRouter>
        <JLPTLevelPicker
          selectedLevel="N5"
          onSelectLevel={mockOnSelectLevel}
          speakJapanese={mockSpeak}
          isPlayingAudio={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('I want to start at:')).toBeDefined()
    expect(screen.getByText('Beginner Foundations')).toBeDefined()
    expect(screen.getByText('毎朝七時に起きて、学校へ行きます。')).toBeDefined()
    expect(screen.getByText('Start N5 Journey')).toBeDefined()

    // Verify all 5 level cards exist
    expect(screen.getByRole('button', { name: /Select JLPT level N5/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Select JLPT level N4/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Select JLPT level N3/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Select JLPT level N2/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Select JLPT level N1/i })).toBeDefined()
  })

  it('triggers onSelectLevel when a different level card is clicked', () => {
    render(
      <MemoryRouter>
        <JLPTLevelPicker
          selectedLevel="N5"
          onSelectLevel={mockOnSelectLevel}
          speakJapanese={mockSpeak}
          isPlayingAudio={false}
        />
      </MemoryRouter>
    )

    const n3Btn = screen.getByRole('button', { name: /Select JLPT level N3/i })
    fireEvent.click(n3Btn)

    expect(mockOnSelectLevel).toHaveBeenCalledWith('N3')
  })

  it('triggers speech playback when clicking Listen Audio button', () => {
    render(
      <MemoryRouter>
        <JLPTLevelPicker
          selectedLevel="N5"
          onSelectLevel={mockOnSelectLevel}
          speakJapanese={mockSpeak}
          isPlayingAudio={false}
        />
      </MemoryRouter>
    )

    const listenBtn = screen.getByRole('button', { name: /Listen to sample sentence/i })
    fireEvent.click(listenBtn)

    expect(mockSpeak).toHaveBeenCalledWith('毎朝七時に起きて、学校へ行きます。')
  })

  it('updates details and CTA when selectedLevel is N2', () => {
    render(
      <MemoryRouter>
        <JLPTLevelPicker
          selectedLevel="N2"
          onSelectLevel={mockOnSelectLevel}
          speakJapanese={mockSpeak}
          isPlayingAudio={false}
        />
      </MemoryRouter>
    )

    expect(screen.getByText('Advanced Fluency')).toBeDefined()
    expect(screen.getByText(/プロジェクトの進捗に応じて計画を見直す必要があります。/i)).toBeDefined()
    expect(screen.getByText('Start N2 Journey')).toBeDefined()
  })
})
