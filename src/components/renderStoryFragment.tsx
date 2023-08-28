// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect } from 'react'
import { IStoryFragmentRenderProps } from 'gatsby-plugin-tractstack/types'
import { ArrowDownIcon } from '@heroicons/react/24/outline'

import Footer from './Footer'
import RenderPane from './renderPane'
import { useStoryStepStore } from '../stores/storyStep'

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
  const panesRevealed = useStoryStepStore((state) => state.panesRevealed)
  const setPanesRevealed = useStoryStepStore((state) => state.setPanesRevealed)

  useEffect(() => {
    if (panesRevealed) {
      setTimeout(() => {
        setPanesRevealed(false)
      }, 2500)
    }
  }, [panesRevealed, setPanesRevealed])

  return (
    <div key={`${viewportKey}-${payload.slug}`} className={tailwindBgColour}>
      {panesRevealed ? (
        <>
          <div className="z-70010 fixed bottom-0 left-0 w-full h-2 bg-green motion-safe:animate-ping opacity-50" />
          <div className="z-70010 fixed bottom-4 right-4 text-3xl text-allblack font-action">
            <ArrowDownIcon className="w-12 h-12 text-darkgrey motion-safe:animate-pulse opacity-10" />
          </div>
        </>
      ) : null}
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
