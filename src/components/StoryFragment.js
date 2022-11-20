import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import styled from "styled-components"
import create from "zustand"

import Header from "../components/header"
import Footer from "../components/footer"
import Controller from "../components/controller"
import StoryFragmentRender from "../components/storyFragmentRender"

import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const useStore = create(set => ({
  panesVisible: { last: null },
  update: (key, value) =>
    set(state => ({ panesVisible: { ...state.panesVisible, [key]: value } })),
}))

const StoryFragment = ({
  title,
  payload,
  impressions,
  viewportKey,
  prefersReducedMotion,
}) => {
  const update = useStore(state => state.update)
  const panesVisible = useStore(state => state.panesVisible)
  const thisCss = !prefersReducedMotion
    ? `${payload?.payload?.css || ``} ${payload?.payload?.cssAnimated || ``}`
    : `${payload?.payload?.css || ``}`
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
              payload={payload}
              viewportKey={viewportKey}
              update={update}
            />
          </StyledWrapperSection>
        </main>
        {impressionPanes.length ? (
          <Controller
            impressions={impressions}
            impressionPanes={impressionPanes}
            viewportKey={viewportKey}
          />
        ) : (<></>)}
      </div>
      <Footer />
    </>
  )
}

StoryFragment.propTypes = {
  title: PropTypes.string.isRequired,
  viewportKey: PropTypes.string.isRequired,
  impressions: PropTypes.object.isRequired,
  payload: PropTypes.object.isRequired,
}

export default StoryFragment
