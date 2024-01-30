// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
// import { Link } from 'gatsby'

// import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'
import { IMenuProps } from '@tractstack/types'

// const NavLink = ({ children, to }: INavLinkProps) => (
//  <Link to={to} activeClassName="is-active">
//    {children}
//  </Link>
// )

function Menu({ menuPayload, viewportKey }: IMenuProps) {
  console.log(`Menu`, menuPayload)
  // const updateEventStream = useStoryStepStore(
  //  (state) => state.updateEventStream,
  // )
  // const processRead = useStoryStepStore((state) => state.processRead)
  /*
  const logo = getLogo(
    menuPayload.relationships?.svgLogo,
    menuPayload.relationships?.imageLogo,
    viewportKey,
    GatsbyImage,
  )
  const menuItems = menuPayload.relationships?.menuItems?.map((e: any) => {
    function injectPayload() {
      const eventPayload = {
        verb: `CLICKED`,
        id: e.id,
        title: e.field_title,
        type: `MenuItem`,
        targetSlug: e.slug,
      }
      processRead(true)
      updateEventStream(Date.now(), eventPayload)
    }
    return (
      <li key={`${viewportKey}-${e.slug}`} onClick={injectPayload}>
        <NavLink to={`/${e.slug}`}>{e.title}</NavLink>
      </li>
    )
  })
  */

  const slogan = <p>{config.slogan}</p>
  const contents = (
    <>
      <div className="menu">
        <div>
          <div className="menu__slogan">{slogan}</div>
        </div>
      </div>
      <div className="menu">
        <ul className="menu__menuitems"></ul>
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
