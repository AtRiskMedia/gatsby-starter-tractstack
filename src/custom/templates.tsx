// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { ITemplateDict } from '../types'
import { ParseOptions, lispLexer, classNames } from 'gatsby-plugin-tractstack'
import { BoltIcon } from '@heroicons/react/20/solid'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'

function ToggleBeliefGrid(
  payload: any,
  id: any, // FIX
  viewportKey: string,
  hooks: any,
) {
  const beliefs = useAuthStore((state) => state.beliefs)
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)
  const concierge = hooks?.concierge
  const setScrollToPane = hooks?.setScrollToPane
  const length = Object.keys(payload)?.length
  const defaultCols =
    viewportKey === `mobile` ? 2 : viewportKey === `tablet` ? 3 : 4
  const thisCols = length < defaultCols ? length : defaultCols
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
    const title = thisPayload?.title
    const optionsPayload =
      typeof thisPayload?.field_options === `string`
        ? ParseOptions(thisPayload.field_options)
        : null
    const paneTarget = optionsPayload?.paneTarget
    const identifyAsId = optionsPayload?.identifyAs?.id
    const identifyAsSlug = optionsPayload?.identifyAs?.slug
    const identifyAsObject = optionsPayload?.identifyAs?.target
    const matchedBelief =
      identifyAsSlug && beliefs && beliefs[identifyAsSlug] === identifyAsObject
    const hasArtpack = optionsPayload?.artpack
    const hasArtpackAll = hasArtpack && hasArtpack.all
    const hasArtpackViewport =
      hasArtpack && typeof hasArtpack[viewportKey] !== `undefined`
    const artpack = hasArtpackAll
      ? hasArtpack.all
      : hasArtpackViewport
      ? hasArtpack[viewportKey]
      : null
    const artpackFiletype = artpack?.filetype
    const artpackCollection = artpack?.collection
    const artpackImage = artpack?.image
    const size = viewportKey === `desktop` ? `800` : `400`
    const injectPayload = function (): void {
      updateBeliefs(identifyAsSlug, identifyAsObject.toUpperCase())
      pushEvent(
        {
          verb: `IDENTIFY_AS`,
          id: identifyAsId,
          title: identifyAsSlug,
          object: identifyAsObject.toUpperCase(),
          type: `Belief`,
        },
        id,
      )
      if (paneTarget) setScrollToPane(paneTarget)
      if (concierge && actionLisp) concierge(actionLisp, hooks, id.id)
    }

    return (
      <li key={`${id.id}-${idx}`}>
        <div className="group aspect-h-10 aspect-w-16 block w-full overflow-hidden">
          <button onClick={injectPayload} className="group relative">
            <div
              className={classNames(
                matchedBelief
                  ? `-rotate-1 scale-95`
                  : `group-hover:-rotate-1 scale-90 group-hover:scale-95`,
                `mb-2 transition duration-50 pointer-events-none object-cover`,
              )}
            >
              {!matchedBelief ? (
                <div className="absolute bg-lightgrey w-full h-full z-0 rounded-xl scale-105 motion-safe:animate-pulse opacity-25" />
              ) : null}
              <img
                className="rounded-xl relative z-50"
                src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
                title={oneliner}
              />
            </div>
            <p
              className={classNames(
                matchedBelief
                  ? `text-orange text-left`
                  : `text-blue group-hover:text-orange text-right`,
                `font-main text-lg md:text-xl tracking-tight font-bold px-6`,
              )}
            >
              {matchedBelief ? <BoltIcon className="h-6 w-6 inline" /> : null}
              {` `}
              {title}
            </p>
          </button>
        </div>
      </li>
    )
  })
  return (
    <ul
      key={id.id}
      role="list"
      className={`grid grid-cols-${thisCols} gap-x-4 gap-y-8`}
    >
      {rendered}
    </ul>
  )
}

