import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LevelSelector from '../LevelSelector'

describe('LevelSelector', () => {
  it('renders only the levels it is given, with no counts for hidden ones', () => {
    render(
      <LevelSelector
        selected="N4"
        onChange={() => {}}
        levels={['N5', 'N4']}
        counts={{ N5: 585, N4: 700, N3: 1682, N2: 999, N1: 888 }}
      />,
    )
    expect(screen.getByText('N5')).toBeDefined()
    expect(screen.getByText('N4')).toBeDefined()
    expect(screen.queryByText('N3')).toBeNull()
    expect(screen.queryByText('1682')).toBeNull()
    expect(screen.queryByText('888')).toBeNull()
  })

  it('renders nothing when there is a single level to choose', () => {
    const { container } = render(<LevelSelector selected="N5" onChange={() => {}} levels={['N5']} />)
    expect(container.firstChild).toBeNull()
  })

  it('still shows all five levels when no `levels` prop is passed (backwards compatible)', () => {
    render(<LevelSelector selected="N5" onChange={() => {}} />)
    for (const l of ['N5', 'N4', 'N3', 'N2', 'N1']) expect(screen.getByText(l)).toBeDefined()
  })

  it('calls onChange with the clicked level', () => {
    const onChange = vi.fn()
    render(<LevelSelector selected="N5" onChange={onChange} levels={['N5', 'N4']} />)
    fireEvent.click(screen.getByText('N4'))
    expect(onChange).toHaveBeenCalledWith('N4')
  })
})
