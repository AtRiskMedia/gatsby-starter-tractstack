import * as React from "react"

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
        //console.log( thisPaneId, thisPaneFragmentId, jsx, css, cssModal, cssAnimated, cssAnimatedContainer, impressions )
        // inject css and stuff
        return jsx
      })
      return (
        <section key={`${viewportKey}-${p}`} id={`${viewportKey}-${p}`}>
          {paneFragments}
        </section>
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