function MenuGrid(payload: any, id: any, viewportKey: string, hooks: any) {
  const concierge = hooks?.concierge
  const length = Object.keys(payload)?.length
  const defaultCols =
    viewportKey === `mobile` ? 2 : viewportKey === `tablet` ? 3 : 4
  const thisCols = length < defaultCols ? length : defaultCols
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
    const title = thisPayload?.title
    const optionsPayload =
      typeof thisPayload?.field_options === `string`
        ? ParseOptions(thisPayload.field_options)
        : null
    const hasArtpack = optionsPayload?.artpack
    const hasArtpackAll = hasArtpack && hasArtpack.all
    const hasArtpackViewport =
      hasArtpack && typeof hasArtpack[viewportKey] !== `undefined`
    const artpack = hasArtpackAll
      ? hasArtpack.all
      : hasArtpackViewport
      ? hasArtpack[viewportKey]
      : null
    const artpackFiletype = artpack?.filetype
    const artpackCollection = artpack?.collection
    const artpackImage = artpack?.image
    const size = viewportKey === `desktop` ? `800` : `400`
    const injectPayload = function (): void {
      if (concierge) concierge(actionLisp, hooks, id.id)
    }
    return (
      <li key={`${id.id}-${idx}`}>
        <div className="group aspect-h-10 aspect-w-16 block w-full overflow-hidden">
          <button onClick={injectPayload} className="group">
            <div className="mb-2 rounded-xl group-hover:-rotate-1 scale-90 group-hover:scale-95 transition duration-50 pointer-events-none object-cover relative">
              <div className="absolute bg-lightgrey w-full h-full z-0 rounded-xl scale-105 motion-safe:animate-pulse opacity-25" />
              <img
                className="rounded-xl z-50 relative"
                src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
                title={oneliner}
              />
            </div>
            <p className="font-main text-lg md:text-xl tracking-tight text-blue group-hover:text-orange z-50 relative">
              {title}
            </p>
          </button>
        </div>
      </li>
    )
  })
  return (
    <ul
      key={id.id}
      role="list"
      className={`grid grid-cols-${thisCols} gap-x-4 gap-y-8`}
    >
      {rendered}
    </ul>
  )
}

function MenuItem(payload: any, id: any, viewportKey: string, hooks: any) {
  const concierge = hooks?.concierge
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
    const title = thisPayload?.title
    const optionsPayload =
      typeof thisPayload?.field_options === `string`
        ? ParseOptions(thisPayload.field_options)
        : null
    const hasArtpack = optionsPayload?.artpack
    const hasArtpackAll = hasArtpack && hasArtpack.all
    const hasArtpackViewport =
      hasArtpack && typeof hasArtpack[viewportKey] !== `undefined`
    const artpack = hasArtpackAll
      ? hasArtpack.all
      : hasArtpackViewport
      ? hasArtpack[viewportKey]
      : null
    const artpackFiletype = artpack?.filetype
    const artpackCollection = artpack?.collection
    const artpackImage = artpack?.image
    const size =
      viewportKey === `desktop`
        ? `800`
        : viewportKey === `tablet`
        ? `400`
        : `200`
    const injectPayload = function (): void {
      if (concierge) concierge(actionLisp, hooks, id.id)
    }
    return (
      <li key={`${id.id}-${idx}`}>
        <button onClick={injectPayload} className="group">
          <img
            className="mb-2 rounded-xl group-hover:-rotate-1 scale-90 group-hover:scale-95 transition duration-50"
            src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
            title={oneliner}
          />
          <h2 className="font-action text-lg tracking-tight text-blue group-hover:text-orange">
            {title}
          </h2>
        </button>
      </li>
    )
  })
  return <ul key={id.id}>{rendered}</ul>
}

interface IInjectComponentProps {
  target: string
  id: string
}

function InjectComponent({ target, id }: IInjectComponentProps) {
  switch (target) {
    case `logo`:
      return (
        <div key={id} className="mx-auto w-fit max-w-xs">
          <div className="flex flex-col w-fit">
            <Logo className="h-12 mb-2" />
            <Wordmark className="h-8 fill-black" />
          </div>
          <p className="mt-6 text-2xl text-darkgrey">
            intelligent no-code websites & landing pages that validate
            product-market-fit
          </p>
        </div>
      )

    default:
      break
  }
}

const templates: ITemplateDict = {
  menugrid: MenuGrid,
  menuitem: MenuItem,
  togglebeliefgrid: ToggleBeliefGrid,
  injectComponent: InjectComponent,
}

export default templates
