// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { Compositor } from 'gatsby-plugin-tractstack'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import Belief from '../components/Belief'
import Header from '../components/Header'

import { IContextPageProps } from '../types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export default function ContextPage(props: IContextPageProps) {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { pageContext } = props
  const lastStoryFragment = useStoryStepStore(
    (state) => state.lastStoryFragment,
  )
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const hooks = {
    navigate,
    belief: Belief,
    updateEventStream,
    processRead,
    GatsbyImage,
    getImage,
  }
  const [now] = useState(Date.now())
  const thisWidth = typeof window !== `undefined` ? window?.innerWidth : `600`
  const viewportWidth =
    thisWidth < 801 ? `600` : thisWidth < 1367 ? `1080` : `1920`
  const goto =
    typeof lastStoryFragment === `string`
      ? `/${lastStoryFragment}/${viewportWidth}`
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
  }
  const payload = Compositor(compositorPayload)
  const title = payload.contentMap[pageContext.id].title
  const children = payload.contentChildren[`all-${pageContext.id}`]
  const thisSlug = payload.contentMap[pageContext.id].slug

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

  useEffect(() => {
    if (!loaded) {
      setLastStoryStep(thisSlug, `contextPane`)
      setLoaded(true)
    }
  }, [loaded, setLoaded, thisSlug, setLastStoryStep])

  return (
    <>
      <Header siteTitle={title} open={false} />
      <div id="context" className="z-80010 relative w-full">
        {children}
      </div>
      <div className="fixed inset-0 flex justify-center sm:px-6">
        <div className="flex w-full max-w-7xl lg:px-12">
          <div className="w-full bg-slate-50 opacity-30 ring-1 ring-lightgrey py-24"></div>
        </div>
      </div>
    </>
  )
}
