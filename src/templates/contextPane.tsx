// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { Compositor } from 'gatsby-plugin-tractstack'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import Belief from '../components/Belief'
import YouTube from '../components/YouTube'
import Header from '../components/Header'
import Wrapper from '../components/Wrapper'
import { IContextPageProps } from '../types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export default function ContextPage(props: IContextPageProps) {
  const { pageContext } = props
  const lastStoryStep = useStoryStepStore((state) => state.lastStoryStep)
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const hooks = {
    navigate,
    belief: Belief,
    youtube: YouTube,
    processRead,
    GatsbyImage,
    getImage,
  }
  const [now] = useState(Date.now())
  const thisWidth = typeof window !== `undefined` ? window?.innerWidth : `600`
  const viewportWidth =
    thisWidth < 801 ? `600` : thisWidth < 1367 ? `1080` : `1920`
  const goto =
    typeof lastStoryStep === `string`
      ? `/${lastStoryStep}/${viewportWidth}`
      : `/`
  const id = {
    tractStackId: pageContext.tractStackId,
    tractStackTitle: pageContext.tractStackTitle,
    tractStackSlug: pageContext.tractStackSlug,
  }
  const compositorPayload = {
    panesPayload: [pageContext.contextPane],
    viewportKey: ``,
    hooks,
    id,
    tailwindBgColour: null,
  }
  const payload = Compositor(compositorPayload)
  const title = payload.contentMap[pageContext.id].title
  const children = payload.contentChildren[`all-${pageContext.id}`]
  const thisSlug = payload.contentMap[pageContext.id].slug
  const currentStoryStepCount = useStoryStepStore(
    (state) => state.currentStoryStepCount,
  )
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const pastStorySteps = useStoryStepStore((state) => state.pastStorySteps)
  const lastStoryStepCount =
    currentStoryStepCount && parseInt(currentStoryStepCount) > 0
      ? (parseInt(currentStoryStepCount) - 1).toString()
      : `0`
  const goBackPayload =
    parseInt(lastStoryStepCount) > 0
      ? storySteps[pastStorySteps[lastStoryStepCount].timecode]
      : null
  const viewport =
    typeof window === `undefined`
      ? `1920`
      : window?.innerWidth < 801
      ? `600`
      : window?.innerWidth < 1367
      ? `1080`
      : `1920`
  const goBackText = goBackPayload ? `Go to last page` : `Go to home page`
  const goBackTo =
    goBackPayload?.type === `storyFragment`
      ? `/${goBackPayload.id}/${viewport}`
      : goBackPayload?.type === `content`
      ? `/context/${goBackPayload.id}`
      : goBackPayload?.type === `products`
      ? `/products/${goBackPayload.id}`
      : goBackPayload?.type === `concierge`
      ? `/concierge/${goBackPayload.id}`
      : `/`

  function hide() {
    navigate(goBackTo)
  }

  useEffect(() => {
    function handleEscapeKey(event: any) {
      if (event.code === `Escape`) {
        const duration = Date.now() - now
        const verb =
          duration > readThreshold
            ? `read`
            : duration > softReadThreshold
            ? `glossed`
            : null
        if (verb) {
          const eventPayload = {
            id: pageContext.id,
            verb,
            type: `Context`,
            duration: duration / 1000,
          }
          updateEventStream(Date.now(), eventPayload)
        }
        processRead()
        navigate(goto)
      }
    }
    document.addEventListener(`keydown`, handleEscapeKey)
    return () => document.removeEventListener(`keydown`, handleEscapeKey)
  }, [updateEventStream, processRead, goto, now, pageContext.id])

  return (
    <Wrapper slug={thisSlug} mode="contextPane">
      <Header siteTitle={title} open={false} />
      <div id="context" className="z-80010 relative w-full min-h-screen">
        <>{children}</>
        <div id="context-exit" className="text-center my-12">
          <button
            className="rounded-md bg-red-400 hover:bg-allblack hover:text-white px-3.5 py-1.5 text-base font-semibold leading-7 text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
            onClick={() => hide()}
          >
            {goBackText}
          </button>
        </div>
      </div>
      <div className="fixed inset-0 flex justify-center sm:px-6 bg-slate-50">
        <div className="flex w-full max-w-7xl lg:px-12 bg-white">
          <div className="w-full ring-8 ring-slate-50 py-24 bg-allwhite"></div>
        </div>
      </div>
    </Wrapper>
  )
}
