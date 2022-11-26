import * as React from "react"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import Controller from "../components/controller"
import StoryFragmentRender from "../components/storyFragmentRender"

import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  update,
  storyStep,
  storyFragmentPayload,
  viewportKey,
  prefersReducedMotion,
}) => {
  const impressions = storyFragmentPayload?.payload?.impressions || {}
  const revealContextId = storyStep?.hasOwnProperty("revealContext")
    ? storyStep["revealContext"]
    : null
  const thisCss = !prefersReducedMotion
    ? `${storyFragmentPayload?.payload?.css || ``} ${
        storyFragmentPayload?.payload?.cssAnimated || ``
      }`
    : `${storyFragmentPayload?.payload?.css || ``}`
  let impressionPanes = []
  Object.keys(storyStep).forEach(key => {
    if (storyStep[key] === true && impressions.hasOwnProperty(key)) {
      if (storyStep["last"] === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })
  return (
    <>
      <Helmet>
        <script src="/h5p-resizer.js" />
      </Helmet>
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
              update={update}
            />
          </StyledWrapperSection>
          {revealContextId ? (
            <div id="context" className="z-80010 bg-black-seethrough">
              modal
            </div>
          ) : (
            <></>
          )}
        </main>
        {impressionPanes.length && storyStep.footer === false ? (
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
