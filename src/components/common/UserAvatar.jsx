// src/components/common/UserAvatar.jsx
// ─────────────────────────────────────────────────────────────────────────────
// The only avatar renderer in the app. Handles uploaded photos, preset emoji and
// the initial-letter fallback, and — unlike a bare <img> — never shows a broken
// image icon / alt text: if the photo fails to load it falls back automatically.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react'
import { getAvatarDescriptor, normalizeProfile } from '../../utils/userIdentity'

const SIZES = {
  xs: { box: 'w-6 h-6', text: 'text-xs' },
  sm: { box: 'w-8 h-8', text: 'text-base' },
  md: { box: 'w-10 h-10', text: 'text-xl' },
  lg: { box: 'w-16 h-16', text: 'text-3xl' },
  xl: { box: 'w-24 h-24', text: 'text-5xl' },
  '2xl': { box: 'w-28 h-28', text: 'text-6xl' },
}

export default function UserAvatar({
  profile,
  avatarUrl,
  avatarId,
  username,
  previewSrc = null, // a local blob/data URL shown while an upload is in flight
  size = 'md',
  rounded = 'rounded-xl',
  className = '',
  label,
}) {
  const normalized = profile ? normalizeProfile(profile) : null
  const descriptor = previewSrc
    ? { type: 'image', src: previewSrc }
    : getAvatarDescriptor({
        avatarUrl: avatarUrl !== undefined ? avatarUrl : normalized?.avatarUrl,
        avatarId: avatarId !== undefined ? avatarId : normalized?.avatarId,
        username: username !== undefined ? username : normalized?.username,
      })

  const [failedSrc, setFailedSrc] = useState(null)
  const currentSrc = descriptor.type === 'image' ? descriptor.src : null
  useEffect(() => setFailedSrc(null), [currentSrc])

  const dim = SIZES[size] || SIZES.md
  const showImage = descriptor.type === 'image' && failedSrc !== descriptor.src

  // Image failed → fall back to preset/initial instead of a broken-image icon
  const effective = showImage
    ? descriptor
    : descriptor.type === 'image'
      ? getAvatarDescriptor({
          avatarId: avatarId !== undefined ? avatarId : normalized?.avatarId,
          username: username !== undefined ? username : normalized?.username,
        })
      : descriptor

  const base = `${dim.box} ${rounded} overflow-hidden shrink-0 select-none ${className}`

  if (effective.type === 'image') {
    return (
      <span className={`${base} inline-flex bg-muted`} role="img" aria-label={label || 'Avatar'}>
        <img
          src={effective.src}
          alt=""
          draggable={false}
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(effective.src)}
        />
      </span>
    )
  }

  if (effective.type === 'emoji') {
    return (
      <span
        className={`${base} inline-flex items-center justify-center ${dim.text} bg-gradient-to-br ${effective.bg}`}
        role="img"
        aria-label={label || effective.label || 'Avatar'}
      >
        {effective.emoji}
      </span>
    )
  }

  return (
    <span
      className={`${base} inline-flex items-center justify-center ${dim.text} font-bold text-white bg-gradient-to-br from-rose-500 to-pink-600`}
      role="img"
      aria-label={label || 'Avatar'}
    >
      {effective.letter}
    </span>
  )
}
