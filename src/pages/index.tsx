// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { navigate } from 'gatsby'

import Seo from '../components/Seo'
import { config } from '../../data/SiteConfig'

const IndexPage = () => {
  useEffect(() => {
    const thisViewport =
      window.innerWidth < 801
        ? `600`
        : window.innerWidth < 1367
        ? `1080`
        : `1920`
    navigate(`/${config.home}/${thisViewport}`)
  }, [])
  return null
}

export const Head = () => <Seo />

export default IndexPage
