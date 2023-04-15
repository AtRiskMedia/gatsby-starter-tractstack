// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { InView } from 'react-cool-inview'
import { classNames } from 'gatsby-plugin-tractstack'
import IframeResizer from 'iframe-resizer-react'

import { config } from '../../data/SiteConfig'
import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import Footer from './Footer'
import Product from '../shopify-components/Product'
import H5P from './H5P'
import codeHooks from '../custom/codehooks'
import {
  ICodeHookProps,
  ICodeHookIframeProps,
  ICodeHookShopifyProps,
  IPaneProps,
  IStoryFragmentRenderProps,
} from '../types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

const Pane = ({
  thisId,
  children,
  inView,
  observe,
  hasMaxHScreen,
}: IPaneProps) => (
  <div
    id={thisId}
    key={thisId}
    className={classNames(
      inView ? `pane visible` : `pane hidden`,
      `w-full h-full grid grid-rows-1 grid-cols-1`,
      hasMaxHScreen ? `max-h-screen` : ``,
    )}
    ref={observe}
  >
    {children}
  </div>
)

const CodeHook = ({
  thisId,
  payload,
  viewportKey,
  storyFragmentId,
}: ICodeHookProps) => {
  const ThisCodeHook =
    typeof codeHooks[payload.target] !== `undefined`
      ? codeHooks[payload.target]
      : null
  const children = (
    <ThisCodeHook viewportKey={viewportKey} storyFragmentId={storyFragmentId} />
  )
  return (
    <div id={`${thisId}-hook`} className="paneFragment paneFragmentCode">
      {children}
    </div>
  )
}
const CodeHookShopify = ({ thisId, payload }: ICodeHookShopifyProps) => {
  return (
    <div
      id={`${thisId}-hook`}
      className="paneFragment paneFragmentCode paneFragmentShopify my-16"
    >
      <Product payload={payload} />
    </div>
  )
}
const CodeHookIframe = ({
  thisId,
  payload,
  viewportKey,
}: ICodeHookIframeProps) => {
  const children =
    payload.target === `h5p` ? (
      <H5P
        parent={thisId}
        src={payload.url}
        title={`H5P iframe embed - ${viewportKey}`}
      />
    ) : payload.target === `iframe` ? (
      <IframeResizer
        title="iframe embed"
        src={payload.url}
        frameBorder="0"
        checkOrigin={false}
        autoResize={true}
        scrolling={false}
        width="100%"
        style={{
          border: 0,
          width: `1px`,
          minWidth: `100%`,
        }}
      />
    ) : null
  return (
    <div
      id={`${thisId}-hook`}
      className={classNames(
        `paneFragment paneFragmentCode my-16`,
        payload.target === `iframe` || payload.target === `h5p`
          ? `w-full mx-auto px-4 md:max-w-3xl lg:max-w-5xl`
          : ``,
      )}
    >
      {children}
    </div>
  )
}

