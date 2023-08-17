// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useStoryStepStore } from '../stores/storyStep'
import { IH5PProps } from 'gatsby-plugin-tractstack/types'

const H5P = ({ src, title, parent }: IH5PProps) => {
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const handleContentRef = (dom: any) => {
    if (dom) {
      dom.onload = () => {
        dom?.contentWindow?.H5P?.externalDispatcher?.on(
          `xAPI`,
          function (event: any) {
            console.log(`xAPI`, event)
            const id = event?.data?.statement?.object?.id.slice(-36)
            const verb =
              typeof event?.data?.statement?.verb?.display === `object` &&
              typeof event?.data?.statement?.verb?.display[`en-US`] ===
                `undefined`
                ? event.data.statement.verb.display[`en-US`]
                : ``
            const title =
              typeof event?.data?.statement?.object?.definition?.name ===
                `object` &&
              typeof event?.data?.statement?.object?.definition?.name[
                `en-US`
              ] === `undefined`
                ? event.data.statement.object.definition?.name[`en-US`]
                : ``
            const score = event?.data?.statement?.result?.score?.scaled
            const durationRaw = event?.data?.statement?.result?.duration
            const regex = /PT(\d+\.?\d*)S/g
            const durationParsed = regex?.exec(durationRaw)
            const durationInSeconds =
              durationParsed && typeof durationParsed[1] !== `undefined`
                ? Number(durationParsed[1])
                : null
            updateEventStream(Date.now(), {
              verb,
              id,
              title,
              type: `H5P`,
              targetId: parent,
              duration: durationInSeconds,
              score,
            })
          },
        )
      }
    }
  }
  return (
    <iframe
      id={`H5P-${parent}`}
      title={title}
      ref={handleContentRef}
      src={src}
      allowFullScreen
    />
  )
}

export default H5P
