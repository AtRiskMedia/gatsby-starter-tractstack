import * as React from "react"
import { graphql } from "gatsby"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import loadable from "@loadable/component"

import Seo from "../components/seo"
import H5p from "../components/H5p"
import storyFragmentCompositor from "../components/storyFragmentCompositor"
import usePrefersReducedMotion from "../components/prefersReducedMotion"
import Form from "../components/Form"

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
  contact: Form,
  H5p: H5p,
}

const StoryFragment = loadable(() => import("./StoryFragment"))

function useWindowScale() {
  const [windowScale, setWindowScale] = React.useState({
    scale: undefined,
  })

  React.useEffect(() => {
    function handleResize() {
      const thisWidth = window.innerWidth
      setWindowScale({
        scale:
          thisWidth < 801
            ? thisWidth / 600
            : thisWidth < 1367
            ? thisWidth / 1080
            : thisWidth / 1920,
      })
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  return windowScale
}

const RenderedStoryFragment = ({ data }) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const breakpoints = useBreakpoint()
  const viewportKey = breakpoints.mobile
    ? "mobile"
    : breakpoints.tablet
    ? "tablet"
    : breakpoints.desktop
    ? "desktop"
    : "server"
  const scale = useWindowScale()
  React.useEffect(
    function storeCssVariable() {
      document.documentElement.style.setProperty("--scale", scale?.scale)
    },
    [scale]
  )
  if (viewportKey === "server") return <></>
  //const thisGraph = tractStackGraph(data.allNodeStoryFragment.edges)
  const title = data.nodeStoryFragment.title
  const payload = storyFragmentCompositor({
    data: data.nodeStoryFragment,
    viewportKey: viewportKey,
    codeHooks: codeHooks,
  })
  const impressions =
    typeof payload?.payload?.impressions === "object"
      ? payload.payload.impressions
      : {}
  //console.log( impressions )
  //console.log(thisGraph)
  //console.log(payload)
  //console.log(prefersReducedMotion )
  return (
    <StoryFragment
      title={title}
      payload={payload}
      impressions={impressions}
      viewportKey={viewportKey}
      prefersReducedMotion={prefersReducedMotion}
    >
      <Seo title={title} />
    </StoryFragment>
  )
}

export const Head = ({ data }) => <Seo title={data.nodeStoryFragment.title} />

export default RenderedStoryFragment
