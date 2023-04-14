// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { getLogo } from 'gatsby-plugin-tractstack'
import { GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import { INavLinkProps, IMenuProps } from '../types'

const NavLink = ({ children, to }: INavLinkProps) => (
  <Link to={to} activeClassName="is-active">
    {children}
  </Link>
)

function Menu({ menuPayload, viewportKey }: IMenuProps) {
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const logo = getLogo(
    menuPayload.relationships?.field_svg_logo,
    menuPayload.relationships?.field_image_logo,
    viewportKey,
    GatsbyImage,
  )
  const menuItems = menuPayload.relationships?.field_menu_items?.map(
    (e: any) => {
      function injectPayload() {
        const eventPayload = {
          verb: `clicked`,
          id: e.id,
          title: e.field_title,
          type: `MenuItem`,
          targetSlug: e.field_slug,
        }
        processRead(true)
        updateEventStream(Date.now(), eventPayload)
      }
      return (
        <li key={`${viewportKey}-${e.field_slug}`} onClick={injectPayload}>
          <NavLink to={`/${e.field_slug}`}>{e.field_title}</NavLink>
        </li>
      )
    },
  )

  const slogan = <p>{config.slogan}</p>
  const branding = <span>{logo}</span>
  const contents = (
    <>
      <div className="menu">
        <div>
          <div className="menu__branding">{branding}</div>
          <div className="menu__slogan">{slogan}</div>
        </div>
      </div>
      <div className="menu">
        <ul className="menu__menuitems">{menuItems}</ul>
      </div>
    </>
  )
  return (
    <div id="menu-default-container">
      <nav
        role="navigation"
        className={`menu menu-default`}
        id={`menu-${viewportKey}`}
      >
        {contents}
      </nav>
    </div>
  )
}

export default Menu
