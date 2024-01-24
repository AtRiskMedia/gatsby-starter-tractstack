// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useInterval } from '@tractstack/helpers'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'
import { pushPayload } from '../api/services'
import Controller from './Controller'
import RenderStoryFragment from './renderStoryFragment'
import '../styles/storyfragment.css'
import { IStoryFragmentProps } from '@tractstack/types'

interface IStyledWrapperSectionProps {
  css: string
}
const StyledWrapperSection = styled.section<IStyledWrapperSectionProps>`
  ${(props: any) => props.css};
`

const StoryFragmentLive = ({
  payload,
  contextPanesMap,
}: IStoryFragmentProps) => {
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const lastSync = useAuthStore((state) => state.lastSync)
  const setLastSync = useAuthStore((state) => state.setLastSync)
  const referrer = useAuthStore((state) => state.referrer)
  const eventStream = useStoryStepStore((state) => state.eventStream)
  const [contentMapSyncd, setContentMapSyncd] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [doingSync, setDoingSync] = useState<boolean>(false)
  const [beenSeenPanes, setBeenSeenPanes] = useState<Object>({})
  const [scrollTo, setScrollTo] = useState<String>(``)
  const [forced, setForced] = useState(false)
  const lookup = `${viewportKey}-${payload.id}`
  const storyFragment = payload.storyFragment[lookup]
  const tractStackId = payload.tractStackId
  const storyFragmentId = {
    id: payload.id,
    title: payload.title,
    slug: payload.slug,
    tractStackId: payload.tractStackId,
    tractStackTitle: payload.tractStackTitle,
    tractStackSlug: payload.tractStackSlug,
  }
  const thisContentMap = payload.contentMap
  const panesVisible = useStoryStepStore((state) => state.panesVisible)
  const contentMap = useStoryStepStore((state) => state.contentMap)
  const updateContentMap = useStoryStepStore((state) => state.updateContentMap)
  const updateEventStreamCleanup = useStoryStepStore(
    (state) => state.updateEventStreamCleanup,
  )
  const gotoLastPane = useStoryStepStore((state) => state.gotoLastPane)
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
  const thisCss = storyFragment?.css || ``
  const impressions =
    typeof storyFragment !== `undefined` ? storyFragment.impressions : null
  const impressionPanes: any[] = []
  //  const hasH5P = payload.storyFragment[`${viewportKey}-${payload.id}`]!.hasH5P
  Object.keys(panesVisible).forEach((key) => {
    if (
      typeof panesVisible[key] === `number` &&
      impressions &&
      typeof impressions[key] !== `undefined`
    ) {
      if (!Object.prototype.hasOwnProperty.call(beenSeenPanes, key)) {
        if (panesVisible.last === key) impressionPanes.unshift(key)
        else impressionPanes.push(key)
        if (!Object.prototype.hasOwnProperty.call(beenSeenPanes, key)) {
          setBeenSeenPanes({ ...beenSeenPanes, [key]: Date.now() })
        }
      }
    }
  })
  Object.keys(beenSeenPanes).forEach((key) => {
    if (!Object.prototype.hasOwnProperty.call(impressionPanes, key)) {
      if (panesVisible.last === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })

  const goPushPayload = useCallback(async () => {
    const response = await pushPayload({
      eventStream,
      contentMap,
      tractStackId,
      referrer,
    })
    if (response && response?.success && !response?.error)
      return { success: true }
    return { error: true }
  }, [eventStream, contentMap, tractStackId, referrer])

  useEffect(() => {
    if (!contentMapSyncd && thisContentMap) {
      contextPanesMap.forEach((e: any) => {
        thisContentMap[e.id] = {
          hasHiddenPane: false,
          hasMaxHScreen: false,
          hasOverflowHidden: false,
          heldBeliefs: {},
          withheldBeliefs: {},
          parentId: ``,
          slug: e.slug,
          title: e.title,
          type: `Pane`,
        }
      })
      updateContentMap(thisContentMap)
      setContentMapSyncd(true)
    }
  }, [contextPanesMap, contentMapSyncd, thisContentMap, updateContentMap])

  useEffect(() => {
    if (
      isLoggedIn &&
      !doingSync &&
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0 &&
      forced
    ) {
      setDoingSync(true)
      const now = Date.now()
      goPushPayload()
        .then((res) => {
          if (res?.success && !res?.error) {
            updateEventStreamCleanup(now)
            setLastSync(now)
            setDoingSync(false)
          } else setDoingSync(false)
        })
        .finally(() => setForced(false))
    }
  }, [
    forced,
    setLastSync,
    goPushPayload,
    eventStream,
    isLoggedIn,
    doingSync,
    updateEventStreamCleanup,
  ])

  useEffect(() => {
    if (
      isLoggedIn &&
      !doingSync &&
      (!lastSync ||
        Date.now() - lastSync >
          config.conciergeSync * config.conciergeForceInterval)
    ) {
      setForced(true)
    }
  }, [lastSync, doingSync, isLoggedIn])

  useInterval(() => {
    if (
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0 &&
      !doingSync &&
      isLoggedIn
    ) {
      setForced(true)
    }
  }, config.conciergeSync)

  useEffect(() => {
    if (!loaded) {
      if (gotoPane) setScrollTo(gotoPane)
      setLoaded(true)
    }
    if (loaded && scrollTo.length > 1) {
      const lastPane =
        typeof document !== `undefined` && typeof gotoPane === `string`
          ? document.getElementById(gotoPane)
          : null
      if (lastPane) lastPane.scrollIntoView({ behavior: `smooth` })
      setScrollTo(``)
      resetGotoLastPane()
    }
  }, [loaded, resetGotoLastPane, gotoPane, scrollTo])

  return (
    <>
      <main>
        <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
          <RenderStoryFragment
            viewportKey={viewportKey}
            payload={payload}
            storyFragmentId={storyFragmentId}
          />
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

export default StoryFragmentLive
