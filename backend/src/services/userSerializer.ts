import { parseAvatarConfig, type AvatarConfig } from './avatarConfig.js';

/** Public shape of a user row: no password hash, avatarConfig parsed into an object. */
export function serializeProfile<T extends { passwordHash?: unknown; avatarConfig?: unknown }>(
  user: T,
): Omit<T, 'passwordHash' | 'avatarConfig'> & { avatarConfig: AvatarConfig | null } {
  const { passwordHash: _omit, avatarConfig, ...rest } = user;
  return { ...rest, avatarConfig: parseAvatarConfig(avatarConfig) };
}
