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
  let lookup = false
  for (let [key, value] of Object.entries(contentMap)) {
    if (value.slug === revealContext.slug) lookup = key
  }
  const thisContextPayload = contextPayload?.payload?.hasOwnProperty(lookup)
    ? contextPayload.payload[lookup]
    : false
  const impressions = storyFragmentPayload?.panesPayload?.impressions || {}
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
          {lookup ? (
            <Context children={thisContextPayload?.children} />
          ) : (
            <StyledWrapperSection key={`${viewportKey}`} css={thisCss}>
              <StoryFragmentRender
                storyFragmentPayload={storyFragmentPayload}
                viewportKey={viewportKey}
              />
            </StyledWrapperSection>
          )}
        </main>
        {lookup === false &&
        impressionPanes.length &&
        panesVisible.footer !== true ? (
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
