// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { XMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { concierge, lispLexer, useInterval } from '@tractstack/helpers'
import { IImpressionProps, IControllerProps } from '@tractstack/types'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'

const impressionsDelay = config.impressionsDelay

const Impression = ({ payload }: IImpressionProps) => {
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const thisButtonPayload = lispLexer(payload.actionsLisp)

  function injectPayload() {
    const now = Date.now()
    const eventPayload = {
      verb: `CLICKED`,
      id: payload.id,
      title: payload.title,
      type: `Impression`,
      targetId: payload.parentId,
    }
    updateEventStream(now, eventPayload)
    concierge(thisButtonPayload, {
      processRead,
    })
  }

  if (typeof payload !== `object`) return <></>
  return (
    <>
      <h3 className="text-md font-action leading-6 text-allblack">
        {payload.title}
      </h3>
      <div className="mt-2 sm:flex sm:items-start sm:justify-between">
        <div className="max-w-xl text-sm text-allblack">
          <p>
            {payload.body}
            {` `}
            <button
              type="button"
              onClick={injectPayload}
              className="underline underline-offset-4 text-allblack hover:text-orange"
            >
              {payload.buttonText}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}

const Controller = ({
  impressions,
  impressionPanes,
  viewportKey,
}: IControllerProps) => {
  const [offset, setOffset] = React.useState(0)
  const controllerOverride = useStoryStepStore(
    (state) => state.controllerOverride,
  )
  const setControllerOverride = useStoryStepStore(
    (state) => state.setControllerOverride,
  )

  useInterval(() => {
    if (impressionPanes.length > offset + 1) setOffset(offset + 1)
    else setOffset(0)
  }, impressionsDelay)
  if (typeof impressions === `undefined`) return null
  const offsetImpression: any =
    impressions && typeof impressionPanes[offset] !== `undefined`
      ? impressions[impressionPanes[offset]]
      : impressions
        ? impressions[impressionPanes[0]]
        : null
  const thisImpression: any =
    typeof offsetImpression === `object` &&
    offsetImpression !== null &&
    typeof offsetImpression[0] === `object`
      ? offsetImpression[0]
      : null

  if (!thisImpression) return null

  if (controllerOverride)
    return (
      <aside id="controller" className="mr-1">
        <div
          className={`z-90101 overflow-hidden bg-white rounded-md border border-darkgrey controller__expanded controller__expanded--${viewportKey}`}
        >
          <div className="px-4 pt-4">
            <button
              type="button"
              className="z-90101 absolute right-2 top-2 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setControllerOverride(!controllerOverride)}
            >
              <span className="sr-only">Hide controller</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <Impression payload={thisImpression} />
          </div>
        </div>
      </aside>
    )
  return (
    <div
      className={`z-90101 relative controller__minimized controller_minimized--${viewportKey}`}
    >
      <button
        type="button"
        className="z-90101 rounded-md bg-lightgrey text-allblack hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => setControllerOverride(!controllerOverride)}
      >
        <span className="sr-only">Show controller</span>
        <ArrowsPointingOutIcon className="h-8 w-8" aria-hidden="true" />
        <span className="z-90101 absolute -top-5 -left-4 h-6 w-6 rounded-full bg-allwhite text-black flex justify-center items-center items">
          {impressionPanes.length}
        </span>
      </button>
    </div>
  )
}

export default Controller