const StoryFragmentRender = ({
  viewportKey,
  payload,
  storyFragmentId,
}: IStoryFragmentRenderProps) => {
  const [loaded, setLoaded] = useState(false)
  const beliefs = useAuthStore((state) => state.beliefs)
  const panesVisible = useStoryStepStore((state) => state.panesVisible)
  const updatePanesVisible = useStoryStepStore(
    (state) => state.updatePanesVisible,
  )
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const storyFragment = payload?.storyFragment[`${viewportKey}-${payload.id}`]
  const storyFragmentPayload: any = payload.contentMap[payload.id]
  const tailwindBgColour =
    typeof storyFragmentPayload?.tailwindBgColour === `string`
      ? storyFragmentPayload.tailwindBgColour
      : ``
  const paneIds = storyFragment?.paneIds
  const thisStoryFragment = paneIds?.map((p: string) => {
    const thisPane = payload.contentMap[p]
    const thisId = `${viewportKey}-${p}`
    const hasCodeHook: any = thisPane.hasCodeHook
    const thisPaneChildren =
      hasCodeHook?.target &&
      (hasCodeHook.target === `h5p` || hasCodeHook.target === `iframe`) ? (
        <CodeHookIframe
          thisId={thisId}
          payload={hasCodeHook}
          viewportKey={viewportKey}
        />
      ) : hasCodeHook?.target && hasCodeHook.target === `shopify` ? (
        <CodeHookShopify thisId={thisId} payload={hasCodeHook} />
      ) : hasCodeHook?.target ? (
        <CodeHook
          thisId={thisId}
          payload={hasCodeHook}
          viewportKey={viewportKey}
          storyFragmentId={storyFragmentId}
        />
      ) : (
        payload.contentChildren[`${viewportKey}-${p}`]
      )
    const heldBeliefs =
      typeof thisPane?.heldBeliefs === `object` ? thisPane.heldBeliefs : null
    const withheldBeliefs =
      typeof thisPane?.withheldBeliefs === `object`
        ? thisPane.withheldBeliefs
        : null
    const hasMaxHScreen =
      typeof thisPane?.hasMaxHScreen === `boolean`
        ? thisPane.hasMaxHScreen
        : false

    if (heldBeliefs && Object.keys(heldBeliefs)?.length) {
      let filter = true
      let voidOverride = false
      let override = false
      Object.entries(heldBeliefs).forEach(([key, value]) => {
        if (typeof value === `boolean` && typeof beliefs[key] === `undefined`)
          override = true
        else if (
          typeof value === `boolean` &&
          typeof beliefs[key] !== `undefined`
        )
          voidOverride = true

        if (
          typeof value === `string` &&
          typeof beliefs[key] === `string` &&
          beliefs[key] === value
        )
          filter = false
        else if (typeof value === `object`) {
          const values: any = value
          Object.values(values).forEach((b) => {
            if (typeof beliefs[key] === `string` && beliefs[key] === b)
              filter = false
          })
        }
      })
      if (!(!voidOverride && override) && filter) return null
    }
    if (withheldBeliefs && Object.keys(withheldBeliefs)?.length) {
      let filter = false
      Object.entries(withheldBeliefs).forEach(([key, value]) => {
        if (typeof beliefs[key] !== `string`) filter = true
        else if (typeof beliefs[key] === `string` && beliefs[key] === value)
          filter = true
        else if (typeof value === `object`) {
          const values: any = value
          Object.values(values).forEach((b) => {
            if (typeof beliefs[key] === `string` && beliefs[key] === b)
              filter = true
          })
        }
      })
      if (filter) return null
    }

    return (
      <section
        key={`${viewportKey}-${p}-wrapper`}
        className="w-full h-fit-content overflow-hidden"
        id={`wrapper-${viewportKey}-${p}`}
      >
        <InView
          onEnter={() => {
            updatePanesVisible(p, Date.now())
          }}
          onLeave={() => {
            const now = Date.now()
            const duration =
              typeof panesVisible[p] === `number` ? now - panesVisible[p] : 0
            const verb =
              duration > readThreshold
                ? `read`
                : duration > softReadThreshold
                ? `glossed`
                : null
            if (verb) {
              const eventPayload = {
                verb,
                id: p,
                type: `Pane`,
                duration: duration / 1000,
              }
              updateEventStream(now, eventPayload)
            }
            updatePanesVisible(p, false)
          }}
        >
          <Pane thisId={thisId} hasMaxHScreen={hasMaxHScreen}>
            {thisPaneChildren}
          </Pane>
        </InView>
      </section>
    )
  })

  useEffect(() => {
    if (
      typeof thisStoryFragment !== `undefined` &&
      thisStoryFragment.length === paneIds?.length &&
      thisStoryFragment.length > 0
    )
      setLoaded(true)
  }, [thisStoryFragment, paneIds, loaded, setLoaded])

  return loaded ? (
    <div key={`${viewportKey}-${payload.slug}`} className={tailwindBgColour}>
      {payload?.menu ? payload?.menu : null}
      {thisStoryFragment}
      <Footer />
    </div>
  ) : (
    <div
      id="loading"
      className="flex flex-row justify-center items-center h-screen w-screen"
    >
      Loading...
    </div>
  )
}

export default StoryFragmentRender
