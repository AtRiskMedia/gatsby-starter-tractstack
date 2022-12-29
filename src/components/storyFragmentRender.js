import React from "react"
import { InView } from "react-cool-inview"
import { classNames } from "gatsby-plugin-tractstack"

import { useStoryStepStore } from "../stores/storyStep"
import config from "../../data/SiteConfig"

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

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

const StoryFragmentRender = ({ storyFragmentPayload, viewportKey }) => {
  const panesVisible = useStoryStepStore(state => state.panesVisible)
  const updatePanesVisible = useStoryStepStore(
    state => state.updatePanesVisible
  )
  const updateEventStream = useStoryStepStore(state => state.updateEventStream)
  const contentMap = storyFragmentPayload?.panesPayload?.contentMap
  const panes =
    typeof storyFragmentPayload?.panesPayload?.panes === "object" &&
      typeof contentMap === "object"
      ? Object.keys(contentMap)
      : []
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
              const now = Date.now()
              const duration =
                typeof panesVisible[p] === "number" ? now - panesVisible[p] : 0
              const verb =
                duration > readThreshold
                  ? "read"
                  : duration > softReadThreshold
                    ? "glossedOver"
                    : null
              if (verb)
                updateEventStream(now, {
                  verb: verb,
                  object_name: contentMap[p],
                  object_id: p,
                  object_type: "pane",
                  duration: duration / 1000,
                  tractStackId: contentMap[p].tractStackId,
                  tractStackSlug: contentMap[p].tractStackSlug,
                  storyFragmentId: contentMap[p].tractStackId,
                  storyFragmentSlug: contentMap[p].tractStackSlug,
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
