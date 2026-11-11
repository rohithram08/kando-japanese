// src/components/common/SEO.jsx
import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'

const SITE_NAME = 'Kando Japanese'
const SITE_URL = 'https://kandojapanese.vercel.app'
const DEFAULT_IMAGE = `${SITE_URL}/images/og-cover.png`

function HelmetMeta({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noindex = false,
  children,
}) {
  const fullTitle = title
    ? title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`
    : `${SITE_NAME} (感動) - Learn Japanese & JLPT Mastery`

  const canonicalUrl = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={image} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {children}
    </Helmet>
  )
}

/**
 * Standardized SEO Helmet component
 * Provides title, meta descriptions, Open Graph, Twitter cards, and canonical links.
 * Wrapped in a local HelmetProvider fallback so tests and standalone components
 * never crash when rendered outside the root HelmetProvider.
 */
export default function SEO(props) {
  return (
    <HelmetProvider>
      <HelmetMeta {...props} />
    </HelmetProvider>
  )
}
