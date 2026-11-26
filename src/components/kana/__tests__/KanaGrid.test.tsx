import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import KanaGrid from '../KanaGrid'

describe('KanaGrid horizontal group & Yōon triplet layout', () => {
  it('groups gojuon rows and yoon triplets into separate horizontal row blocks without splitting triplets', () => {
    const sample = [
      { id: 'h-a', kana: 'あ', romaji: 'a', group: 'gojuon', row: 'a' },
      { id: 'h-i', kana: 'い', romaji: 'i', group: 'gojuon', row: 'a' },
      { id: 'h-kya', kana: 'きゃ', romaji: 'kya', group: 'yoon', row: 'kya' },
      { id: 'h-kyu', kana: 'きゅ', romaji: 'kyu', group: 'yoon', row: 'kya' },
      { id: 'h-kyo', kana: 'きょ', romaji: 'kyo', group: 'yoon', row: 'kya' },
      { id: 'h-gya', kana: 'ぎゃ', romaji: 'gya', group: 'yoon', row: 'gya' },
      { id: 'h-gyu', kana: 'ぎゅ', romaji: 'gyu', group: 'yoon', row: 'gya' },
      { id: 'h-gyo', kana: 'ぎょ', romaji: 'gyo', group: 'yoon', row: 'gya' },
    ]

    render(<KanaGrid kanaList={sample} onSelectKana={vi.fn()} />)

    expect(screen.getByText(/Gojūon/)).toBeDefined()
    expect(screen.getByText(/Yōon/)).toBeDefined()
    expect(screen.getByText('a-row (あ行)')).toBeDefined()

    const kyaRowHeader = screen.getByText('KYA · きゃ行')
    const gyaRowHeader = screen.getByText('GYA · ぎゃ行')
    expect(kyaRowHeader).toBeDefined()
    expect(gyaRowHeader).toBeDefined()

    // Ensure each yoon triplet container holds all 3 cards (kya/kyu/kyo stay together)
    const kyaCardBox = kyaRowHeader.closest('div')?.parentElement
    expect(kyaCardBox?.textContent).toContain('きゃ')
    expect(kyaCardBox?.textContent).toContain('きゅ')
    expect(kyaCardBox?.textContent).toContain('きょ')
    expect(kyaCardBox?.textContent).not.toContain('ぎゃ')
  })
})
