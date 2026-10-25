/**
 * Avatar config
 *
 * A user's customizable cartoon avatar is stored as a small JSON recipe
 * ({ style, seed, options }); the frontend renders it with DiceBear.
 * We never store or serve SVG, and every field is validated against a strict
 * allow-list of characters so the recipe can't carry markup or oversized data.
 *
 * Styles are CC0 (lorelei, openPeeps, notionists) except avataaars, which is
 * "free for personal and commercial use" per its author via DiceBear.
 */

import { z } from 'zod';

export const AVATAR_STYLES = ['avataaars', 'openPeeps', 'lorelei', 'notionists'] as const;
export type AvatarStyle = (typeof AVATAR_STYLES)[number];

const OPTION_KEY = /^[A-Za-z][A-Za-z0-9]{0,39}$/;
// enum names ("shirtCrewNeck", "variant01") and 6-digit hex colours ("2c1b18", "transparent")
const OPTION_STRING = /^[A-Za-z0-9]{1,40}$/;
const MAX_OPTIONS = 24;
const MAX_JSON_LENGTH = 1200;

export const avatarConfigSchema = z
  .object({
    style: z.enum(AVATAR_STYLES),
    seed: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, 'seed may only contain letters, numbers, "_" and "-"'),
    options: z
      .record(z.union([z.string().regex(OPTION_STRING), z.number().int().min(0).max(100)]))
      .default({}),
  })
  .strict()
  .superRefine((cfg, ctx) => {
    const keys = Object.keys(cfg.options);
    if (keys.length > MAX_OPTIONS) {
      ctx.addIssue({ code: 'custom', message: `At most ${MAX_OPTIONS} avatar options are allowed` });
    }
    for (const k of keys) {
      if (!OPTION_KEY.test(k)) ctx.addIssue({ code: 'custom', message: `Invalid avatar option name: ${k}` });
    }
    if (JSON.stringify(cfg).length > MAX_JSON_LENGTH) {
      ctx.addIssue({ code: 'custom', message: 'Avatar config is too large' });
    }
  });

export type AvatarConfig = z.infer<typeof avatarConfigSchema>;

/**
 * Reads a stored value (JSON string on MariaDB/TEXT, object on a native JSON column)
 * and returns a valid config or null. Never throws: bad data just means "no avatar config".
 */
export function parseAvatarConfig(raw: unknown): AvatarConfig | null {
  if (raw === null || raw === undefined || raw === '') return null;
  try {
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const parsed = avatarConfigSchema.safeParse(value);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function serializeAvatarConfig(config: AvatarConfig | null): string | null {
  return config === null ? null : JSON.stringify(config);
}
