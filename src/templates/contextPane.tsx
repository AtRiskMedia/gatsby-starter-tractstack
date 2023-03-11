// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { Compositor } from 'gatsby-plugin-tractstack'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import Belief from '../components/Belief'
import { IContextPageProps } from '../types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

export default function ContextPage(props: IContextPageProps) {
  const { pageContext } = props
  const last = useStoryStepStore((state) => state.last)
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
  const goto = typeof last === `string` ? last : `/`
  const id = {
    tractStackId: pageContext.tractStackId,
    tractStackTitle: pageContext.tractStackTitle,
    tractStackSlug: pageContext.tractStackSlug,
  }
  const payload = Compositor([pageContext.contextPane], ``, hooks, id)
  const children = payload.contentChildren[`all-${pageContext.id}`]
  function hideContext() {
    const duration = Date.now() - now
    const verb =
      duration > readThreshold
        ? `read`
        : duration > softReadThreshold
        ? `glossed`
        : null
    if (verb) {
      const eventPayload = {
        verb,
        id: pageContext.id,
        type: `Context`,
        duration: duration / 1000,
      }
      updateEventStream(Date.now(), eventPayload)
    }
    processRead()
    navigate(goto)
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
    <div id="context" className="z-80010 bg-slate-200 w-full">
      <button
        type="button"
        className="z-70020 fixed right-2 md:right-8 top-2 md:top-8 rounded-md bg-darkgrey text-white hover:text-orange hover:bg-black focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
        onClick={() => hideContext()}
      >
        <span className="sr-only">Return to last pane</span>
        <XMarkIcon
          className="h-8 md:h-16 w-8 md:w-16"
          aria-hidden="true"
          title="Return to Story Fragment"
        />
      </button>
      {children}
    </div>
  )
}
