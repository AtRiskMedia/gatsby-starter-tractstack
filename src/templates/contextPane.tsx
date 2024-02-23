// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { Link, navigate } from 'gatsby'
import { Compositor } from '@tractstack/helpers'
import { IContextPageProps } from '@tractstack/types'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'
import templates from '../components/templates'
import Belief from '../components/Belief'
import Toggle from '../components/ToggleBelief'
import YouTube from '../components/YouTube'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Wrapper from '../components/Wrapper'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export default function ContextPage(props: IContextPageProps) {
  const referrer = useAuthStore((state) => state.referrer)
  const setReferrer = useAuthStore((state) => state.setReferrer)
  const { pageContext } = props
  const lastStoryStep = useStoryStepStore((state) => state.lastStoryStep)
  const updateContentMap = useStoryStepStore((state) => state.updateContentMap)
  const [contentMapSyncd, setContentMapSyncd] = useState<boolean>(false)
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const setScrollToPane = useStoryStepStore((state) => state.setScrollToPane)
  const resourcePayload = props?.pageContext?.resources?.edges
  const hooks = {
    navigate,
    belief: Belief,
    toggle: Toggle,
    youtube: YouTube,
    processRead,
    Link,
    updateEventStream,
    resourcePayload,
    templates,
    setScrollToPane,
  }
  const [now] = useState(Date.now())
  const thisWidth = typeof window !== `undefined` ? window?.innerWidth : 600
  const viewportWidth =
    thisWidth < 801 ? `600` : thisWidth < 1367 ? `1080` : `1920`
  const goto =
    typeof lastStoryStep === `string`
      ? `/${lastStoryStep}/${viewportWidth}`
      : `/`
  const compositorPayload = {
    panesPayload: [pageContext.contextPane],
    viewportKey: ``,
    hooks,
    id: {
      id: pageContext.contextPane.id,
      title: pageContext.contextPane.title,
      slug: pageContext.contextPane.slug,
      tractStackId: ``,
      tractStackTitle: ``,
      tractStackSlug: ``,
      isContextPane: true,
      home: config.home,
    },
    tailwindBgColour: null,
  }
  const payload = Compositor(compositorPayload)
  const children = payload.contentChildren[`all-${pageContext.id}`]
  const entered = useStoryStepStore((state) => state.entered)
  const setEntered = useStoryStepStore((state) => state.setEntered)

  function hide() {
    const duration = Date.now() - now
    const verb =
      duration > readThreshold
        ? `READ`
        : duration > softReadThreshold
          ? `GLOSSED`
          : null
    if (verb)
      updateEventStream(Date.now(), {
        id: pageContext.contextPane.id,
        title: pageContext.contextPane.title,
        slug: pageContext.contextPane.slug,
        type: `Pane`,
        verb,
        duration: duration / 1000,
      })
    processRead(`<`, `context`)
  }

  useEffect(() => {
    function handleEscapeKey(event: any) {
      if (event.code === `Escape`) {
        const duration = Date.now() - now
        const verb =
          duration > readThreshold
            ? `READ`
            : duration > softReadThreshold
              ? `GLOSSED`
              : null
        if (verb)
          updateEventStream(Date.now(), {
            id: pageContext.contextPane.id,
            title: pageContext.contextPane.title,
            slug: pageContext.contextPane.slug,
            type: `Pane`,
            verb,
            duration: duration / 1000,
          })
        processRead(`<`, `context`)
      }
    }
    document.addEventListener(`keydown`, handleEscapeKey)
    return () => document.removeEventListener(`keydown`, handleEscapeKey)
  }, [
    updateEventStream,
    processRead,
    goto,
    now,
    pageContext.contextPane.id,
    pageContext.contextPane.title,
    pageContext.contextPane.slug,
  ])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const utmSource = params.get(`utm_source`) || ``
    const utmMedium = params.get(`utm_medium`) || ``
    const utmCampaign = params.get(`utm_campaign`) || ``
    const utmTerm = params.get(`utm_term`) || ``
    const utmContent = params.get(`utm_content`) || ``
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
        httpReferrer: document?.referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      })
    }
  }, [referrer, setReferrer])

  useEffect(() => {
    if (!contentMapSyncd) {
      updateContentMap({
        [pageContext.contextPane.id]: {
          hasHiddenPane: false,
          hasMaxHScreen: false,
          hasOverflowHidden: false,
          heldBeliefs: {},
          withheldBeliefs: {},
          parentId: ``,
          title: pageContext.contextPane.title,
          slug: pageContext.contextPane.slug,
          type: `Pane`,
        },
      })
      setContentMapSyncd(true)
    }
  }, [
    contentMapSyncd,
    updateContentMap,
    pageContext.contextPane.id,
    pageContext.contextPane.slug,
    pageContext.contextPane.title,
  ])

  useEffect(() => {
    if (!entered) {
      setEntered(true)
      setTimeout(
        () =>
          updateEventStream(Date.now(), {
            id: pageContext.contextPane.id,
            title: pageContext.contextPane.title,
            slug: pageContext.contextPane.slug,
            type: `Pane`,
            verb: `ENTERED`,
          }),
        1000,
      )
    }
  }, [
    entered,
    setEntered,
    pageContext.contextPane.id,
    pageContext.contextPane.title,
    pageContext.contextPane.slug,
    updateEventStream,
  ])

  return (
    <Wrapper slug={pageContext.slug} mode="contextPane">
      <Header siteTitle={pageContext.title} open={false} />
      <section id="context" className="w-full bg-slate-100 py-12">
        <div className="max-w-5xl mx-auto">
          <>{children}</>
          <div id="context-exit" className="text-center my-4">
            <button
              className="rounded-md bg-red-400 hover:bg-black hover:text-white px-3.5 py-1.5 text-base leading-7 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-myorange"
              onClick={() => hide()}
            >
              Return to main site
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </Wrapper>
  )
}
