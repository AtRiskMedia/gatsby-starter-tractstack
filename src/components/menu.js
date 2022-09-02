import React from "react"
import {
  PreParseMenuItems,
  ParseMenuItems,
  getLogo,
} from "gatsby-plugin-tractstack"

function Menu({ menuPayload, viewportKey, setLispActionHook }) {
  const logo = getLogo(
    menuPayload.relationships?.field_svg_logo,
    menuPayload.relationships?.field_image_logo
  )
  const menuItemsRaw = PreParseMenuItems(
    menuPayload.relationships?.field_menu_items,
    setLispActionHook
  )
  const menuItems = menuItemsRaw && ParseMenuItems(menuItemsRaw)
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
        <div className="menu__menuitems">{menuItems}</div>
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
