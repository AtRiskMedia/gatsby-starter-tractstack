import * as React from "react"
import styled from "styled-components"

import Controller from "./controller"
import StoryFragmentRender from "./storyFragmentRender"
import Context from "./Context"
import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  updatePanesVisible,
  panesVisible,
  storyFragmentPayload,
  contextPayload,
  viewportKey,
  prefersReducedMotion,
}) => {
  const impressions = storyFragmentPayload?.panesPayload?.impressions || {}
  const revealContextId =
    typeof panesVisible.revealContext === "string" &&
      panesVisible.revealContext.length > 1
      ? panesVisible["revealContext"]
      : null
  const thisContextPayload = contextPayload?.payload?.hasOwnProperty(
    revealContextId
  )
    ? contextPayload.payload[revealContextId]
    : null
  const thisCss = !prefersReducedMotion
    ? `${storyFragmentPayload?.panesPayload?.css || ``} ${storyFragmentPayload?.panesPayload?.cssAnimated || ``
    }`
    : `${storyFragmentPayload?.panesPayload?.css || ``}`
  let impressionPanes = []
  Object.keys(panesVisible).forEach(key => {
    if (
      key !== "last" &&
      key !== "footer" &&
      key !== "revealContext" &&
      panesVisible[key] === true &&
      impressions.hasOwnProperty(key)
    ) {
      if (panesVisible["last"] === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })
  return (
    <>
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
        }}
      >
        <main>
          <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
            <StoryFragmentRender
              storyFragmentPayload={storyFragmentPayload}
              viewportKey={viewportKey}
              updatePanesVisible={updatePanesVisible}
            />
          </StyledWrapperSection>
          {revealContextId ? (
            <Context
              updatePanesVisible={updatePanesVisible}
              children={thisContextPayload?.children}
            />
          ) : (
            <></>
          )}
        </main>
        {impressionPanes.length && panesVisible.footer !== true ? (
          <aside id="controller">
            <Controller
              impressions={impressions}
              impressionPanes={impressionPanes}
              viewportKey={viewportKey}
            />
          </aside>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default StoryFragment
