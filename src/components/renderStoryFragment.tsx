// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { IStoryFragmentRenderProps } from 'gatsby-plugin-tractstack/types'

import Footer from './Footer'
import RenderPane from './renderPane'
// import { useStoryStepStore } from '../stores/storyStep'

const RenderStoryFragment = ({
  viewportKey,
  payload,
  storyFragmentId,
}: IStoryFragmentRenderProps) => {
  const storyFragment = payload?.storyFragment[`${viewportKey}-${payload.id}`]
  const storyFragmentPayload: any = payload.contentMap[payload.id]
  const tailwindBgColour =
    typeof storyFragmentPayload?.tailwindBgColour === `string`
      ? storyFragmentPayload.tailwindBgColour
      : ``
  const paneIds = storyFragment?.paneIds
  // const panesRevealed = useStoryStepStore((state) => state.panesRevealed)
  // const setPanesRevealed = useStoryStepStore((state) => state.setPanesRevealed)

  /*
  useEffect(() => {
    if (panesRevealed) {
      setTimeout(() => {
        setPanesRevealed(false)
      }, 2500)
    }
  }, [panesRevealed, setPanesRevealed])

      {panesRevealed ? (
        <div className="z-70010 fixed bottom-0 left-0 w-full h-8 bg-green motion-safe:animate-ping" />
      ) : null}
*/

  return (
    <div key={`${viewportKey}-${payload.slug}`} className={tailwindBgColour}>
      {payload?.menu ? payload?.menu : null}
      {paneIds
        ?.map((p: string) => {
          return (
            <RenderPane
              key={p}
              payload={{
                panePayload: payload.contentMap[p],
                children: payload.contentChildren[`${viewportKey}-${p}`],
              }}
              paneId={p}
              viewportKey={viewportKey}
              storyFragmentId={storyFragmentId}
            />
          )
        })
        .concat(<Footer key="footer" />)}
    </div>
  )
}

export default RenderStoryFragment
