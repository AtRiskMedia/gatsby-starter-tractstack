import * as React from "react"
import PropTypes from "prop-types"
import { XMarkIcon, ArrowsPointingOutIcon } from "@heroicons/react/24/outline"
import styled from "styled-components"

import {
  getControllerPayload,
  wordmark,
  concierge,
  classNames,
} from "gatsby-plugin-tractstack"

const StyledWrapperAside = styled.aside`
  ${props => props.css};
`

const Controller = ({ panesArray, impressions, viewportKey }) => {
  const [open, setOpen] = React.useState(true)
  //const controllerPayload = getControllerPayload(open, viewportKey)
  const impressionPayloads = panesArray
    .map(p => {
      if (impressions.hasOwnProperty(p)) {
        return impressions[p].payload
      }
      return null
    })
    .filter(x => x)
  const visibleImpressions = Object.keys(impressionPayloads).length
  const controllerPayload = getControllerPayload(open, viewportKey)
  const thisCss = `.controller__expanded--${viewportKey} { ${controllerPayload.css} }`

  /*
  const tractStackWordmark = wordmark("tractstack")
  function injectPayload() {
    const thisPayload = [
      [["goto", ["storyReact.React.Fragment", "tractstack"]]],
      "",
    ]
    concierge(thisPayload)
  }
  if (carouselSlides.length) {
    carouselSlides.push(
      <button
        key={0}
        className="controller__carousel"
        onClick={() => injectPayload()}
      >
        <p>
          {tractStackWordmark}{" "}
          <span className="headline">
            No-code website builder + conversion funnel concierge
          </span>
        </p>
      </button>
    )
  }
*/
  if (visibleImpressions === 0) return <></>
  if (open)
    return (
      <StyledWrapperAside css={thisCss} id="controller">
        <div
          className={`z-70010 bg-lightgrey controller__expanded controller__expanded--${viewportKey}`}
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
     




          </div>
        </div>
      </StyledWrapperAside>
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
            {visibleImpressions}
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
