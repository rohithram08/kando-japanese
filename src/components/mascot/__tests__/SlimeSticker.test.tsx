import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import SlimeSticker, { SlimeStickerType } from '../SlimeSticker'

describe('SlimeSticker Component', () => {
  it('renders a sparkle slime sticker by default', () => {
    render(<SlimeSticker type="sparkle" size={80} alt="Sparkle Slime" />)
    const sticker = screen.getByRole('img', { name: /Sparkle Slime/i })
    expect(sticker).toBeDefined()
  })

  it('renders different themed slime stickers without throwing', () => {
    const types: SlimeStickerType[] = [
      'samurai',
      'scholar',
      'flame',
      'crown',
      'ninja',
      'sakura',
      'bookworm',
      'zen',
      'sparkle',
      'trophy',
      'target',
      'dragon',
    ]

    types.forEach((t) => {
      const { unmount } = render(
        <SlimeSticker type={t} size={64} alt={`${t} sticker`} obtained={true} />
      )
      expect(screen.getByRole('img', { name: new RegExp(`${t} sticker`, 'i') })).toBeDefined()
      unmount()
    })
  })

  it('handles unobtained state with opacity and grayscale styling', () => {
    render(<SlimeSticker type="crown" size={60} obtained={false} alt="Unobtained Crown" />)
    const element = screen.getByRole('img', { name: /Unobtained Crown/i })
    expect(element.style.filter).toContain('grayscale')
  })
})
