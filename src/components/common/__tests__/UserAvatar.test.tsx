import { describe, it, expect, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import UserAvatar from '../UserAvatar'

afterEach(() => cleanup())

describe('UserAvatar', () => {
  it('shows the preset emoji from a camelCase profile', () => {
    render(<UserAvatar profile={{ username: 'rohith', avatarId: 'avatar-1' }} />)
    expect(screen.getByRole('img').textContent).toBe('🥷')
  })

  it('shows the initial when there is no avatar', () => {
    render(<UserAvatar profile={{ username: 'rohith' }} />)
    expect(screen.getByRole('img').textContent).toBe('R')
  })

  it('serves uploaded photos through the API base so they actually load', () => {
    const { container } = render(<UserAvatar avatarUrl="/storage/avatars/u1/a.png" username="rohith" />)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/api/storage/avatars/u1/a.png')
  })

  it('never shows a broken image / alt text: a failing photo falls back to the preset or initial', () => {
    const { container } = render(<UserAvatar avatarUrl="/storage/avatars/u1/gone.png" avatarId="avatar-3" username="rohith" />)
    const img = container.querySelector('img') as HTMLImageElement
    expect(img.getAttribute('alt')).toBe('') // no "Profile" alt text can ever be painted
    fireEvent.error(img)
    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByRole('img').textContent).toBe('🌸')
  })

  it('falls back to the initial when a failing photo has no preset', () => {
    const { container } = render(<UserAvatar avatarUrl="/storage/avatars/u1/gone.png" username="rohith" />)
    fireEvent.error(container.querySelector('img') as HTMLImageElement)
    expect(screen.getByRole('img').textContent).toBe('R')
  })

  it('shows an in-flight upload preview first and recovers when the source changes', () => {
    const { container, rerender } = render(<UserAvatar avatarUrl="/storage/avatars/u1/a.png" username="r" previewSrc="data:image/png;base64,AAA" />)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('data:image/png;base64,AAA')
    rerender(<UserAvatar avatarUrl="/storage/avatars/u1/b.png" username="r" />)
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/api/storage/avatars/u1/b.png')
  })
})
