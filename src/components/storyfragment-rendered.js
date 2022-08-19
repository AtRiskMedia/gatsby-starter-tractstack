import * as React from "react"
import styled from "styled-components"
import { useInView } from "react-cool-inview"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

function RenderedStoryFragment(props) {
  const viewportKey = props.viewportKey
  const prefersReducedMotion = props.prefersReducedMotion
  const panesVisible = props.panesVisible
  const setLispActionPayload = props.setLispActionPayload
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
      const thisCss =
        (prefersReducedMotion && `${thisPane?.css}`) ||
        `
            ${thisPane?.css}${thisPane?.cssAnimated}
          `
      function injectPayloadVisible() {
        setLispActionPayload(["hookPaneVisible", p])
      }
      function injectPayloadHidden() {
        setLispActionPayload(["hookPaneHidden", p])
      }
      const { observe, inView } = useInView({
        onEnter: ({}) => {
          injectPayloadVisible()
        },
        onLeave: ({}) => {
          injectPayloadHidden()
        },
      })
      return (
        <StyledWrapperSection key={`${viewportKey}-${p}`} css={thisCss}>
          <div
            id={`${viewportKey}-${p}`}
            className={(inView && "pane visible") || "pane"}
            ref={observe}
          >
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
