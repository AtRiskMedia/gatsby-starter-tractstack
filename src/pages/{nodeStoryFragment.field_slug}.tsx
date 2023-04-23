// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { navigate, graphql } from 'gatsby'

import Seo from '../components/Seo'
import { ICollectionsRouteProps } from '../types'
import { useAuthStore } from '../stores/authStore'

export const query = graphql`
  query ($id: String) {
    nodeStoryFragment(id: { eq: $id }) {
      title
      field_slug
      field_social_image_path
      relationships {
        field_tract_stack {
          field_social_image_path
        }
      }
    }
  }
`

const StoryFragmentRedirect = ({ data }: ICollectionsRouteProps) => {
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
    if (typeof window !== `undefined`) {
      const thisViewport =
        window.innerWidth < 801
          ? `600`
          : window.innerWidth < 1367
          ? `1080`
          : `1920`
      navigate(`/${data.nodeStoryFragment.field_slug}/${thisViewport}`)
    }
  }, [data.nodeStoryFragment.field_slug])

  return null
}

export const Head = ({ data }: ICollectionsRouteProps) => (
  <Seo title={data.nodeStoryFragment.title} />
)

export default StoryFragmentRedirect
