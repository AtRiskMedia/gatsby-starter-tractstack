import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import create from "zustand"
import { InView } from "react-cool-inview"

import Header from "../components/header"
import Footer from "../components/footer"
import Controller from "../components/controller"
import StoryFragmentRender from "../components/storyFragmentRender"

import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const useStore = create(set => ({
  panesVisible: { last: null, footer: false },
  update: (key, value) =>
    set(state => ({ panesVisible: { ...state.panesVisible, [key]: value } })),
}))

const StoryFragment = ({
  title,
  storyFragmentPayload,
  impressions,
  viewportKey,
  prefersReducedMotion,
}) => {
  const update = useStore(state => state.update)
  const panesVisible = useStore(state => state.panesVisible)
  const revealContextId = panesVisible?.hasOwnProperty('revealContext') ? panesVisible['revealContext'] : null
  const thisCss = !prefersReducedMotion
    ? `${storyFragmentPayload?.payload?.css || ``} ${storyFragmentPayload?.payload?.cssAnimated || ``
    }`
    : `${storyFragmentPayload?.payload?.css || ``}`
  let impressionPanes = []
  Object.keys(panesVisible).forEach(key => {
    if (panesVisible[key] === true && impressions.hasOwnProperty(key)) {
      if (panesVisible["last"] === key) impressionPanes.unshift(key)
      else impressionPanes.push(key)
    }
  })
  return (
    <>
      <Helmet>
        <script src="/h5p-resizer.js" />
      </Helmet>
      <Header siteTitle={title} />
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
      <InView
        onEnter={() => {
          update("footer", true)
        }}
        onLeave={() => {
          update("footer", false)
        }}
      >
        <Footer />
      </InView>
    </>
  )
}

StoryFragment.propTypes = {
  title: PropTypes.string.isRequired,
  viewportKey: PropTypes.string.isRequired,
  impressions: PropTypes.object.isRequired,
  storyFragmentPayload: PropTypes.object.isRequired,
}

export default StoryFragment
