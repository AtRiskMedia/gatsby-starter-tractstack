import React, { useEffect } from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

import config from "../../data/SiteConfig"

const threshold = config.threshold

const Context = ({
  children,
  updateRevealContext,
  updateEventStream,
  revealContext,
}) => {
  let duration = 0
  function hideContext() {
    duration = Date.now() - revealContext.reveal
    console.log(duration, threshold)
    if (duration > threshold)
      updateEventStream(Date.now(), {
        command: "read",
        payload: {
          slug: revealContext.slug,
          type: "context",
          duration: duration,
        },
      })
    updateRevealContext("slug", undefined)
  }
  useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        hideContext()
      }
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [updateRevealContext])

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
