import React from "react"
import styled from "styled-components"

import Controller from "./controller"
import StoryFragmentRender from "./storyFragmentRender"
import Context from "./Context"
import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  panesVisible,
  updatePanesVisible,
  revealContext,
  updateRevealContext,
  updateEventStream,
  storyFragmentPayload,
  contextPayload,
  allContext,
  viewportKey,
  prefersReducedMotion,
}) => {
  const impressions = storyFragmentPayload?.panesPayload?.impressions || {}
  const revealContextSlug =
    typeof revealContext?.slug === "string" && revealContext.slug.length > 1
      ? revealContext.slug
      : false
  const revealContextId =
    revealContextSlug && allContext.hasOwnProperty(revealContextSlug)
      ? allContext[revealContextSlug]
      : false
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
      typeof panesVisible[key] === "number" &&
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
              revealContext={revealContext}
              updateRevealContext={updateRevealContext}
              updateEventStream={updateEventStream}
              children={thisContextPayload?.children}
            />
          ) : (
            <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
              <StoryFragmentRender
                storyFragmentPayload={storyFragmentPayload}
                viewportKey={viewportKey}
                panesVisible={panesVisible}
                updateEventStream={updateEventStream}
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
              updateRevealContext={updateRevealContext}
              updateEventStream={updateEventStream}
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
