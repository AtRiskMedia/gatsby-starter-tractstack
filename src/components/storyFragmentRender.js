import React from "react"
import { InView } from "react-cool-inview"
import { classNames } from "gatsby-plugin-tractstack"

const threshold = 22000

const Pane = ({ thisId, children, inView, observe, hasMaxHScreen }) => (
  <div
    id={thisId}
    className={classNames(
      inView ? "pane visible" : "pane hidden",
      "w-full h-full grid grid-rows-1 grid-cols-1",
      hasMaxHScreen ? "max-h-screen" : ""
    )}
    ref={observe}
  >
    {children}
  </div>
)

const StoryFragmentRender = ({
  storyFragmentPayload,
  viewportKey,
  panesVisible,
  updatePanesVisible,
  updateEventStream,
}) => {
  const panes =
    typeof storyFragmentPayload?.panesPayload?.panes === "object" &&
    storyFragmentPayload?.panesPayload?.panes
  const menu = (typeof storyFragmentPayload?.menu === "object" &&
    storyFragmentPayload?.menu) || <></>
  const thisPayload =
    typeof storyFragmentPayload?.panesPayload?.payload === "object" &&
    storyFragmentPayload?.panesPayload?.payload
  const thisStoryFragment =
    typeof panes === "object" &&
    storyFragmentPayload?.storyFragmentPanes?.map(p => {
      const thisPane = thisPayload[p]
      const hasMaxHScreen = thisPane.hasMaxHScreen
      return (
        <section
          key={`${viewportKey}-${p}-wrapper`}
          className="w-full h-fit-content overflow-hidden"
          id={`wrapper-${p}`}
        >
          <InView
            onEnter={() => {
              updatePanesVisible(p, Date.now())
              updatePanesVisible("last", p)
            }}
            onLeave={() => {
              const duration = Date.now() - panesVisible[p]
              if (duration > threshold)
                updateEventStream(Date.now(), {
                  command: "read",
                  payload: { paneId: p, type: "pane", duration: duration },
                })
              updatePanesVisible(p, false)
            }}
          >
            <Pane
              thisId={`${viewportKey}-${p}`}
              children={thisPane?.children}
              hasMaxHScreen={hasMaxHScreen}
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
