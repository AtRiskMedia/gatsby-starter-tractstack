import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const title = `Home | Tract Stack by At Risk Media`

const IndexPage = () => (
  <Layout title={title} panesArray={[]} impressions={{}} viewportKey="server">
    <Seo title={title} />
    <div>
      <h1>
        Welcome to <b>Tract Stack</b>
      </h1>
    </div>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title={title} />

export default IndexPage
