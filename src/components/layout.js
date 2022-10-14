import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"

import Header from "./header"
import Controller from "./controller"
import "./layout.css"

const Layout = ({
  children,
  title,
  panesArray,
  impressions,
  viewportKey,
  prefersReducedMotion,
}) => {
  return (
    <>
      <Helmet>
        <script src="/h5p-resizer.js" />
      </Helmet>
      <Header siteTitle={title} />
      <div
        style={{
          margin: `0 auto`,
          maxWidth: `var(--size-content)`,
        }}
      >
        <main>{children}</main>
        <Controller
          panesArray={panesArray}
          impressions={impressions}
          viewportKey={viewportKey}
          prefersReducedMotion={prefersReducedMotion}
        />
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
  title: PropTypes.string.isRequired,
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Layout
