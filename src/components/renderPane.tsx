// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { InView } from 'react-cool-inview'
import { classNames } from 'gatsby-plugin-tractstack'
import IframeResizer from 'iframe-resizer-react'
import { XCircleIcon } from '@heroicons/react/24/outline'

import { config } from '../../data/SiteConfig'
import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import Product from '../shopify-components/Product'
import H5P from './H5P'
import codeHooks from '../custom/codehooks'
import {
  ICodeHookProps,
  ICodeHookIframeProps,
  ICodeHookShopifyProps,
  IPaneProps,
  IRenderPaneProps,
} from 'gatsby-plugin-tractstack/types'

const readThreshold = config.readThreshold
const softReadThreshold = config.softReadThreshold

const Pane = ({
  thisId,
  children,
  inView,
  observe,
  hasMaxHScreen,
  hasOverflowHidden,
}: IPaneProps) => (
  <div
    id={thisId}
    key={thisId}
    className={classNames(
      inView ? `pane visible` : `pane hidden`,
      `w-full h-full grid grid-rows-1 grid-cols-1`,
      hasMaxHScreen ? `max-h-screen` : ``,
      hasOverflowHidden ? `overflow-hidden` : ``,
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
    <div
      id={`${thisId}-hook`}
      className="paneFragment paneFragmentCode overflow-hidden"
    >
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

const RenderPane = ({
  viewportKey,
  payload,
  paneId,
  storyFragmentId,
}: IRenderPaneProps) => {
  const [withhold, setWithhold] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const beliefs = useAuthStore((state) => state.beliefs)
  const unsetBelief = useAuthStore((state) => state.unsetBelief)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)
  const withheldPanes = useStoryStepStore((state) => state.withheldPanes)
  const toggleWithheldPanes = useStoryStepStore(
    (state) => state.toggleWithheldPanes,
  )
  const panesVisible = useStoryStepStore((state) => state.panesVisible)
  const setPanesRevealed = useStoryStepStore((state) => state.setPanesRevealed)
  const updatePanesVisible = useStoryStepStore(
    (state) => state.updatePanesVisible,
  )
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const p = paneId
  const thisPane = payload.panePayload
  const thisId = `${viewportKey}-${p}`
  const hasCodeHook: any = thisPane.hasCodeHook
  const hasHiddenPane: any = thisPane.hasHiddenPane
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
        storyFragmentId={{
          ...storyFragmentId,
          paneId: p,
          paneTitle: thisPane.title,
          paneSlug: thisPane.slug,
        }}
      />
    ) : (
      payload.children
    )
  const heldBeliefs =
    typeof thisPane?.heldBeliefs === `object` ? thisPane.heldBeliefs : null
  const withheldBeliefs =
    typeof thisPane?.withheldBeliefs === `object`
      ? thisPane.withheldBeliefs
      : null
  const boundBelief = heldBeliefs ? Object.keys(heldBeliefs)[0] : null
  const hasMaxHScreen =
    typeof thisPane?.hasMaxHScreen === `boolean`
      ? thisPane.hasMaxHScreen
      : false
  const hasOverflowHidden =
    typeof thisPane?.hasOverflowHidden === `boolean`
      ? thisPane.hasOverflowHidden
      : false

  const doUnsetBelief = function(): void {
    unsetBelief(boundBelief)
    pushEvent(
      {
        verb: `UNSET`,
        id: boundBelief,
        title: ``,
        type: `Belief`,
      },
      storyFragmentId,
    )
  }

  useEffect(() => {
    let override = false
    let dontshow = false
    if (heldBeliefs && Object.keys(heldBeliefs)?.length) {
      override = true
      Object.entries(heldBeliefs).forEach(([key, value]) => {
        if (typeof beliefs[key] === `undefined`) override = true
        if (
          typeof value === `string` &&
          typeof beliefs[key] === `string` &&
          beliefs[key] === value
        ) {
          override = false
        } else if (
          typeof value === `string` &&
          typeof value === `string` &&
          value === `*` &&
          typeof beliefs[key] === `string`
        ) {
          override = false
        } else if (
          typeof value === `object` &&
          typeof beliefs[key] === `string`
        ) {
          const values: any = value
          Object.values(values).forEach((b) => {
            if (typeof beliefs[key] === `string` && beliefs[key] === b) {
              override = false
            }
          })
        }
      })
    }
    if (override) dontshow = true
    override = false
    if (withheldBeliefs && Object.keys(withheldBeliefs)?.length) {
      Object.entries(withheldBeliefs).forEach(([key, value]) => {
        if (!(value === `*`)) {
          if (
            typeof value === `string` &&
            typeof beliefs[key] === `string` &&
            value === `*`
          )
            override = true
          else if (
            typeof value === `string` &&
            typeof beliefs[key] === `string` &&
            beliefs[key] === value
          )
            override = true
          else if (typeof value === `object`) {
            const values: any = value
            Object.values(values).forEach((b) => {
              if (typeof beliefs[key] === `undefined` && b === `UNSET`)
                override = true
              if (
                b !== `UNSET` &&
                typeof beliefs[key] === `string` &&
                beliefs[key] === b
              )
                override = true
            })
          }
        } else if (typeof beliefs[key] !== `undefined`) override = true
      })
    }
    if (override) dontshow = true
    if (
      dontshow &&
      (typeof withheldPanes[p] === `undefined` ||
        (typeof withheldPanes[p] === `boolean` && !withheldPanes[p]))
    ) {
      setWithhold(true)
      toggleWithheldPanes(p, true)
    } else if (
      !dontshow &&
      typeof withheldPanes[p] === `boolean` &&
      withheldPanes[p]
    ) {
      setWithhold(false)
      toggleWithheldPanes(p, false)
      setPanesRevealed(true)
    } else if (dontshow) setWithhold(true)
    setLoaded(true)
  }, [
    p,
    toggleWithheldPanes,
    withheldPanes,
    beliefs,
    heldBeliefs,
    thisPane.title,
    withheldBeliefs,
    setPanesRevealed,
    thisPane.slug,
  ])

  if (
    !loaded &&
    ((heldBeliefs && Object.keys(heldBeliefs).length) ||
      (withheldBeliefs && Object.keys(withheldBeliefs).length))
  )
    return null
  if (withhold) return null

  return (
    <section
      key={`${viewportKey}-${p}-wrapper`}
      className="w-full h-fit-content relative"
      id={`wrapper-${viewportKey}-${p}`}
    >
      <>
        {boundBelief ? (
          <button
            onClick={() => doUnsetBelief()}
            title="Close"
            className="absolute top-2 right-2 z-80030"
          >
            <XCircleIcon className="w-8 h-8 text-black/20 hover:text-blue" />
          </button>
        ) : null}

        <InView
          onEnter={() => {
            if (!hasHiddenPane) updatePanesVisible(p, Date.now())
          }}
          onLeave={() => {
            if (!hasHiddenPane) {
              const now = Date.now()
              const duration =
                typeof panesVisible[p] === `number` ? now - panesVisible[p] : 0
              const verb =
                duration > readThreshold
                  ? `READ`
                  : duration > softReadThreshold
                    ? `GLOSSED`
                    : null
              if (verb) {
                const eventPayload = {
                  verb,
                  id: p,
                  type: `Pane`,
                  duration: duration / 1000,
                  parentId: storyFragmentId.id,
                }
                updateEventStream(now, eventPayload)
              }
              updatePanesVisible(p, false)
            }
          }}
        >
          <Pane
            thisId={thisId}
            hasMaxHScreen={hasMaxHScreen}
            hasOverflowHidden={hasOverflowHidden}
          >
            {thisPaneChildren}
          </Pane>
        </InView>
      </>
    </section>
  )
}

export default RenderPane
