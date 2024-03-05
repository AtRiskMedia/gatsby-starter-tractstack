import type { GatsbyConfig } from 'gatsby'

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
})

const siteUrl = process.env.SITE_URL
const lastEpoc = `2023-08-28T03:50:04+00:00`

const config: GatsbyConfig = {
  siteMetadata: {
    author: `@AtRiskMedia`,
  },
  //flags: {
  //  DEV_SSR: true
  //},
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /assets/,
        },
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-tractstack`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#c8df8c`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `./assets/logo.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        disableVendorPrefixes: true,
      },
    },
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-transformer-remark`,
    },
    {
      resolve: 'gatsby-plugin-no-sourcemaps',
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        query: `{
          allNodeStoryFragment {
            edges {
              node {
                slug: field_slug
                modifiedGmt: changed
              }
            }
          }
         allSitePage {
            nodes {
              path
            }
          }
          allNodePane(filter: {field_is_context_pane: {eq: true}}) {
            edges {
              node {
                modifiedGmt: changed
                slug: field_slug
              }
            }
          }
        }`,
        //allShopifyProduct {
        //  edges {
        //    node {
        //      slug: handle
        //      modifiedGmt: updatedAt
        //    }
        //  }
        //}
        resolveSiteUrl: () => siteUrl,
        //allShopifyProduct: { edges: allShopifyProducts },
        resolvePages: ({
          allSitePage: { nodes: allPages },
          allNodeStoryFragment: { edges: allStoryFragments },
          allNodePane: { edges: allContextPanes },
        }: any) => {
          const storyFragments = allStoryFragments.reduce(
            (acc: any, node: any) => {
              const { slug, modifiedGmt } = node.node
              const uri = `/${slug}/`
              acc[uri] = { uri: uri, modifiedGmt }
              return acc
            },
            {},
          )
          const contextPanes = allContextPanes.reduce((acc: any, node: any) => {
            const { slug, modifiedGmt } = node.node
            const uri = `/context/${slug}/`
            acc[uri] = { uri: uri, modifiedGmt }
            return acc
          }, {})
          //const shopifyProducts = allShopifyProducts.reduce(
          //  (acc: any, node: any) => {
          //    const { slug, modifiedGmt } = node.node
          //    const uri = `/products/${slug}/`
          //    acc[uri] = { uri: uri, modifiedGmt }
          //    return acc
          //  },
          //  {},
          //)
          const overrideNodes = {
            ...storyFragments,
            ...contextPanes,
          }
          return allPages.map((page: any) => {
            if (typeof overrideNodes[page.path] === `object`)
              return {
                ...page,
                ...overrideNodes[page.path],
              }
            // prevents stale pages from pretending to be new; to appease Google/SEO
            return { ...page, modifiedGmt: lastEpoc }
          })
        },
        serialize: ({ path, modifiedGmt }: any) => {
          return {
            url: path,
            lastmod: modifiedGmt,
          }
        },
      },
    },
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: process.env.DRUPAL_URL_FRONT,
        basicAuth: {
          username: process.env.BASIC_AUTH_USERNAME,
          password: process.env.BASIC_AUTH_PASSWORD,
        },
        filters: {
          // collection : filter
          'file--file': 'filter[status][value]=1',
          'node--story_fragment': 'filter[status][value]=1',
          'node--tractstack': 'filter[status][value]=1',
          'node--pane': 'filter[status][value]=1',
          'node--resource': 'filter[status][value]=1',
          'node--menu': 'filter[status][value]=1',
          'node--markdown': 'filter[status][value]=1',
        },
      },
    },
  ],

  jsxRuntime: `automatic`,
}

export default config
