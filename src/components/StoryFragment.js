import React from "react"
import styled from "styled-components"

import { useStoryStepStore } from "../stores/storyStep"
import Controller from "./controller"
import StoryFragmentRender from "./storyFragmentRender"
import Context from "./Context"
import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  storyFragmentPayload,
  contextPayload,
  viewportKey,
  prefersReducedMotion,
}) => {
  const panesVisible = useStoryStepStore(state => state.panesVisible)
  const revealContext = useStoryStepStore(state => state.revealContext)
  const contentMap = useStoryStepStore(state => state.contentMap)
  const updatePanesVisible = useStoryStepStore(
    state => state.updatePanesVisible
  )
  const updateRevealContext = useStoryStepStore(
    state => state.updateRevealContext
  )
  const updateEventStream = useStoryStepStore(state => state.updateEventStream)
  const processRead = useStoryStepStore(state => state.processRead)
  const revealContextDetails = contentMap?.hasOwnProperty(revealContext.slug)
    ? contentMap[revealContext.slug]
    : false
  const revealContextId =
    typeof revealContextDetails === "object" ? revealContextDetails.id : false
  const impressions = storyFragmentPayload?.panesPayload?.impressions || {}
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
              revealContext={{ id: revealContextId, ...revealContext }}
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
              processRead={processRead}
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
