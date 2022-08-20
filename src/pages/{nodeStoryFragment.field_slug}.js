import * as React from "react"
import { graphql } from "gatsby"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import { getScrollbarSize } from "gatsby-plugin-tractstack"
import styled from "styled-components"
import { InView } from "react-cool-inview"

import Layout from "../components/layout"
import Seo from "../components/seo"
import storyFragmentPayloadThisViewportKey from "../components/storyfragment"
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

const StyledWrapperSection = styled.section`
  ${props => props.css};
`

const codeHooks = {
  "add-here": (
    <>
      <p>codehook!</p>
    </>
  ),
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

const Pane = ({ thisId, children, inView, observe }) => (
  <div
    id={thisId}
    className={inView ? "pane visible" : "pane hidden"}
    ref={observe}
  >
    {children}
  </div>
)

const StoryFragment = props => {
  const [lispActionPayload, setLispActionPayload] = React.useState("")
  const [panesVisible, setPanesVisible] = React.useState([])
  const prefersReducedMotion = usePrefersReducedMotion()
  const breakpoints = useBreakpoint()
  const viewportKey = breakpoints.mobile
    ? "mobile"
    : breakpoints.tablet
    ? "tablet"
    : breakpoints.desktop
    ? "desktop"
    : "server"
  const thisGraph = tractStackGraph(props.data.allNodeStoryFragment.edges)
  const payload = storyFragmentPayloadThisViewportKey({
    data: props.data.nodeStoryFragment,
    viewportKey: viewportKey,
    setLispActionHook: setLispActionPayload,
    codeHooks: codeHooks,
  })
  //console.log(thisGraph)
  //console.log(payload)
  //console.log(prefersReducedMotion )
  console.log(panesVisible, typeof panesVisible)

  React.useEffect(
    function doLispAction() {
      if (lispActionPayload) {
        const command = (lispActionPayload && lispActionPayload[0]) || false
        let parameter_one, parameter_two, parameter_three
        if (lispActionPayload && typeof lispActionPayload[1] === "object") {
          parameter_one = lispActionPayload[1][0] || false
          parameter_two = lispActionPayload[1][1] || false
          parameter_three = lispActionPayload[1][2] || false
        }
        let remainingPanesVisible = [],
          newPanesVisible = []
        switch (command) {
          case "hookPaneVisible":
            remainingPanesVisible =
              panesVisible?.length ?
                panesVisible?.filter(p => p !== parameter_one) : []
            newPanesVisible = remainingPanesVisible?.length ?
              remainingPanesVisible.unshift(parameter_one) : [parameter_one]
            setPanesVisible(newPanesVisible)
            console.log( 5, remainingPanesVisible, newPanesVisible )
            break
          case "hookPaneHidden":
            remainingPanesVisible =
              panesVisible?.length ?
                panesVisible?.filter(p => p !== parameter_one) : []
            setPanesVisible(remainingPanesVisible)
            console.log( 55, remainingPanesVisible )
            break
          case "gotoStoryFragment":
            console.log("gotoStoryFragment")
            break
          case "setCurrentPane":
            console.log("setCurrentPane")
            break
          default:
            console.log(
              "LispActionPayload misfire",
              command,
              parameter_one,
              parameter_two,
              parameter_three
            )
            break
        }
        setLispActionPayload("")
      }
    },
    [lispActionPayload, panesVisible]
  )
  React.useEffect(
    function checkScrollBarSize() {
      const currentSize = viewportKey === "server" ? 0 : getScrollbarSize()
      document.documentElement.style.setProperty("--offset", currentSize)
    },
    [viewportKey]
  )

  const panes =
    typeof payload?.payload?.panes === "object" && payload?.payload?.panes
  const menu = (typeof payload?.menu === "object" && payload?.menu) || <></>
  const thisPayload =
    typeof payload?.payload?.payload === "object" && payload?.payload?.payload
  const rendering =
    typeof panes === "object" &&
    panes?.map(p => {
      const thisPane = thisPayload[p]
      const thisCss =
        (prefersReducedMotion && `${thisPane?.css}`) ||
        `
            ${thisPane?.css}${thisPane?.cssAnimated}
          `
      return (
        <StyledWrapperSection key={`${viewportKey}-${p}`} css={thisCss}>
          <InView
            onEnter={() => {
              setLispActionPayload(["hookPaneVisible", [p]])
            }}
            onLeave={() => {
              setLispActionPayload(["hookPaneHidden", [p]])
            }}
          >
            <Pane id={`${viewportKey}-${p}`} children={thisPane?.children} />
          </InView>
        </StyledWrapperSection>
      )
    })
  const renderedStoryFragment =
    (menu && (
      <>
        {menu}
        {rendering}
      </>
    )) ||
    rendering

  return (
    <Layout>
      <Seo title="StoryFragment Collections Route" />
      <div>
        <h1>
          Welcome to <b>Tract Stack</b>
        </h1>
      </div>
      {renderedStoryFragment}
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
