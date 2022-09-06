import * as React from "react"
import { graphql, navigate } from "gatsby"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import { tractStackGraph, getScrollbarSize } from "gatsby-plugin-tractstack"

import Layout from "../components/layout"
import Seo from "../components/seo"
import StoryFragmentRender from "../components/storyFragmentRender"
import storyFragmentCompositor from "../components/storyFragmentCompositor"
import usePrefersReducedMotion from "../components/prefersReducedMotion"

export const query = graphql`
  query ($id: String) {
    allNodeStoryFragment {
      edges {
        node {
          id
          title
          field_slug
          relationships {
            field_tract_stack {
              title
              id
            }
          }
        }
      }
    }
    nodeStoryFragment(id: { eq: $id }) {
      title
      id
      field_slug
      relationships {
        field_menu {
          field_options
          field_theme
          id
          internal {
            type
          }
          relationships {
            field_svg_logo {
              id
              localFile {
                publicURL
              }
            }
            field_image_logo {
              id
              localFile {
                childImageSharp {
                  mobile: gatsbyImageData(width: 256, placeholder: BLURRED)
                  tablet: gatsbyImageData(width: 512, placeholder: BLURRED)
                  desktop: gatsbyImageData(width: 768, placeholder: BLURRED)
                }
              }
            }
            field_menu_items {
              field_title
              field_slug
              field_options
              field_level
              id
            }
          }
        }
        field_panes {
          id
          title
          field_slug
          field_height_ratio_mobile
          field_height_ratio_tablet
          field_height_ratio_desktop
          field_height_offset_mobile
          field_height_offset_tablet
          field_height_offset_desktop
          relationships {
            field_pane_fragments {
              ... on paragraph__background_colour {
                id
                field_background_colour
                field_hidden_viewports
                internal {
                  type
                }
              }

              ... on paragraph__background_pane {
                id
                field_zindex
                field_shape_mobile
                field_shape_tablet
                field_shape_desktop
                field_css_styles_parent_mobile
                field_css_styles_parent_tablet
                field_css_styles_parent_desktop
                field_hidden_viewports
                field_options
                internal {
                  type
                }
              }

              ... on paragraph__background_video {
                id
                field_zindex
                field_alt_text
                field_css_styles_parent_mobile
                field_css_styles_parent_tablet
                field_css_styles_parent_desktop
                field_image_mask_shape_mobile
                field_image_mask_shape_tablet
                field_image_mask_shape_desktop
                field_hidden_viewports
                field_cdn_url
                field_options
                internal {
                  type
                }
              }

              ... on paragraph__background_image {
                id
                field_zindex
                field_alt_text
                field_css_styles_parent_mobile
                field_css_styles_parent_tablet
                field_css_styles_parent_desktop
                field_image_mask_shape_mobile
                field_image_mask_shape_tablet
                field_image_mask_shape_desktop
                field_hidden_viewports
                field_options
                field_background_position
                internal {
                  type
                }
                relationships {
                  field_image {
                    id
                    filename
                    mobile: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 768, placeholder: BLURRED)
                      }
                    }
                    tablet: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 1366, placeholder: BLURRED)
                      }
                    }
                    desktop: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 2560, placeholder: BLURRED)
                      }
                    }
                  }
                }
              }

              ... on paragraph__svg {
                id
                field_zindex
                field_css_styles_parent_mobile
                field_css_styles_parent_tablet
                field_css_styles_parent_desktop
                field_image_mask_shape_mobile
                field_image_mask_shape_tablet
                field_image_mask_shape_desktop
                field_hidden_viewports
                field_options
                field_svg_file {
                  description
                }
                internal {
                  type
                }
                relationships {
                  field_svg_file {
                    id
                    filename
                    localFile {
                      publicURL
                    }
                  }
                }
              }

              ... on paragraph__markdown {
                id
                field_markdown_body
                field_zindex
                field_css_styles_mobile
                field_css_styles_tablet
                field_css_styles_desktop
                field_css_styles_parent_mobile
                field_css_styles_parent_tablet
                field_css_styles_parent_desktop
                field_image_mask_shape_mobile
                field_image_mask_shape_tablet
                field_image_mask_shape_desktop
                field_text_shape_outside_mobile
                field_text_shape_outside_tablet
                field_text_shape_outside_desktop
                field_hidden_viewports
                field_options
                field_modal
                internal {
                  type
                }
                childPaneFragment {
                  childMarkdownRemark {
                    htmlAst
                  }
                }
                relationships {
                  field_image {
                    id
                    filename
                    mobile: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 768, placeholder: BLURRED)
                      }
                    }
                    tablet: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 1366, placeholder: BLURRED)
                      }
                    }
                    desktop: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 2560, placeholder: BLURRED)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const codeHooks = {
  "add-here": (
    <>
      <p>codehook!</p>
    </>
  ),
}

const StoryFragment = ({ data }) => {
  const [lispActionPayload, setLispActionPayload] = React.useState([])
  const [panesArray, setPanesArray] = React.useState([])
  const prefersReducedMotion = usePrefersReducedMotion()
  const breakpoints = useBreakpoint()
  const viewportKey = breakpoints.mobile
    ? "mobile"
    : breakpoints.tablet
    ? "tablet"
    : breakpoints.desktop
    ? "desktop"
    : "server"
  const thisGraph = tractStackGraph(data.allNodeStoryFragment.edges)
  const title = data.nodeStoryFragment.title
  const payload = storyFragmentCompositor({
    data: data.nodeStoryFragment,
    viewportKey: viewportKey,
    setLispActionHook: setLispActionPayload,
    codeHooks: codeHooks,
  })
  const impressions =
    (payload?.payload?.impressions?.hasOwnProperty(viewportKey) &&
      payload.payload.impressions[viewportKey]) ||
    {}
  //console.log( impressions )
  //console.log(thisGraph)
  //console.log(payload)
  //console.log(prefersReducedMotion )
  //console.log(panesArray)

  React.useEffect(
    function doLispAction() {
      if (typeof lispActionPayload === "object" && lispActionPayload?.length) {
        const thisPayload = (lispActionPayload && lispActionPayload[0]) || false
        const command =
          (thisPayload && thisPayload[0] && thisPayload[0][0]) || null
        const parameters =
          (thisPayload && thisPayload[0] && thisPayload[0][1]) || null
        const parameterOne = (parameters && parameters[0]) || null
        const parameterTwo = (parameters && parameters[1]) || null
        //const parameterThree = (parameters && parameters[2]) || null
        /*
        let parameter_one, parameter_two, parameter_three
        if (lispActionPayload && typeof lispActionPayload[1] === "object") {
          parameter_one = lispActionPayload[1][0] || false
          parameter_two = lispActionPayload[1][1] || false
          parameter_three = lispActionPayload[1][2] || false
        }
        */
        //console.log(command, parameters, parameterOne, parameterTwo, parameterThree )
        switch (command) {
          case "goto":
            switch (parameterOne) {
              case "storyFragment":
                navigate(`/${parameterTwo}`)
                break
              default:
                console.log("LispActionPayload misfire on goto", parameters)
            }
            break
          default:
            console.log("LispActionPayload misfire", command, parameters)
            break
        }
      }
    },
    [lispActionPayload]
  )
  React.useEffect(
    function checkScrollBarSize() {
      const currentSize = viewportKey === "server" ? 0 : getScrollbarSize()
      document.documentElement.style.setProperty("--offset", currentSize)
    },
    [viewportKey]
  )
  return (
    <Layout
      title={title}
      panesArray={panesArray}
      impressions={impressions}
      viewportKey={viewportKey}
      prefersReducedMotion={prefersReducedMotion}
    >
      <Seo title={title} />
      <StoryFragmentRender
        payload={payload}
        prefersReducedMotion={prefersReducedMotion}
        viewportKey={viewportKey}
        setLispActionPayload={setLispActionPayload}
        setPanesArray={setPanesArray}
        panesArray={panesArray}
      />
    </Layout>
  )
}

export const Head = ({ data }) => <Seo title={data.nodeStoryFragment.title} />

export default StoryFragment
