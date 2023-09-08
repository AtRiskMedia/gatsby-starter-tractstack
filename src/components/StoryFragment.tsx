// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import '../styles/storyfragment.css'
import { IStoryFragmentProps } from 'gatsby-plugin-tractstack/types'
import StoryFragmentLive from '../components/StoryFragmentLive'
import Belief from '../components/Belief'
import YouTube from '../components/YouTube'
import templates from '../custom/templates'
import storyFragmentCompositor from '../components/storyFragmentCompositor'

const StoryFragment = ({ payload }: IStoryFragmentProps) => {
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const setScrollToPane = useStoryStepStore((state) => state.setScrollToPane)
  const processRead = useStoryStepStore((state) => state.processRead)
  const storyFragmentPayload = storyFragmentCompositor({
    data: payload.storyFragment,
    viewportKey,
    hooks: {
      belief: Belief,
      youtube: YouTube,
      processRead,
      GatsbyImage: () => {}, // will remove this and use image url
      getImage: () => {}, // will remove this and use image url
      resourcePayload: payload.resources,
      templates,
      setScrollToPane,
    },
  })

  return <StoryFragmentLive payload={storyFragmentPayload} />
}

export default StoryFragment
