// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { IContextPageProps } from '@tractstack/types'

import Wrapper from '../components/Wrapper'
import StoryFragment from '../components/StoryFragment'
import Header from '../components/Header'
import { config } from '../../data/SiteConfig'

export default function StoryFragmentPage(props: IContextPageProps) {
  const isHome = props.pageContext.storyFragment.slug === config.home
  const storyFragmentId = props.pageContext.storyFragment.id
  const storyFragmentTitle = props.pageContext.storyFragment.title
  const storyFragmentSlug = props.pageContext.storyFragment.slug
  const tractStackId =
    props.pageContext.storyFragment.relationships.tractstack.id
  const tractStackTitle =
    props.pageContext.storyFragment.relationships.tractstack.title
  const tractStackSlug =
    props.pageContext.storyFragment.relationships.tractstack.slug
  const menu = props.pageContext.storyFragment.relationships?.menu

  return (
    <Wrapper slug={props.pageContext.storyFragment.slug} mode="storyFragment">
      <Header
        isHome={isHome}
        siteTitle={storyFragmentTitle}
        open={false}
        menu={menu}
      />
      <StoryFragment
        payload={{
          storyFragment: props.pageContext.storyFragment,
          resources: props.pageContext.resources?.edges,
          contextPanesMap:
            props.pageContext.storyFragment.relationships.contextPanes,
          id: {
            id: storyFragmentId,
            title: storyFragmentTitle,
            slug: storyFragmentSlug,
            tractStackId,
            tractStackTitle,
            tractStackSlug,
          },
        }}
      />
    </Wrapper>
  )
}
