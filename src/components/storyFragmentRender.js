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

const StoryFragmentRender = ({
  payload,
  viewportKey,
  setPanesArray,
  panesArray,
}) => {
  const panes =
    typeof payload?.payload?.panes === "object" && payload?.payload?.panes
  const menu = (typeof payload?.menu === "object" && payload?.menu) || <></>
  const thisPayload =
    typeof payload?.payload?.payload === "object" && payload?.payload?.payload
  const thisStoryFragment =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPane = thisPayload[p]
      return (
        <section
          className="w-full h-fit-content overflow-hidden"
          id={`${viewportKey}-${p}`}
          key={`${viewportKey}-${p}`}
        >
          <InView
            onEnter={() => {
              if (panesArray.indexOf(p) === -1)
                setPanesArray([p, ...panesArray])
            }}
            onLeave={() => {
              const thisIndex = panesArray.indexOf(p)
              if (thisIndex) {
                setPanesArray(panesArray =>
                  panesArray.filter((e, i) => i !== thisIndex)
                )
              }
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
