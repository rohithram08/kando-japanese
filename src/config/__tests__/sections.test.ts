import { describe, it, expect } from 'vitest'
import { SECTIONS, getSection, getSectionByPath, sectionsByGroup } from '../sections'

describe('Navigation Sections Configuration', () => {
  it('includes the unified conversation section', () => {
    const section = SECTIONS.find((s) => s.id === 'conversation')
    expect(section).toBeDefined()
    expect(section?.path).toBe('/conversation')
    expect(section?.label).toBe('Conversation Practice')
    expect(section?.group).toBe('practice')
  })

  it('resolves legacy chat and chat-dojo IDs to conversation section for backward compatibility', () => {
    const fromChat = getSection('chat')
    const fromDojo = getSection('chat-dojo')
    const fromConv = getSection('conversation')

    expect(fromChat).toBeDefined()
    expect(fromChat?.id).toBe('conversation')
    expect(fromDojo?.id).toBe('conversation')
    expect(fromConv?.id).toBe('conversation')
  })

  it('matches /conversation via getSectionByPath', () => {
    const section = getSectionByPath('/conversation')
    expect(section).toBeDefined()
    expect(section?.id).toBe('conversation')
  })

  it('groups conversation section under practice group', () => {
    const practiceSections = sectionsByGroup('practice')
    const hasConversation = practiceSections.some((s) => s.id === 'conversation')
    expect(hasConversation).toBe(true)

    // Legacy individual sections should no longer be duplicate items in the list
    const hasLegacyChat = practiceSections.some((s) => s.id === 'chat')
    const hasLegacyDojo = practiceSections.some((s) => s.id === 'chat-dojo')
    expect(hasLegacyChat).toBe(false)
    expect(hasLegacyDojo).toBe(false)
  })

  it('includes the my_profile section under journey group and resolves legacy profile ID', () => {
    const section = SECTIONS.find((s) => s.id === 'my_profile')
    expect(section).toBeDefined()
    expect(section?.path).toBe('/profile')
    expect(section?.group).toBe('journey')

    const fromProfile = getSection('profile')
    const fromMyProfile = getSection('my_profile')
    expect(fromProfile).toBeDefined()
    expect(fromProfile?.id).toBe('my_profile')
    expect(fromMyProfile?.id).toBe('my_profile')
  })

  it('matches /profile via getSectionByPath', () => {
    const section = getSectionByPath('/profile')
    expect(section).toBeDefined()
    expect(section?.id).toBe('my_profile')
  })
})
