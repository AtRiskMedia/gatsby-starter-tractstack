// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { navigate } from 'gatsby'

import Seo from '../components/Seo'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'

const IndexPage = () => {
  const referrer = useAuthStore((state) => state.referrer)
  const setReferrer = useAuthStore((state) => state.setReferrer)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const utmSource = params.get(`utm_source`)
    const utmMedium = params.get(`utm_medium`)
    const utmCampaign = params.get(`utm_campaign`)
    const utmTerm = params.get(`utm_term`)
    const utmContent = params.get(`utm_content`)
    if (
      typeof referrer.init === `undefined` &&
      (document?.referrer ||
        utmSource ||
        utmMedium ||
        utmCampaign ||
        utmTerm ||
        utmContent)
    ) {
      setReferrer({
        init: true,
        httpReferrer: document.referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      })
    }
  }, [referrer, setReferrer])

  useEffect(() => {
    const thisViewport =
      window.innerWidth < 801
        ? `600`
        : window.innerWidth < 1367
        ? `1080`
        : `1920`
    navigate(`/${config.home}/${thisViewport}`, { replace: true })
  }, [])
  return null
}

export const Head = () => <Seo />

export default IndexPage
