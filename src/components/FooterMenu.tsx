// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { preParseConcierge, lispLexer } from '@tractstack/helpers'

import { config } from '../../data/SiteConfig'

const FooterMenu = ({ theme, payload }: any) => {
  const hooks = {
    belief: () => {},
    processRead: () => {},
    GatsbyImage: () => {},
    getImage: () => {},
    resourcePayload: () => {},
  }
  const id = {
    id: ``,
    title: ``,
    slug: ``,
    tractStackId: ``,
    tractStackTitle: ``,
    tractStackSlug: ``,
    home: config.home,
  }
  if (theme !== `default`) {
    console.log(`${theme} theme not found`)
    return <></>
  }
  const additionalLinks = payload
    .filter((e: any) => !e.featured)
    .map((e: any) => {
      const item = { ...e }
      const payload = lispLexer(e.actionLisp)
      const to = preParseConcierge(payload, id, hooks)
      if (typeof to === `string`) {
        item.to = to
        item.internal = true
      } else if (typeof to === `object`) item.to = to[0]
      return item
    })
  const allLinks = payload
    .filter((e: any) => e.featured)
    .map((e: any) => {
      const item = { ...e }
      const payload = lispLexer(e.actionLisp)
      const to = preParseConcierge(payload, id, hooks)
      if (typeof to === `string`) {
        item.to = to
        item.internal = true
      } else if (typeof to === `object`) item.to = to[0]
      return item
    })
    .concat(additionalLinks)

  return (
    <div className="mx-auto max-w-sm">
      <nav className="flex flex-wrap justify-evenly">
        {allLinks.map((item: any) => (
          <span key={item.name} className="py-1.5">
            {item.internal ? (
              <Link
                to={item.to}
                className="text-sm font-bold leading-6 text-mydarkgrey hover:text-black"
                title={item.description}
              >
                {item.name}
              </Link>
            ) : (
              <a
                href={item.to}
                className="text-sm font-bold leading-6 text-mydarkgrey hover:text-black"
                title={item.description}
              >
                {item.name}
              </a>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}

export default FooterMenu
