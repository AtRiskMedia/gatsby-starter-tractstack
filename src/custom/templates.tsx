// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { ITemplateDict } from '../types'
import { ParseOptions, lispLexer } from 'gatsby-plugin-tractstack'

function MenuGrid(payload: any, id: string, viewportKey: string, hooks: any) {
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
    const size = viewportKey === `desktop` ? `800` : `400`
    const injectPayload = function (): void {
      if (concierge) concierge(actionLisp, hooks, id)
    }
    return (
      <li key={idx}>
        <div className="group aspect-h-10 aspect-w-16 block w-full overflow-hidden">
          <button onClick={injectPayload} className="group">
            <img
              className="mb-2 rounded-xl group-hover:-rotate-1 group-hover:scale-95 transition duration-50 pointer-events-none object-cover"
              src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
              title={oneliner}
            />
            <p className="font-main text-md md:text-lg font-bold tracking-tight text-blue group-hover:text-orange">
              {title}
            </p>
          </button>
        </div>
      </li>
    )
  })

  return (
    <ul
      key={id}
      role="list"
      className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8"
    >
      {rendered}
    </ul>
  )
}

function MenuItem(payload: any, id: string, viewportKey: string, hooks: any) {
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
      if (concierge) concierge(actionLisp, hooks, id)
    }
    return (
      <li key={idx}>
        <button onClick={injectPayload} className="group">
          <img
            className="mb-2 rounded-xl group-hover:-rotate-1 group-hover:scale-95 transition duration-50"
            src={`/${artpackCollection}-artpack/${size}/${artpackImage}.${artpackFiletype}`}
            title={oneliner}
          />
          <h2 className="font-action text-lg font-bold tracking-tight text-blue group-hover:text-orange">
            {title}
          </h2>
        </button>
      </li>
    )
  })
  return <ul key={id}>{rendered}</ul>
}

const templates: ITemplateDict = {
  menugrid: MenuGrid,
  menuitem: MenuItem,
}

export default templates
