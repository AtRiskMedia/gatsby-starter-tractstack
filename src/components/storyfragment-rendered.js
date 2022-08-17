import * as React from "react"
import styled from "styled-components"

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

function RenderedStoryFragment(props) {
  const viewportKey = props.viewportKey
  const panes =
    typeof props?.payload?.payload?.panes === "object" &&
    props.payload.payload.panes
  const menu = (typeof props?.payload?.menu === "object" &&
    props.payload.menu) || <></>
  const thisPayload =
    typeof props?.payload?.payload?.payload === "object" &&
    props.payload.payload.payload
  const rendering =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPanesObject = Object.entries(thisPayload).filter(
        ([id, f]) => f.paneId === p
      )
      const paneJsx = thisPanesObject?.map(f => {
        return f[1].jsx
      })
      const paneCss = thisPanesObject?.map(f => {
        const thisCss = (f[0] && f[1]?.css && `#${f[0]} {${f[1].css}}`) || ``
        const thisCssModal =
          (f[0] && f[1]?.cssModal && `#${f[0]} {${f[1].cssModal}}`) || ``
        const thisCssAnimated =
          f[0] && f[1]?.cssAnimated && `#${f[0]}.visible {${f[1].cssAnimated}}`
        const thisCssAnimatedContainer =
          f[1]?.paneId &&
          f[1]?.cssAnimatedContainer &&
          `#${f[1].paneId}.visible {${f[1].cssAnimatedContainer}}`
        return `${thisCss}${thisCssModal}${thisCssAnimated}${thisCssAnimatedContainer}`.replace(
          /\s+/g,
          ""
        )
      })
      /*
      const paneFragments = thisPanesObject?.map(f => {
        const thisPaneFragmentId = f[0]
        const thisPanesPayload = f[1]
        const thisPaneId = thisPanesPayload.paneId
        const jsx = thisPanesPayload.jsx
        const css = thisPanesPayload.css
        const cssModal = thisPanesPayload.cssModal
        const cssAnimated = thisPanesPayload.cssAnimated
        const cssAnimatedContainer = thisPanesPayload.cssAnimatedContainer
        const impressions = thisPanesPayload.impressions
        const thisCss = `background:red;`
        console.log(
          thisPaneId,
          thisPaneFragmentId,
          css,
          cssModal,
          cssAnimated,
          cssAnimatedContainer,
          impressions
        )
        // inject css and stuff
        return { jsx: jsx, css: css, cssAnimated:  }
      })
      const paneJsx = paneFragments.map(p => {
        return p.jsx
      })
      const paneCss = paneFragments.map(p => {
        return p.css
      })
      */
      // separate object to two arrays
      //
      return (
        <StyledWrapperSection
          key={`${viewportKey}-${p}`}
          id={`${viewportKey}-${p}`}
          className="pane"
          css={`
            ${paneCss}
          `}
        >
          {paneJsx}
        </StyledWrapperSection>
      )
    })
  const rendered =
    (menu && (
      <>
        {menu}
        {rendering}
      </>
    )) ||
    rendering
  return rendered
}

export default RenderedStoryFragment
