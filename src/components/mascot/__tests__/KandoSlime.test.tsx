import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import KandoSlime from '../KandoSlime'
import KandoSlimeLogo from '../KandoSlimeLogo'

describe('KandoSlimeLogo', () => {
  it('renders vector logo with accessible role and label', () => {
    render(<KandoSlimeLogo size={48} className="custom-logo" />)

    const logo = screen.getByRole('img', { name: /Kando Slime Logo/i })
    expect(logo).toBeDefined()
    expect(logo.className).toContain('custom-logo')
    expect(logo.querySelector('svg')).toBeDefined()
    expect(logo.querySelector('path')).toBeDefined()
  })
})

describe('KandoSlime Mascot', () => {
  it('renders interactive 2D mascot with speech bubble and default waving mood', () => {
    const handleSpeak = vi.fn()
    render(<KandoSlime mood="waving" onSpeak={handleSpeak} />)

    // Mascot button presence
    const mascot = screen.getByRole('button', { name: /Interactive Kando Slime Mascot/i })
    expect(mascot).toBeDefined()

    // Speech bubble with Japanese greeting
    expect(screen.getByText(/Kando Slime \(感動スライム\)/i)).toBeDefined()
    expect(screen.getByText(/「やっほー！感動スライムだよ！一緒に日本語を学ぼう！」/i)).toBeDefined()

    // Audio button triggers onSpeak
    const audioBtn = screen.getByRole('button', { name: /Listen to Slime voice/i })
    fireEvent.click(audioBtn)
    expect(handleSpeak).toHaveBeenCalledWith('「やっほー！感動スライムだよ！一緒に日本語を学ぼう！」')
  })

  it('renders study mode with hachimaki headband and kanji book', () => {
    render(<KandoSlime mood="studying" />)

    expect(screen.getByText(/「必勝！漢字も文法も、毎日コツコツ覚えるよ！」/i)).toBeDefined()
    // Book kanji text
    expect(screen.getByText('日')).toBeDefined()
  })

  it('renders celebration mode with star eyes and celebration quote', () => {
    render(<KandoSlime mood="celebrating" />)

    expect(screen.getByText(/「すごい！よくできました！レベルアップ！」/i)).toBeDefined()
    // Confetti emojis
    expect(screen.getByText('✨')).toBeDefined()
    expect(screen.getByText('🌸')).toBeDefined()
    expect(screen.getByText('⭐')).toBeDefined()
    expect(screen.getByText('🎉')).toBeDefined()
  })

  it('handles click / poke squash and fires onMoodChange', () => {
    const handleMoodChange = vi.fn()
    render(<KandoSlime mood="waving" onMoodChange={handleMoodChange} />)

    const mascot = screen.getByRole('button', { name: /Interactive Kando Slime Mascot/i })
    fireEvent.click(mascot)

    // Mode cycles from waving to celebrating
    expect(handleMoodChange).toHaveBeenCalledWith('celebrating')
  })

  it('supports hiding speech bubble for custom hero layouts', () => {
    render(<KandoSlime mood="idle" showSpeech={false} />)

    expect(screen.getByRole('button', { name: /Interactive Kando Slime Mascot/i })).toBeDefined()
    expect(screen.queryByText(/Kando Slime \(感動スライム\)/i)).toBeNull()
  })
})
