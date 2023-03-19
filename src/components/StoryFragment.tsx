// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInterval } from 'gatsby-plugin-tractstack'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'
import { pushPayload } from '../api/services'
import Controller from './Controller'
import StoryFragmentRender from './storyFragmentRender'
import '../styles/storyfragment.css'
import { IStoryFragmentProps } from '../types'

interface IStyledWrapperSectionProps {
  css: any
}
const StyledWrapperSection = styled.section<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`

const StoryFragment = ({ viewportKey, payload }: IStoryFragmentProps) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [scrollTo, setScrollTo] = useState<String>(``)
  const lookup = `${viewportKey}-${payload.id}`
  const storyFragment = payload.storyFragment[lookup]
  const tractStackId = payload.tractStackId
  const contentMap = payload.contentMap
  const panesVisible = useStoryStepStore((state) => state.panesVisible)
  const lastStoryFragment = useStoryStepStore(
    (state) => state.lastStoryFragment,
  )
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const updateEventStreamCleanup = useStoryStepStore(
    (state) => state.updateEventStreamCleanup,
  )
  const eventStream = useStoryStepStore((state) => state.eventStream)
  const gotoLastPane = useStoryStepStore((state) => state.gotoLastPane)
  console.log(`gotoLastPane`, gotoLastPane)
  const resetGotoLastPane = useStoryStepStore(
    (state) => state.resetGotoLastPane,
  )
  const gotoPane =
    gotoLastPane &&
    gotoLastPane[0] &&
    gotoLastPane[1] &&
    gotoLastPane[1] === payload.slug &&
    viewportKey
      ? `${viewportKey}-${gotoLastPane[0]}`
      : null
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const lastSync = useAuthStore((state) => state.lastSync)
  const setLastSync = useAuthStore((state) => state.setLastSync)
  const forceSync =
    isLoggedIn &&
    typeof eventStream === `object` &&
    Object.keys(eventStream).length > 0 &&
    (!lastSync || Date.now() - lastSync > config.conciergeSync * 2)
  const thisCss = storyFragment?.css || ``
  const impressions =
    typeof storyFragment !== `undefined` ? storyFragment.impressions : null
  const impressionPanes: any[] = []
  Object.keys(panesVisible).forEach((key) => {
    if (
      typeof panesVisible[key] === `number` &&
      impressions &&
      typeof impressions[key] !== `undefined`
    ) {
      if (panesVisible.last === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })

  useEffect(() => {
    if (forceSync) {
      const now = Date.now()
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
        setLastSync(now)
      })
    }
  }, [
    forceSync,
    eventStream,
    contentMap,
    tractStackId,
    updateEventStreamCleanup,
    setLastSync,
  ])

  useInterval(() => {
    if (
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0
    ) {
      const now = Date.now()
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
        setLastSync(now)
      })
    }
  }, config.conciergeSync)

  useEffect(() => {
    if (!loaded) {
      if (lastStoryFragment !== payload.slug) {
        setLastStoryStep(payload.slug, `storyFragment`)
      }
      if (gotoPane) setScrollTo(gotoPane)
      setLoaded(true)
    }
  }, [
    loaded,
    gotoPane,
    setLoaded,
    setScrollTo,
    lastStoryFragment,
    payload.slug,
    setLastStoryStep,
  ])

  useEffect(() => {
    console.log(loaded, scrollTo.length, scrollTo)
    if (loaded && scrollTo.length > 1) {
      const lastPane =
        typeof document !== `undefined` && typeof gotoPane === `string`
          ? document.getElementById(gotoPane)
          : null
      if (lastPane) lastPane.scrollIntoView()
      setScrollTo(``)
      resetGotoLastPane()
    }
  }, [loaded, resetGotoLastPane, gotoPane, scrollTo, setScrollTo])

  return (
    <>
      <main>
        <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
          <StoryFragmentRender viewportKey={viewportKey} payload={payload} />
        </StyledWrapperSection>
      </main>
      {impressionPanes.length > 0 ? (
        <aside id="controller">
          <Controller
            impressions={impressions}
            impressionPanes={impressionPanes}
            viewportKey={viewportKey}
            contentMap={contentMap}
          />
        </aside>
      ) : null}
    </>
  )
}

export default StoryFragment
