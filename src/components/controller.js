import * as React from "react"
import PropTypes from "prop-types"
import { XMarkIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"

import {
  getControllerPayload,
  concierge,
  lispLexer,
} from "gatsby-plugin-tractstack"

function useInterval(callback, delay) {
  const savedCallback = React.useRef()
  // Remember the latest function.
  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

const Impression = ({ payload }) => {
  if (typeof payload !== "object") return <></>
  const thisButtonPayload = lispLexer(payload.actionsLisp)
  function injectPayload() {
    concierge(thisButtonPayload)
  }
  return (
    <>
      <h3 className="text-rlg sm:text-lg font-medium leading-6 text-allblack">
        {payload.title}
      </h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-rsm sm:text-sm text-darkgrey">
          <p>
            {payload.body}{" "}
            <button
              type="button"
              onClick={injectPayload}
              className="underline underline-offset-4 text-allblack hover:orange"
            >
              {payload.buttonText}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

const Controller = ({ impressions, impressionPanes, viewportKey }) => {
  const [offset, setOffset] = React.useState(0)
  //const [delay, setDelay] = React.useState(2200)
  const delay = 22000
  const [open, setOpen] = React.useState(true)

  useInterval(() => {
    if (impressionPanes.length > offset + 1) setOffset(offset + 1)
    else setOffset(0)
  }, delay)
  const offsetImpression = impressionPanes.hasOwnProperty(offset)
    ? impressions[impressionPanes[offset]].payload
    : impressions[impressionPanes[0]].payload
  const thisImpression =
    typeof offsetImpression === "object" &&
    typeof offsetImpression[0] === "object"
      ? offsetImpression[0]
      : null
  if (!thisImpression) return <></>
  if (open)
    return (
      <aside id="controller" className="mr-1">
        <div
          className={`z-70010 overflow-hidden bg-neutral-200 rounded-md border border-darkgrey controller__expanded controller__expanded--${viewportKey}`}
        >
          <div className="px-4 pt-4">
            <button
              type="button"
              className="z-70020 absolute right-2 top-2 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Hide controller</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Impression payload={thisImpression} />
          </div>
        </div>
      </aside>
    )
  return (
    <div
      className={`z-70010 relative controller__minimized controller_minimized--${viewportKey}`}
    >
      <button
        type="button"
        className="z-70020 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => setOpen(!open)}
      >
        <span className="sr-only">Show controller</span>
        <ArrowsPointingOutIcon className="h-8 w-8" aria-hidden="true" />
        <span className="z-70030 absolute -top-5 -left-4 h-6 w-6 rounded-full bg-allwhite text-black flex justify-center items-center items">
          {impressionPanes.length}
        </span>
      </button>
    </div>
  )
}

Controller.propTypes = {
  impressions: PropTypes.object.isRequired,
  impressionPanes: PropTypes.array.isRequired,
  viewportKey: PropTypes.string.isRequired,
}

export default Controller
