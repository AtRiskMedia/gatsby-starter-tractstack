import { useEffect } from 'react'
import { navigate } from 'gatsby'

import { useAuthStore } from '../stores/authStore'

const PageNotFound = () => {
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
    navigate(`/`)
  }, [])
  return null
}

export default PageNotFound
