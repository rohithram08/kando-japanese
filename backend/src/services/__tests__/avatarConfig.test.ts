import { describe, it, expect } from 'vitest';
import { avatarConfigSchema, parseAvatarConfig, serializeAvatarConfig } from '../avatarConfig.js';
import { serializeProfile } from '../userSerializer.js';

const ok = { style: 'avataaars', seed: 'kando-42', options: { top: 'hat', hairColor: '2c1b18', topProbability: 100 } };

describe('avatarConfigSchema', () => {
  it('accepts a normal recipe', () => {
    expect(avatarConfigSchema.safeParse(ok).success).toBe(true);
    expect(avatarConfigSchema.safeParse({ style: 'lorelei', seed: 'x' }).success).toBe(true); // options default {}
  });

  it('rejects unknown styles and unknown top-level keys', () => {
    expect(avatarConfigSchema.safeParse({ ...ok, style: 'bottts' }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, svg: '<svg/>' }).success).toBe(false);
  });

  it('rejects markup, path tricks and odd characters in seed / option names / values', () => {
    expect(avatarConfigSchema.safeParse({ ...ok, seed: '<script>' }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, seed: 'a'.repeat(65) }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, options: { 'a b': 'x' } }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, options: { top: '"><img src=x>' } }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, options: { top: '../../etc' } }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, options: { topProbability: 101 } }).success).toBe(false);
    expect(avatarConfigSchema.safeParse({ ...ok, options: { x: { nested: 1 } } }).success).toBe(false);
  });

  it('caps the number of options', () => {
    const many = Object.fromEntries(Array.from({ length: 25 }, (_, i) => [`opt${i}`, 'a']));
    expect(avatarConfigSchema.safeParse({ ...ok, options: many }).success).toBe(false);
  });
});

describe('parseAvatarConfig / serializeAvatarConfig', () => {
  it('round-trips and tolerates JSON strings (TEXT column) and objects (native JSON column)', () => {
    const text = serializeAvatarConfig(ok as never);
    expect(parseAvatarConfig(text)).toEqual(ok);
    expect(parseAvatarConfig(ok)).toEqual(ok);
  });

  it('returns null (never throws) for null, garbage or invalid stored data', () => {
    expect(parseAvatarConfig(null)).toBeNull();
    expect(parseAvatarConfig('')).toBeNull();
    expect(parseAvatarConfig('{not json')).toBeNull();
    expect(parseAvatarConfig('{"style":"nope","seed":"x"}')).toBeNull();
    expect(serializeAvatarConfig(null)).toBeNull();
  });
});

describe('serializeProfile', () => {
  it('drops passwordHash and parses avatarConfig', () => {
    const out = serializeProfile({ id: 'u', username: 'n', passwordHash: 'secret', avatarConfig: JSON.stringify(ok) });
    expect(out).not.toHaveProperty('passwordHash');
    expect(out.avatarConfig).toEqual(ok);
    expect(serializeProfile({ id: 'u', avatarConfig: null }).avatarConfig).toBeNull();
  });
});
