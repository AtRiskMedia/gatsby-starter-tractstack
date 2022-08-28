import * as React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"

import { getControllerPayload } from "gatsby-plugin-tractstack"

const StyledWrapperAside = styled.aside`
  ${props => props.css};
`

const Controller = ({ panesArray, impressions, viewportKey }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const controllerPayload = getControllerPayload(isExpanded, viewportKey)
  const thisId = isExpanded ? "controller__expanded" : "controller__minimized"
  const thisCss = `#${thisId} { background: #fff; ${controllerPayload.css} }`
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
  if (!show) return <></>
  if (isExpanded)
    return (
      <StyledWrapperAside css={thisCss} id="controller">
        <div id={thisId}>
          {carouselSlides}{" "}
          <button onClick={() => setIsExpanded(!isExpanded)}>*</button>
        </div>
      </StyledWrapperAside>
    )
  return (
    <StyledWrapperAside css={thisCss} id="controller">
      <ul id={thisId}>
        <li>
          <button onClick={() => setIsExpanded(!isExpanded)}>*</button>
        </li>{" "}
        {icons}
      </ul>
    </StyledWrapperAside>
  )
}

Controller.propTypes = {
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Controller
