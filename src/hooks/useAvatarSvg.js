// src/hooks/useAvatarSvg.js
// Renders an avatar config to an SVG data URI, loading DiceBear on first use only.
import { useEffect, useState } from 'react'
import { normalizeAvatarConfig } from '../utils/avatarConfig'

export function useAvatarSvg(rawConfig) {
  const config = normalizeAvatarConfig(rawConfig)
  const key = config ? JSON.stringify(config) : null
  const [uri, setUri] = useState(null)

  useEffect(() => {
    if (!key) { setUri(null); return undefined }
    let alive = true
    import('../utils/avatarRenderer')
      .then((m) => m.renderAvatarDataUriAsync(JSON.parse(key)))
      .then((u) => { if (alive) setUri(u) })
      .catch(() => { if (alive) setUri(null) })
    return () => { alive = false }
  }, [key])

  return key ? uri : null
}
