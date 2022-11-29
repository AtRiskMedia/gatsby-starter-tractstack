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
  allContext,
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
      : false
  const thisContextPayload = contextPayload?.payload?.hasOwnProperty(
    revealContextId
  )
    ? contextPayload.payload[revealContextId]
    : null
  const thisCss = !prefersReducedMotion
    ? `${storyFragmentPayload?.panesPayload?.css || ``} ${
        storyFragmentPayload?.panesPayload?.cssAnimated || ``
      }`
    : `${storyFragmentPayload?.panesPayload?.css || ``}`
  let impressionPanes = []
  Object.keys(panesVisible).forEach(key => {
    if (
      key !== "last" &&
      key !== "gotoLast" &&
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
          {revealContextId ? (
            <Context
              updatePanesVisible={updatePanesVisible}
              children={thisContextPayload?.children}
              last={panesVisible.last}
            />
          ) : (
            <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
              <StoryFragmentRender
                storyFragmentPayload={storyFragmentPayload}
                viewportKey={viewportKey}
                updatePanesVisible={updatePanesVisible}
              />
            </StyledWrapperSection>
          )}
        </main>
        {revealContextId === false &&
        impressionPanes.length &&
        panesVisible.footer !== true ? (
          <aside id="controller">
            <Controller
              impressions={impressions}
              impressionPanes={impressionPanes}
              updatePanesVisible={updatePanesVisible}
              allContext={allContext}
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
