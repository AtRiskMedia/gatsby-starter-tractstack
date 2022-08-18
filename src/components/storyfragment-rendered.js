import * as React from "react"
import styled from "styled-components"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

function RenderedStoryFragment(props) {
  const viewportKey = props.viewportKey
  const panes =
    typeof props?.payload?.payload?.panes === "object" &&
    props.payload.payload.panes
  const menu = (typeof props?.payload?.menu === "object" &&
    props.payload.menu) || <></>
  const thisPayload =
    typeof props?.payload?.payload?.payload === "object" &&
    props.payload.payload.payload
  const rendering =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPane = thisPayload[p]
      return (
        <StyledWrapperSection
          key={`${viewportKey}-${p}`}
          css={`
            ${thisPane?.css}${thisPane?.cssAnimated}
          `}
        >
          <div id={`${viewportKey}-${p}`} className="pane">
            {thisPane?.children}
          </div>
        </StyledWrapperSection>
      )
    })
  const rendered =
    (menu && (
      <>
        {menu}
        {rendering}
      </>
    )) ||
    rendering
  return rendered
}

export default RenderedStoryFragment
