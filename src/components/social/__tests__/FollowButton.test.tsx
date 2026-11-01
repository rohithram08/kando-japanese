import '@testing-library/jest-dom/vitest'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const follow = vi.fn()
const unfollow = vi.fn()
vi.mock('../../../api/social', () => ({
  followUser: (...a: unknown[]) => follow(...a),
  unfollowUser: (...a: unknown[]) => unfollow(...a),
}))
const toastError = vi.fn()
vi.mock('react-hot-toast', () => ({ default: { error: (...a: unknown[]) => toastError(...a), success: vi.fn() } }))

import FollowButton from '../FollowButton'

describe('FollowButton', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('follows optimistically and reports the server result', async () => {
    follow.mockResolvedValue({ isFollowing: true, followers: 4, following: 1 })
    const onChange = vi.fn()
    render(<FollowButton userId="u1" username="Sakura" onChange={onChange} />)
    const btn = screen.getByRole('button', { name: /follow sakura/i })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    fireEvent.click(btn)
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true'))
    expect(follow).toHaveBeenCalledWith('u1')
    expect(onChange).toHaveBeenCalledWith({ isFollowing: true, followers: 4, following: 1 })
  })

  it('unfollows when already following', async () => {
    unfollow.mockResolvedValue({ isFollowing: false, followers: 0, following: 0 })
    render(<FollowButton userId="u1" username="Sakura" initialFollowing />)
    fireEvent.click(screen.getByRole('button', { name: /unfollow sakura/i }))
    await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false'))
    expect(unfollow).toHaveBeenCalledWith('u1')
  })

  it('rolls back and tells the user when the request fails', async () => {
    follow.mockRejectedValue(new Error('boom'))
    render(<FollowButton userId="u1" username="Sakura" />)
    fireEvent.click(screen.getByRole('button'))
    await waitFor(() => expect(toastError).toHaveBeenCalledWith('boom'))
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('ignores extra clicks while a request is in flight (no double follow)', async () => {
    let resolve!: (v: unknown) => void
    follow.mockReturnValue(new Promise((r) => { resolve = r }))
    render(<FollowButton userId="u1" username="Sakura" />)
    const btn = screen.getByRole('button')
    fireEvent.click(btn); fireEvent.click(btn); fireEvent.click(btn)
    expect(follow).toHaveBeenCalledTimes(1)
    resolve({ isFollowing: true, followers: 1, following: 0 })
    await waitFor(() => expect(screen.getByRole('button')).not.toBeDisabled())
  })
})
