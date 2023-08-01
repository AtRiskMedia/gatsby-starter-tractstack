// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { ITemplateDict } from '../types'
import { ParseOptions, lispLexer, classNames } from 'gatsby-plugin-tractstack'
import { BoltIcon, PlayIcon } from '@heroicons/react/20/solid'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'

function ToggleBeliefTags(
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
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
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
    const injectPayload = function (): void {
      if (!matchedBelief) {
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
      }
      if (paneTarget) setScrollToPane(paneTarget)
      if (concierge && actionLisp) concierge(actionLisp, hooks, id.id)
    }
    return (
      <button
        key={`${id.id}-${idx}`}
        onClick={injectPayload}
        className={classNames(
          matchedBelief
            ? `-rotate-1 scale-95 bg-blue text-allwhite`
            : `hover:-rotate-1 scale-90 hover:scale-95 bg-allwhite text-blue`,
          `transition duration-50 inline-flex items-center rounded-md px-4 py-2 text-lg font-main m-2`,
        )}
      >
        {matchedBelief ? (
          <span className="mr-2">
            <BoltIcon className="h-6 w-6 inline" />
          </span>
        ) : null}
        {oneliner}
      </button>
    )
  })
  return <div key={id.id}>{rendered}</div>
}

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
                `font-main text-lg leading-5 tracking-tight font-bold px-6`,
              )}
            >
              {matchedBelief ? <BoltIcon className="h-6 w-6 inline" /> : null}
              {` `}
              {oneliner}
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
              {oneliner}
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
            {oneliner}
          </h2>
        </button>
      </li>
    )
  })
  return <ul key={id.id}>{rendered}</ul>
}

function VideoItem(payload: any, id: any, viewportKey: string, hooks: any) {
  const [playing, setPlaying] = useState<boolean>(false)
  const concierge = hooks?.concierge
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
    const optionsPayload =
      typeof thisPayload?.field_options === `string`
        ? ParseOptions(thisPayload.field_options)
        : null
    const videoPath = optionsPayload?.videoPath
    const videoType = optionsPayload?.videoType
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
        ? `1920`
        : viewportKey === `tablet`
        ? `800`
        : `400`
    const injectPayload = function (): void {
      if (concierge) concierge(actionLisp, hooks, id.id)
      setPlaying(!playing)
    }
    return (
      <div key={`${id.id}-${idx}`}>
        {!(playing && videoPath && videoType) ? (
          <button onClick={injectPayload} className="group">
            <div className="relative">
              <div className="flex items-center justify-center absolute w-full h-full">
                <div className="rounded-md z-70030 bg-black opacity-50 group-hover:opacity-75">
                  <PlayIcon className="w-16 h-16 relative z-70030 text-white opacity-100" />
                </div>
              </div>
              <video
                className="rounded-md aspect-video object-cover group-hover:-rotate-1 scale-90 group-hover:scale-95 transition duration-50"
                poster={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
                title={oneliner}
              ></video>
            </div>
          </button>
        ) : (
          <video
            controls
            autoPlay={true}
            poster={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
            className="rounded-md aspect-video"
            title={oneliner}
          >
            <source src={videoPath} type={videoType} />
          </video>
        )}
        <h2 className="font-action text-lg text-center tracking-tight text-blue group-hover:text-orange pt-4">
          {oneliner}
        </h2>
      </div>
    )
  })
  return <div key={id.id}>{rendered}</div>
}

function BlogList(payload: any, id: any, viewportKey: string, hooks: any) {
  const concierge = hooks?.concierge
  const months = [
    `Jan`,
    `Feb`,
    `Mar`,
    `Apr`,
    `May`,
    `Jun`,
    `Jul`,
    `Aug`,
    `Sep`,
    `Oct`,
    `Nov`,
    `Dec`,
  ]
  const rendered = payload.map((e: any, idx: string) => {
    const thisPayload = e.node
    const actionLisp = thisPayload?.field_action_lisp
      ? lispLexer(thisPayload.field_action_lisp)
      : null
    const oneliner = thisPayload?.field_oneliner
    const categorySlug = thisPayload?.field_category_slug
    const optionsPayload =
      typeof thisPayload?.field_options === `string`
        ? ParseOptions(thisPayload.field_options)
        : null
    const timestamp = optionsPayload?.timestamp
    const date = timestamp ? new Date(timestamp * 1000) : null
    const year = date ? date.getFullYear() : null
    const day = date ? date.getDate() : null
    const month = date ? months[date.getMonth()] : null
    const description = optionsPayload?.description
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
      <article
        key={idx}
        className="relative isolate flex flex-col gap-8 xl:flex-row group"
      >
        <button
          onClick={injectPayload}
          className="relative aspect-[16/9] sm:aspect-[2/1] xl:w-64 xl:shrink-0 border-none"
        >
          <img
            src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
            alt={`Decorative image for ${oneliner}`}
            className="absolute inset-0 h-full w-full rounded-2xl object-cover group-hover:-rotate-1 group-hover:scale-105"
          />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-darkgrey/10" />
        </button>
        <div>
          <div className="flex items-center gap-x-4 text-xs">
            {timestamp ? (
              <time dateTime={timestamp} className="text-darkgrey">
                {`${day} ${month} ${year}`}
              </time>
            ) : null}
            <span className="relative z-10 rounded-full bg-lightgrey/10 px-3 py-1.5 font-medium text-black">
              {categorySlug}
            </span>
          </div>
          <div className="group relative max-w-xl">
            <h3 className="mt-3 leading-6 text-darkgrey group-hover:text-black">
              <button
                className="font-bold font-main text-xl"
                onClick={injectPayload}
              >
                <span className="absolute inset-0" />
                {oneliner}
              </button>
            </h3>
            <p className="mt-5 text-sm leading-6 text-darkgrey">
              {description}
            </p>
          </div>
        </div>
      </article>
    )
  })
  return (
    <div key={id.id} className="mt-16 space-y-20 xl:mt-20 xl:space-y-20">
      {rendered}
    </div>
  )
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
            <Logo className="h-16 mb-2" />
            <Wordmark className="h-10 fill-black" />
          </div>
          <p className="mt-6 text-sm md:text-md text-darkgrey font-action tracking-wider">
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
  bloglist: BlogList,
  videoitem: VideoItem,
  togglebeliefgrid: ToggleBeliefGrid,
  togglebelieftags: ToggleBeliefTags,
  injectComponent: InjectComponent,
}

export default templates
