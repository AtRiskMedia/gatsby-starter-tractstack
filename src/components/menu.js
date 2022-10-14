import React from "react"
import { Link } from "gatsby"
import { getLogo } from "gatsby-plugin-tractstack"

const NavLink = ({ children, to }) => (
  <Link to={to} activeClassName="is-active">
    {children}
  </Link>
)

function Menu({ menuPayload, viewportKey }) {
  const logo = getLogo(
    menuPayload.relationships?.field_svg_logo,
    menuPayload.relationships?.field_image_logo
  )
  const menuItems = menuPayload.relationships?.field_menu_items?.map(e => {
    return (
      <li key={`${viewportKey}-${e.field_slug}`}>
        <NavLink to={`/${e.field_slug}`}>{e.field_title}</NavLink>
      </li>
    )
  })

  const slogan = <p>Fortifying the Web since 2002</p>
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
