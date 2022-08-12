import * as React from "react"
import { graphql } from "gatsby"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import { Compositor, getScrollbarSize } from "gatsby-plugin-tractstack"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Menu from "../components/menu"
import * as styles from "../components/storyfragment.module.css"

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
  "add-here": <></>,
}

const tractStackGraph = data => {
  const tractStackId = data[0].node.relationships.field_tract_stack.id
  const tractStackTitle = data[0].node.relationships.field_tract_stack.title
  const graph = data.map(e => {
    const storyFragmentId = e.node.id
    const storyFragmentTitle = e.node.title
    const storyFragmentSlug = e.node.field_slug
    return {
      id: storyFragmentId,
      title: storyFragmentTitle,
      slug: storyFragmentSlug,
    }
  })
  return {
    id: tractStackId,
    title: tractStackTitle,
    graph: graph,
  }
}

const storyFragmentPayload = props => {
  const setLispActionHook = props.setLispActionHook
  const storyFragmentId = props.data.id
  const storyFragmentTitle = props.data.title
  const storyFragmentSlug = props.data.field_slug
  const panesPayload = props.data.relationships.field_panes
  const composedPayload = Compositor(panesPayload, setLispActionHook, codeHooks)
  const menuPayload = props.data.relationships.field_menu || null
  const composedMenu = {
    mobile: Menu({ menuPayload, viewportKey: "mobile" }),
    tablet: Menu({ menuPayload, viewportKey: "tablet" }),
    desktop: Menu({ menuPayload, viewportKey: "desktop" }),
  }
  return {
    id: storyFragmentId,
    title: storyFragmentTitle,
    slug: storyFragmentSlug,
    payload: composedPayload,
    menu: composedMenu,
  }
}

const StoryFragment = props => {
  const [lispActionPayload, setLispActionPayload] = React.useState("")
  const breakpoints = useBreakpoint()
  const viewportKey = breakpoints.mobile
    ? "mobile"
    : breakpoints.tablet
    ? "tablet"
    : breakpoints.desktop
    ? "desktop"
    : "server"
  const thisGraph = tractStackGraph(props.data.allNodeStoryFragment.edges)
  const thisPayload = storyFragmentPayload({
    data: props.data.nodeStoryFragment,
    setLispActionHook: setLispActionPayload,
  })
  //console.log(thisGraph)
  console.log(thisPayload)

  React.useEffect(
    function doLispAction() {
      console.log(lispActionPayload)
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
    <Layout>
      <Seo title="StoryFragment Collections Route" />
      <div className={styles.textCenter}>
        <h1>
          Welcome to <b>Tract Stack</b>
        </h1>
      </div>
    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Story Fragment Collections Route" />

export default StoryFragment
