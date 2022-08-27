import * as React from "react"
import PropTypes from "prop-types"

import Header from "./header"
import "./layout.css"

const Layout = props => {
  const children = props?.children
  const title = props?.title || `Title`
  const setLispActionPayload = props.setLispActionPayload

  return (
    <>
      <Header siteTitle={title} setLispActionPayload={setLispActionPayload} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
        }}
      >
        <main>{children}</main>
        <footer
          style={{
            fontSize: `var(--font-sm)`,
          }}
        >
          © {new Date().getFullYear()} &middot;
          <a href="https://tractstack.com">Tract Stack</a> by{" "}
          <a href="https://atriskmedia.com">At Risk Media</a>.{` `}
          No-code conversion funnel concierge. Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>.
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
