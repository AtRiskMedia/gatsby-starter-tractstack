import React from "react"
import { Link } from "gatsby"
import { getLogo } from "gatsby-plugin-tractstack"

import config from "../../data/SiteConfig"

const NavLink = ({ children, to, onClick }) => (
  <Link to={to} onClick={onClick} activeClassName="is-active">
    {children}
  </Link>
)

function Menu({ menuPayload, viewportKey, hooks }) {
  const updateEventStream = hooks.updateEventStream
  const processRead = hooks.processRead
  const logo = getLogo(
    menuPayload.relationships?.field_svg_logo,
    menuPayload.relationships?.field_image_logo
  )
  const menuItems = menuPayload.relationships?.field_menu_items?.map(e => {
    function injectPayload() {
      const now = Date.now()
      updateEventStream(now, {
        verb: "clicked",
        object_name: e.field_slug,
        object_id: e.id,
        object_type: "menuitem",
        tractStackId: e.tractStackId,
        tractStackSlug: e.tractStackSlug,
        storyFragmentId: e.tractStackId,
        storyFragmentSlug: e.tractStackSlug,
      })
      processRead()
    }
    return (
      <li key={`${viewportKey}-${e.field_slug}`}>
        <NavLink onClick={injectPayload} to={`/${e.field_slug}`}>
          {e.field_title}
        </NavLink>
      </li>
    )
  })

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
