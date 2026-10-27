import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../LoginPage'
import { useAuthStore } from '../../../store/authStore'

const signIn = vi.fn().mockResolvedValue(undefined)
const signInWithGoogle = vi.fn()

const renderPage = () => render(<MemoryRouter><LoginPage /></MemoryRouter>)

beforeEach(() => {
  signIn.mockClear()
  signInWithGoogle.mockClear()
  useAuthStore.setState({ signIn, signInWithGoogle } as any)
})
afterEach(() => {
  vi.unstubAllEnvs()
  cleanup()
})

describe('LoginPage — no credentials, no bypass', () => {
  it('never shows an account email or password on the page', () => {
    renderPage()
    expect(document.body.textContent).not.toMatch(/Active Account/i)
    expect(document.body.textContent).not.toMatch(/Password:\s*\S+/)
    expect(document.body.textContent).not.toMatch(/@gmail\.com/i)
  })

  it('has no one-click demo login unless a developer configured one locally', () => {
    renderPage()
    expect(screen.queryByText(/demo sign-in/i)).toBeNull()
    expect(screen.queryByText(/Instant Demo/i)).toBeNull()
  })

  it('a dev demo button appears only when both VITE_DEV_DEMO_* values are set, and uses exactly those values', async () => {
    vi.stubEnv('VITE_DEV_DEMO_EMAIL', 'dev@example.com')
    vi.stubEnv('VITE_DEV_DEMO_PASSWORD', 'local-only-secret')
    renderPage()
    fireEvent.click(screen.getByText(/Dev demo sign-in/i))
    await waitFor(() => expect(signIn).toHaveBeenCalledWith({ email: 'dev@example.com', password: 'local-only-secret' }))
  })

  it('"Continue with Google" starts the real Google OAuth flow — it must never sign anyone in directly', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }))
    expect(signInWithGoogle).toHaveBeenCalledTimes(1)
    expect(signIn).not.toHaveBeenCalled()
  })

  it('normal sign-in sends exactly what the user typed', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText(/your@email\.com/i), { target: { value: 'me@example.com' } })
    const password = document.querySelector('input[type="password"]') as HTMLInputElement
    fireEvent.change(password, { target: { value: 'hunter2hunter2' } })
    fireEvent.click(screen.getByRole('button', { name: /^Sign In$/i }))
    await waitFor(() => expect(signIn).toHaveBeenCalledWith(expect.objectContaining({ email: 'me@example.com', password: 'hunter2hunter2' })))
  })
})
