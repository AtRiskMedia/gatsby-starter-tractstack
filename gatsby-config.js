require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

const viewportWidths = {
  mobile: "(max-width: 800px)", // renders as though 600px
  tablet: "(min-width: 801px) and (max-width: 1366px)", // renders as though 1080px
  desktop: "(min-width: 1367px)", // renders as though 1920px
}

module.exports = {
  siteMetadata: {
    title: `Tract Stack by At Risk Media - Gatsby Starter`,
    description: `No-code conversion funnel concierge`,
    author: `@AtRiskMedia`,
    siteUrl: `https://atriskmedia.com/`,
  },
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
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
        icon: `assets/ARm-logo.svg`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-breakpoints`,
      options: {
        queries: viewportWidths,
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        disableVendorPrefixes: true,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
    },
    "gatsby-transformer-tractstack",
    "gatsby-plugin-tractstack",
    {
      resolve: "gatsby-source-drupal",
      options: {
        baseUrl: "https://dev.atriskmedia.com/d/",
        basicAuth: {
          username: process.env.BASIC_AUTH_USERNAME,
          password: process.env.BASIC_AUTH_PASSWORD,
        },
      },
    },
  ],
}
