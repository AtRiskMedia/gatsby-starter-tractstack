import * as React from "react"
import PropTypes from "prop-types"
import { XMarkIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"

import {
  getControllerPayload,
  wordmark,
  concierge,
  classNames,
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
  return (
    <>
      <h3 className="text-lg font-medium leading-6 text-gray-900">
        {payload.altTitle}
      </h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-gray-500">
          <p>{payload.headline}</p>
        </div>
        <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex sm:flex-shrink-0 sm:items-center">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            {payload.buttonText}
          </button>
        </div>
      </div>
    </>
  )
}

const Controller = ({ panesArray, impressions, viewportKey }) => {
  const [offset, setOffset] = React.useState(0)
  //const [delay, setDelay] = React.useState(2200)
  const delay = 22000
  const [open, setOpen] = React.useState(true)
  let impressionPayloads = []
  panesArray.forEach(p => {
    if (impressions.hasOwnProperty(p)) {
      impressionPayloads.push(impressions[p].payload)
    }
    return null
  })
  const impressionCount = impressionPayloads.length

  useInterval(() => {
    if (impressionCount > offset + 1) setOffset(offset + 1)
    else setOffset(0)
  }, delay)

  if (impressionCount === 0) return <></>
  const thisImpression = impressionPayloads[offset]
  if (open)
    return (
      <aside id="controller">
        <div
          className={`z-70010 overflow-hidden bg-lightgrey controller__expanded controller__expanded--${viewportKey}`}
        >
          <div className="px-4 py-5 sm:p-6">
            <button
              type="button"
              className="z-70020 absolute right-2 top-2 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setOpen(!open)}
            >
              <span className="sr-only">Hide controller</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Impression payload={thisImpression[0]} />
          </div>
        </div>
      </aside>
    )
  return (
    <aside id="controller">
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
          <span className="z-70030 absolute -top-5 -right-4 h-6 w-6 rounded-full bg-darkgrey text-white flex justify-center items-center items">
            {impressionCount}
          </span>
        </button>
      </div>
    </aside>
  )
}

Controller.propTypes = {
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Controller
