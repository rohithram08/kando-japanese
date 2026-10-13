import { describe, it, expect } from 'vitest'
import {
  DUO_SPRINGS,
  HEADLINE_CONTAINER,
  HEADLINE_ITEM,
  FADE_UP_SPRING,
  HEADER_CTA_SLIDE,
} from '../animations'

describe('Animation Tokens & Spring Constants', () => {
  it('provides well-formed spring configurations for Duolingo bounce', () => {
    expect(DUO_SPRINGS.button).toBeDefined()
    expect(DUO_SPRINGS.button.stiffness).toBeGreaterThan(300)
    expect(DUO_SPRINGS.pop).toBeDefined()
    expect(DUO_SPRINGS.gentle).toBeDefined()
  })

  it('provides staggered entrance variants for hero headline', () => {
    expect(HEADLINE_CONTAINER.visible.transition.staggerChildren).toBe(0.08)
    expect(HEADLINE_ITEM.hidden.opacity).toBe(0)
    expect(HEADLINE_ITEM.visible.opacity).toBe(1)
  })

  it('provides header CTA slide transitions', () => {
    expect(HEADER_CTA_SLIDE.hidden.opacity).toBe(0)
    expect(HEADER_CTA_SLIDE.visible.opacity).toBe(1)
    expect(FADE_UP_SPRING.visible.opacity).toBe(1)
  })
})
