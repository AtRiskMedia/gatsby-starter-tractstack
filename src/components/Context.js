import React, { useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { useStoryStepStore } from "../stores/storyStep"
import config from "../../data/SiteConfig"

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

const Context = ({ children }) => {
  const revealContext = useStoryStepStore(state => state.revealContext)
  const contentMap = useStoryStepStore(state => state.contentMap)
  const updateRevealContext = useStoryStepStore(
    state => state.updateRevealContext
  )
  const updateEventStream = useStoryStepStore(state => state.updateEventStream)

  function hideContext() {
    const duration = Date.now() - revealContext.reveal
    const verb =
      duration > readThreshold
        ? "read"
        : duration > softReadThreshold
        ? "glossed"
        : null
    let lookup = false
    for (let [key, value] of Object.entries(contentMap)) {
      if (value.slug === revealContext.slug) lookup = key
    }
    if (verb && lookup)
      updateEventStream(Date.now(), {
        verb: verb,
        object_name: revealContext.slug,
        object_id: contentMap[lookup].id,
        object_type: "context",
        duration: duration / 1000,
        tractStackId: contentMap[lookup].tractStackId,
        tractStackSlug: contentMap[lookup].tractStackSlug,
        storyFragmentId: contentMap[lookup].tractStackId,
        storyFragmentSlug: contentMap[lookup].tractStackSlug,
      })
    updateRevealContext("reveal", undefined)
    updateRevealContext("slug", undefined)
  }
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        const duration = Date.now() - revealContext.reveal
        const verb =
          duration > readThreshold
            ? "read"
            : duration > softReadThreshold
            ? "glossed"
            : null
        if (verb)
          updateEventStream(Date.now(), {
            verb: verb,
            object_name: revealContext.slug,
            object_id: contentMap[revealContext.slug].id,
            object_type: "context",
            duration: duration / 1000,
          })
        updateRevealContext("slug", undefined)
      }
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [updateRevealContext, revealContext, updateEventStream, contentMap])

  return (
    <div id="context" className="z-80010 bg-allblack-seethrough">
      <button
        type="button"
        className="z-70020 fixed right-8 top-8 rounded-md bg-lightgrey text-black hover:text-white hover:bg-orange focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
        onClick={() => hideContext()}
      >
        <span className="sr-only">Hide controller</span>
        <XMarkIcon className="h-16 w-16" aria-hidden="true" />
      </button>
      {children}
    </div>
  )
}

export default Context
