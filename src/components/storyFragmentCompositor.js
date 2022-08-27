import * as React from "react"
import styled from "styled-components"
import { InView } from "react-cool-inview"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const Pane = ({ thisId, children, inView, observe }) => (
  <div
    id={thisId}
    className={inView ? "pane visible" : "pane hidden"}
    ref={observe}
  >
    {children}
  </div>
)

const StoryFragmentCompositor = ({
  payload,
  prefersReducedMotion,
  viewportKey,
  setLispActionPayload,
  setPanesArray,
  panesArray,
}) => {
  const panes =
    typeof payload?.payload?.panes === "object" && payload?.payload?.panes
  const menu = (typeof payload?.menu === "object" && payload?.menu) || <></>
  const thisPayload =
    typeof payload?.payload?.payload === "object" && payload?.payload?.payload
  const rendering =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPane = thisPayload[p]
      const thisCss =
        (!prefersReducedMotion &&
          `${thisPane?.css} ${thisPane?.cssAnimated}`) ||
        `${thisPane?.css}`
      const hasAccessibleController =
        prefersReducedMotion && thisPane?.impressions?.length
      const accessibleController =
        (hasAccessibleController && (
          <ul id={`${viewportKey}-${p}-controller`}>
            {thisPane?.impressions?.map(e => {
              return e?.accessibleController
            })}
          </ul>
        )) ||
        ``
      return (
        <StyledWrapperSection key={`${viewportKey}-${p}`} css={thisCss}>
          <InView
            onEnter={() => {
              if (panesArray.indexOf(p) === -1)
                setPanesArray([...panesArray, p])
            }}
            onLeave={() => {
              const thisIndex = panesArray.indexOf(p)
              if (thisIndex) {
                setPanesArray(panesArray =>
                  panesArray.filter((e, i) => i !== thisIndex)
                )
              }
            }}
          >
            <Pane
              thisId={`${viewportKey}-${p}`}
              children={thisPane?.children}
            />
          </InView>
          {accessibleController}
        </StyledWrapperSection>
      )
    })
  const renderedStoryFragment =
    (menu && (
      <>
        {menu}
        {rendering}
      </>
    )) ||
    rendering
  return renderedStoryFragment
}

export default StoryFragmentCompositor
