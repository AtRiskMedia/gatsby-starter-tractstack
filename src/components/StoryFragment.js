import * as React from "react"
import styled from "styled-components"

import Controller from "../components/controller"
import StoryFragmentRender from "../components/storyFragmentRender"

import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  updatePanesVisible,
  panesVisible,
  storyFragmentPayload,
  viewportKey,
  prefersReducedMotion,
}) => {
  const impressions = storyFragmentPayload?.panesPayload?.impressions || {}
  const revealContextId = panesVisible?.hasOwnProperty("revealContext")
    ? panesVisible["revealContext"]
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
            <div id="context" className="z-80010 bg-black-seethrough">
              modal
            </div>
          ) : (
            <></>
          )}
        </main>
        {impressionPanes.length && panesVisible.footer === false ? (
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
