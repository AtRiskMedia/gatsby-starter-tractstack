import * as React from "react"
import { InView } from "react-cool-inview"
import { classNames } from "gatsby-plugin-tractstack"

const Pane = ({ thisId, children, inView, observe }) => (
  <div
    id={thisId}
    className={classNames(
      inView ? "pane visible" : "pane hidden",
      "w-full h-full grid grid-rows-1 grid-cols-1"
    )}
    ref={observe}
  >
    {children}
  </div>
)

const StoryFragmentRender = ({ storyFragmentPayload, viewportKey, update }) => {
  const panes =
    typeof storyFragmentPayload?.payload?.panes === "object" &&
    storyFragmentPayload?.payload?.panes
  const menu = (typeof storyFragmentPayload?.menu === "object" &&
    storyFragmentPayload?.menu) || <></>
  const thisPayload =
    typeof storyFragmentPayload?.payload?.payload === "object" &&
    storyFragmentPayload?.payload?.payload
  const thisStoryFragment =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPane = thisPayload[p]
      return (
        <section
          key={`${viewportKey}-${p}-wrapper`}
          className="w-full h-fit-content overflow-hidden"
          id={`${viewportKey}-${p}-wrapper`}
        >
          <InView
            onEnter={() => {
              update(p, true)
              update("last", p)
            }}
            onLeave={() => {
              update(p, false)
            }}
          >
            <Pane
              thisId={`${viewportKey}-${p}`}
              children={thisPane?.children}
            />
          </InView>
        </section>
      )
    })
  const renderedStoryFragment =
    (menu && (
      <>
        {menu}
        {thisStoryFragment}
      </>
    )) ||
    thisStoryFragment
  return renderedStoryFragment
}

export default StoryFragmentRender
