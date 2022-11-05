import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import styled from "styled-components"

import Header from "../components/header"
import Footer from "../components/footer"
import Controller from "../components/controller"
import StoryFragmentRender from "../components/storyFragmentRender"

import "../styles/storyfragment.css"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const StoryFragment = ({
  title,
  payload,
  impressions,
  viewportKey,
  prefersReducedMotion,
}) => {
  const [panesArray, setPanesArray] = React.useState([])
  const thisCss = !prefersReducedMotion
    ? `${payload?.payload?.css || ``} ${payload?.payload?.cssAnimated || ``}`
    : `${payload?.payload?.css || ``}`
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
              setPanesArray={setPanesArray}
              panesArray={panesArray}
            />
          </StyledWrapperSection>
        </main>
        <Controller
          panesArray={panesArray}
          impressions={impressions}
          viewportKey={viewportKey}
        />
      </div>
      <Footer />
    </>
  )
}

StoryFragment.propTypes = {
  title: PropTypes.string.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default StoryFragment
