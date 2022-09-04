import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import Carousel from "nuka-carousel"

import { getControllerPayload } from "gatsby-plugin-tractstack"

const StyledWrapperAside = styled.aside`
  ${props => props.css};
`

const Controller = ({
  panesArray,
  impressions,
  viewportKey,
  prefersReducedMotion,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const controllerPayload = getControllerPayload(isExpanded, viewportKey)
  const thisId = isExpanded ? "controller__expanded" : "controller__minimized"
  const thisCssAnimated = prefersReducedMotion
    ? ``
    : `opacity:0; animation-fill-mode: both; animation-name: fadeIn; -webkit-animation-name: fadeIn;  animation-duration: 0.25s; -webkit-animation-duration: 0.25s;  animation-delay: 0s; `
  const thisCss = `#${thisId} { background: #fff; ${controllerPayload.css} ${thisCssAnimated} }`
  let carouselSlides = []
  let icons = []
  let show = false

  if (panesArray?.length)
    panesArray.map(p => {
      if (impressions.hasOwnProperty(p)) {
        carouselSlides.push(impressions[p].carouselSlides)
        icons.push(impressions[p].icons)
        show = true
      }
      return null
    })

  if (carouselSlides.length) {
    carouselSlides.push(
      <button key={0}>
        <div className="title">
          Tract Stack | No-code conversion funnel concierge
        </div>
        <div className="headline">
          This experience is powered by Tract Stack | No-code conversion funnel
          concierge
        </div>
      </button>
    )
  }
  if (!show) return <></>
  if (isExpanded)
    return (
      <StyledWrapperAside css={thisCss} id="controller">
        <div
          className={`controller__expanded controller__expanded--${viewportKey}`}
          id={thisId}
        >
          <button
            className={`controller__expanded--toggle controller__expanded--toggle-${viewportKey}`}
            onClick={() => setIsExpanded(!isExpanded)}
            title="Minimize the Controller"
          >
            <span>&lt;</span>
          </button>
          <div
            className={`controller__expanded--carousel controller__expanded--carousel-${viewportKey}`}
          >
            <Carousel
              wrapAround={true}
              autoplay={true}
              autoplayInterval={12000}
              slidesToShow={1}
              withoutControls={true}
            >
              {carouselSlides}
            </Carousel>
          </div>
        </div>
      </StyledWrapperAside>
    )
  return (
    <StyledWrapperAside css={thisCss} id="controller">
      <div
        className={`controller__minimized controller__minimized--${viewportKey}`}
        id={thisId}
      >
        <button
          className={`controller__minimized--toggle controller__minimized--toggle-${viewportKey}`}
          onClick={() => setIsExpanded(!isExpanded)}
          title="Expand the Controller"
        >
          <span>&gt;</span>
        </button>
        <div className={`controller__minimized--icons-${viewportKey}`}>
          <ul id={thisId}>{icons}</ul>
        </div>
      </div>
    </StyledWrapperAside>
  )
}

Controller.propTypes = {
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Controller
