import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AvatarCreator from '../AvatarCreator'
import UserAvatar from '../../common/UserAvatar'
import { normalizeAvatarConfig } from '../../../utils/avatarConfig'

const cfg = { style: 'avataaars', seed: 'seed-1', options: {} }

const ready = () => waitFor(() => expect(screen.getByRole('tabpanel').querySelector('button')).not.toBeNull())

describe('AvatarCreator', () => {
  it('saves a valid recipe reflecting the picks the user made', async () => {
    const onSave = vi.fn()
    render(<AvatarCreator initialConfig={cfg} onSave={onSave} onClose={() => {}} />)
    await ready()

    // Pick the first hair tile (tiles are labelled with the humanised option name)
    const hairPanel = screen.getByRole('tabpanel')
    const firstTile = hairPanel.querySelector('button[aria-pressed]') as HTMLButtonElement
    fireEvent.click(firstTile)
    expect(firstTile.getAttribute('aria-pressed')).toBe('true')

    fireEvent.click(screen.getByText('Save avatar'))
    expect(onSave).toHaveBeenCalledTimes(1)
    const saved = onSave.mock.calls[0][0]
    expect(normalizeAvatarConfig(saved)).not.toBeNull()
    expect(saved.style).toBe('avataaars')
    expect(Object.keys(saved.options).length).toBeGreaterThan(0)
  })

  it('switching style starts from that style\'s own options and keeps the seed', async () => {
    const onSave = vi.fn()
    render(<AvatarCreator initialConfig={{ ...cfg, options: { top: 'hat', topProbability: 100 } }} onSave={onSave} onClose={() => {}} />)
    await ready()
    fireEvent.click(screen.getByText('Lorelei'))
    await ready()
    fireEvent.click(screen.getByText('Save avatar'))
    expect(onSave.mock.calls[0][0]).toEqual({ style: 'lorelei', seed: 'seed-1', options: {} })
  })

  it('"None" on an optional feature records probability 0', async () => {
    const onSave = vi.fn()
    render(<AvatarCreator initialConfig={cfg} onSave={onSave} onClose={() => {}} />)
    await ready()
    fireEvent.click(screen.getByRole('tab', { name: 'Glasses' }))
    fireEvent.click(screen.getByRole('button', { name: 'None' }))
    fireEvent.click(screen.getByText('Save avatar'))
    expect(onSave.mock.calls[0][0].options).toMatchObject({ accessoriesProbability: 0 })
  })

  it('Escape closes, unless a save is in flight', () => {
    const onClose = vi.fn()
    const { rerender } = render(<AvatarCreator initialConfig={cfg} onSave={() => {}} onClose={onClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
    rerender(<AvatarCreator initialConfig={cfg} onSave={() => {}} onClose={onClose} saving />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('UserAvatar with a cartoon recipe', () => {
  const svgImg = (c: HTMLElement) => c.querySelector('img[src^="data:image/svg+xml"]')

  it('renders the cartoon (lazy-loading DiceBear) and prefers it over the initial', async () => {
    const { container } = render(<UserAvatar avatarConfig={cfg} username="Rohith" />)
    await waitFor(() => expect(svgImg(container)).not.toBeNull())
  })

  it('shows the in-flight upload preview ahead of the cartoon', async () => {
    const { container } = render(<UserAvatar avatarConfig={cfg} previewSrc="data:image/png;base64,AAAA" username="R" />)
    expect(container.querySelector('img[src^="data:image/png"]')).not.toBeNull()
    expect(svgImg(container)).toBeNull()
  })

  it('falls back to the initial for a missing or invalid recipe (never a broken image)', () => {
    const { container, rerender } = render(<UserAvatar avatarConfig={null} username="Rohith" />)
    expect(container.textContent).toBe('R')
    rerender(<UserAvatar avatarConfig={{ style: 'nope', seed: 'x' }} username="Rohith" />)
    expect(container.textContent).toBe('R')
    expect(container.querySelector('img')).toBeNull()
  })

  it('reads the recipe from a profile object too', async () => {
    const { container } = render(<UserAvatar profile={{ id: 'u', username: 'Rohith', avatarConfig: cfg }} />)
    await waitFor(() => expect(svgImg(container)).not.toBeNull())
  })
})
