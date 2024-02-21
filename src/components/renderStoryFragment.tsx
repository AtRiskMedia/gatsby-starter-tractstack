// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { IStoryFragmentRenderProps } from '@tractstack/types'

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

  return (
    <div key={`${viewportKey}-${payload.slug}`} className={tailwindBgColour}>
      {paneIds?.map((p: string) => {
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
      })}
    </div>
  )
}

export default RenderStoryFragment
