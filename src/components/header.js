import * as React from "react"
import PropTypes from "prop-types"

import { TractStackIcon } from "gatsby-plugin-tractstack"

const Header = ({ siteTitle }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  return (
    <header
      className={isExpanded ? "expanded" : ``}
      style={{
        margin: `0 auto`,
        padding: `var(--space-2) var(--size-gutter)`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `space-between`,
        background: `var(--colour-lightgrey)`,
      }}
    >
      {siteTitle}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="header__toggle"
        style={{
          fontSize: `var(--font-sm)`,
          textDecoration: `none`,
        }}
      >
        <img
          alt="At Risk Media logo"
          height={30}
          style={{ margin: 0 }}
          src={TractStackIcon}
        />
      </button>
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
