// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { navigate, graphql } from 'gatsby'

import Seo from '../components/Seo'
import { ICollectionsRouteProps } from '../types'

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
