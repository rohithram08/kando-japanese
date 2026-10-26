import { describe, it, expect, vi, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import SenseiMobileDock from '../SenseiMobileDock'

// The mascot is decorative here (and heavy) — stub it
vi.mock('../../mascot/KandoSlime', () => ({ default: () => <span data-testid="slime" /> }))

afterEach(() => cleanup())

const base = {
  latestAssistantMessage: { id: 'a1', role: 'assistant', content: 'は marks the **topic**.' },
  latestUserMessage: { id: 'u1', role: 'user', content: 'What is は?' },
  quickPrompts: ['Teach me は vs が', 'How do I remember kanji?'],
  userName: 'rohith_ram',
  userLevel: 6,
}

describe('SenseiMobileDock — the phone chat for the 3D Sensei stage', () => {
  it('shows Hana-sensei\'s latest reply, the learner\'s last question and who is who', () => {
    render(<SenseiMobileDock {...base} />)
    expect(screen.getByTestId('sensei-dock-message').textContent).toMatch(/marks the topic/)
    expect(screen.getByText(/What is は\?/)).toBeDefined()
    expect(screen.getByText(/rohith_ram/)).toBeDefined()
    expect(screen.getByTestId('slime')).toBeDefined()
  })

  it('falls back to a welcome message before the first reply', () => {
    render(<SenseiMobileDock {...base} latestAssistantMessage={null} latestUserMessage={null} />)
    expect(screen.getByTestId('sensei-dock-message').textContent).toMatch(/I am Hana-sensei/)
  })

  it('lets the learner type and send (this was impossible on phones before)', () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    const onInputChange = vi.fn()
    const { rerender } = render(<SenseiMobileDock {...base} input="" onInputChange={onInputChange} onSubmit={onSubmit} />)
    const input = screen.getByTestId('sensei-dock-input') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'こんにちは' } })
    expect(onInputChange).toHaveBeenCalledWith('こんにちは')

    // send is disabled until there is text
    expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true)
    rerender(<SenseiMobileDock {...base} input="こんにちは" onInputChange={onInputChange} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('quick prompts send immediately; they hide while Hana is thinking', () => {
    const onSend = vi.fn()
    const { rerender } = render(<SenseiMobileDock {...base} onSend={onSend} />)
    fireEvent.click(screen.getByText('Teach me は vs が'))
    expect(onSend).toHaveBeenCalledWith('Teach me は vs が')
    rerender(<SenseiMobileDock {...base} onSend={onSend} isTyping />)
    expect(screen.queryByText('Teach me は vs が')).toBeNull()
    expect((screen.getByTestId('sensei-dock-input') as HTMLInputElement).disabled).toBe(true)
  })

  it('offers Replay, and Stop while speaking', () => {
    const onReplayAudio = vi.fn()
    const onStopAudio = vi.fn()
    const { rerender } = render(<SenseiMobileDock {...base} onReplayAudio={onReplayAudio} onStopAudio={onStopAudio} />)
    fireEvent.click(screen.getByRole('button', { name: 'Replay voice' }))
    expect(onReplayAudio).toHaveBeenCalledWith('は marks the **topic**.')
    rerender(<SenseiMobileDock {...base} isSpeaking onReplayAudio={onReplayAudio} onStopAudio={onStopAudio} />)
    fireEvent.click(screen.getByRole('button', { name: /Stop Hana-sensei speaking/ }))
    expect(onStopAudio).toHaveBeenCalled()
  })

  it('can be collapsed to just the input row to give the 3D stage more room', () => {
    render(<SenseiMobileDock {...base} />)
    fireEvent.click(screen.getByRole('button', { name: 'Collapse chat' }))
    expect(screen.queryByTestId('sensei-dock-message')).toBeNull()
    expect(screen.getByTestId('sensei-dock-input')).toBeDefined()
    fireEvent.click(screen.getByRole('button', { name: 'Expand chat' }))
    expect(screen.getByTestId('sensei-dock-message')).toBeDefined()
  })

  it('shows the mic only when speech recognition is supported', () => {
    const { rerender } = render(<SenseiMobileDock {...base} isSttSupported={false} onToggleMic={() => {}} />)
    expect(screen.queryByRole('button', { name: 'Speak to Sensei' })).toBeNull()
    rerender(<SenseiMobileDock {...base} isSttSupported onToggleMic={() => {}} />)
    expect(screen.getByRole('button', { name: 'Speak to Sensei' })).toBeDefined()
  })

  it('opens the language keyboard', () => {
    render(<SenseiMobileDock {...base} keyboardLanguage="ta" />)
    fireEvent.click(screen.getByRole('button', { name: 'Open language keyboard' }))
    expect(screen.getByRole('button', { name: 'Hide language keyboard' })).toBeDefined()
  })
})
