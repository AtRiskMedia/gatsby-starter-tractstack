// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInterval } from 'gatsby-plugin-tractstack'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'
import { pushPayload } from '../api/services'
import Controller from './Controller'
import RenderStoryFragment from './renderStoryFragment'
import '../styles/storyfragment.css'
import { IStoryFragmentProps } from 'gatsby-plugin-tractstack/types'

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
  const eventStream = useStoryStepStore((state) => state.eventStream)
  const setZoomOverride = useStoryStepStore((state) => state.setZoomOverride)
  const zoomOverride = useStoryStepStore((state) => state.zoomOverride)
  const zoom = useStoryStepStore((state) => state.zoom)
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
    function doSync() {
      const now = Date.now()
      setDoingSync(true)
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
      })
      setDoingSync(false)
      setLastSync(now)
    }
    if (
      !forced &&
      isLoggedIn &&
      !doingSync &&
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0 &&
      (!lastSync ||
        Date.now() - lastSync >
          config.conciergeSync * config.conciergeForceInterval)
    ) {
      setForced(true)
      doSync()
    }
  }, [
    forced,
    eventStream,
    isLoggedIn,
    lastSync,
    setLastSync,
    doingSync,
    contentMap,
    tractStackId,
    updateEventStreamCleanup,
  ])

  useInterval(() => {
    if (
      typeof eventStream === `object` &&
      Object.keys(eventStream).length > 0 &&
      !doingSync
    ) {
      setDoingSync(true)
      const now = Date.now()
      pushPayload({ eventStream, contentMap, tractStackId }).finally(() => {
        updateEventStreamCleanup(now)
        setLastSync(now)
        setDoingSync(false)
      })
    }
  }, config.conciergeSync)

  useEffect(() => {
    if (!loaded) {
      if (gotoPane) setScrollTo(gotoPane)
      setLoaded(true)
    }
  }, [loaded, gotoPane, setLoaded, setScrollTo])

  useEffect(() => {
    if (loaded && scrollTo.length > 1) {
      const lastPane =
        typeof document !== `undefined` && typeof gotoPane === `string`
          ? document.getElementById(gotoPane)
          : null
      if (lastPane) lastPane.scrollIntoView({ behavior: `smooth` })
      setScrollTo(``)
      resetGotoLastPane()
    }
  }, [loaded, resetGotoLastPane, gotoPane, scrollTo, setScrollTo])

  return (
    <>
      <main>
        {!zoom || zoomOverride ? (
          <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
            <RenderStoryFragment
              viewportKey={viewportKey}
              payload={payload}
              storyFragmentId={storyFragmentId}
            />
          </StyledWrapperSection>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="mx-auto max-w-xl text-lg leading-8 text-black">
              <p className="py-2 font-action">
                Browser Zoom detected: This may result in glitched text.
              </p>
              <p className="py-2">
                Tract Stack has been built with Accessibility as a priority.
                Text is in markdown (plaintext) and we strive to always use
                syntactically correct HTML. A knowledge graph of this
                website&apos;s content is driving this experience.
              </p>
              <p className="py-2">
                An A11y reader mode is planned for our next version. This will
                ensure all spaces built on Tract Stack will remain broadly
                accessible. We apologize for the interim delay!
              </p>
              <p className="py-2">
                We recommend returning your browser Zoom to 100%. If you prefer
                (knowing you may get some glitched text), you can{` `}
                <button onClick={() => setZoomOverride(true)}>
                  override/continue
                </button>
              </p>
            </div>
          </div>
        )}
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

/* -- no longer injecting for h5p
      {hasH5P ? (
        <Helmet>
          <script src="/h5p-resizer.js" />
        </Helmet>
      ) : null}
*/
