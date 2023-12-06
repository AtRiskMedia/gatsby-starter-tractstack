// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import '../styles/storyfragment.css'
import { IStoryFragmentRaw } from '../types'
import StoryFragmentLive from '../components/StoryFragmentLive'
import Belief from '../components/Belief'
import YouTube from '../components/YouTube'
import Toggle from './ToggleBelief'
import templates from '../custom/templates'
import storyFragmentCompositor from '../components/storyFragmentCompositor'

const StoryFragment = ({ payload }: IStoryFragmentRaw) => {
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const setScrollToPane = useStoryStepStore((state) => state.setScrollToPane)
  const processRead = useStoryStepStore((state) => state.processRead)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)
  const entered = useStoryStepStore((state) => state.entered)
  const setEntered = useStoryStepStore((state) => state.setEntered)
  const storyFragmentPayload = storyFragmentCompositor({
    data: payload.storyFragment,
    viewportKey,
    hooks: {
      belief: Belief,
      youtube: YouTube,
      toggle: Toggle,
      processRead,
      pushEvent,
      resourcePayload: payload.resources,
      templates,
      setScrollToPane,
    },
  })

  useEffect(() => {
    if (!entered) {
      setEntered(true)
      setTimeout(
        () =>
          pushEvent(
            {
              id: payload.storyFragment.id,
              title: payload.storyFragment.title,
              type: `StoryFragment`,
              verb: `ENTERED`,
            },
            payload.id,
          ),
        1000,
      )
    }
  }, [
    entered,
    setEntered,
    payload.id,
    payload.storyFragment.id,
    payload.storyFragment.title,
    pushEvent,
  ])

  return <StoryFragmentLive payload={storyFragmentPayload} />
}

export default StoryFragment
