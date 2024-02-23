// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { config } from '../../data/SiteConfig'

interface Meta {
  description?: string
  title?: string
  socialImagePath?: string
}

function Seo({ description, title, socialImagePath }: Meta) {
  const metaDescription = description || config.slogan
  const defaultTitle = config.title
  const image =
    typeof socialImagePath === `string`
      ? `${config.siteUrl}${socialImagePath}`
      : `${config.siteUrl}og.png`
  const url = config.siteUrl

  return (
    <>
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="image" content={image} />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:creator" content={config.author} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
    </>
  )
}

export default Seo
