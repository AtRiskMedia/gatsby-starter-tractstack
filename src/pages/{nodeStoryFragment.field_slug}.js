import * as React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import { InView } from "react-cool-inview"
import create from "zustand"
import { Compositor } from "gatsby-plugin-tractstack"

import StoryFragment from "../components/StoryFragment"
import Header from "../components/header"
import Seo from "../components/seo"
import H5P from "../components/H5P"
import storyFragmentCompositor from "../components/storyFragmentCompositor"
import usePrefersReducedMotion from "../components/prefersReducedMotion"
import Form from "../components/Form"
import Footer from "../components/footer"

export const query = graphql`
  query ($id: String) {
    nodeStoryFragment(id: { eq: $id }) {
      title
      id
      field_slug
      relationships {
        field_tract_stack {
          id
          relationships {
            field_context_panes {
              id
              field_slug
              relationships {
                field_pane_fragments {
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
                    field_hidden_viewports
                    field_options
                    field_context_pane
                    internal {
                      type
                    }
                    childPaneFragment {
                      childMarkdownRemark {
                        htmlAst
                      }
                    }
                  }
                }
              }
            }
          }
        }
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
                field_context_pane
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

        field_context_panes {
          id
          title
          field_slug
          relationships {
            field_pane_fragments {
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
                field_hidden_viewports
                field_options
                field_context_pane
                internal {
                  type
                }
                childPaneFragment {
                  childMarkdownRemark {
                    htmlAst
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
  H5P: H5P,
}

const useStore = create(set => ({
  storyStep: {
    storyFragment: false,
    hasH5P: false,
  },
  panesVisible: {
    last: false,
    footer: false,
    //revealContext: "8fc3aea8-5e15-5897-ad2d-244f871dc948",
    revealContext: false, // zeroParty = "8fc3aea8-5e15-5897-ad2d-244f871dc948"
  },
  updateStoryStep: (key, value) =>
    set(state => ({
      storyStep: { ...state.storyStep, [key]: value },
    })),
  updatePanesVisible: (key, value) =>
    set(state => ({
      panesVisible: { ...state.panesVisible, [key]: value },
    })),
}))

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
  const updateStoryStep = useStore(state => state.updateStoryStep)
  const updatePanesVisible = useStore(state => state.updatePanesVisible)
  const storyStep = useStore(state => state.storyStep)
  const panesVisible = useStore(state => state.panesVisible)
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
  const storyFragmentTitle = data.nodeStoryFragment.title
  const storyFragmentId = data.nodeStoryFragment.id
  React.useEffect(
    function storeCssVariable() {
      document.documentElement.style.setProperty(
        "--scale",
        scale?.scale * 0.99999
      )
    },
    [scale]
  )
  React.useEffect(
    function bootstrapStoryFragment() {
      if (
        viewportKey !== "server" &&
        !storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`)
      ) {
        const storyFragmentPayload =
          viewportKey !== "server"
            ? storyFragmentCompositor({
                data: data.nodeStoryFragment,
                viewportKey: viewportKey,
                codeHooks: codeHooks,
              })
            : null
        if (storyFragmentPayload.hasH5P) updateStoryStep("hasH5P", true)
        else if (storyStep["hasH5P"] !== false) updateStoryStep("hasH5P", false)
        updateStoryStep(
          `${viewportKey}-${storyFragmentId}`,
          storyFragmentPayload
        )
      }
    },
    [
      viewportKey,
      data.nodeStoryFragment,
      updateStoryStep,
      storyFragmentId,
      storyStep,
    ]
  )

  React.useEffect(
    function bootstrapTractStackContext() {
      if (
        viewportKey !== "server" &&
        !storyStep.hasOwnProperty(`${viewportKey}-context`) &&
        storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`)
      ) {
        const tractStackContextPayload =
          viewportKey !== "server"
            ? Compositor(
                data.nodeStoryFragment.relationships.field_tract_stack
                  .relationships.field_context_panes,
                null,
                viewportKey
              )
            : null
        updateStoryStep(`${viewportKey}-context`, tractStackContextPayload)
      }
    },
    [
      viewportKey,
      data.nodeStoryFragment,
      updateStoryStep,
      storyFragmentId,
      storyStep,
    ]
  )

  if (viewportKey === "server") return <></>
  //const thisGraph = tractStackGraph(data.allNodeStoryFragment.edges)
  const allGlobalContext = Object.assign(
    {},
    ...data.nodeStoryFragment.relationships.field_tract_stack.relationships.field_context_panes.map(
      p => {
        const thisVal = { [p.field_slug]: p.id }
        return thisVal
      }
    )
  )
  const allLocalContext = Object.assign(
    {},
    ...data.nodeStoryFragment.relationships.field_context_panes.map(p => {
      const thisVal = { [p.field_slug]: p.id }
      return thisVal
    })
  )

  return (
    <>
      {storyStep["hasH5P"] && (
        <Helmet>
          <script src="/h5p-resizer.js" />
        </Helmet>
      )}
      <Header
        siteTitle={
          storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`)
            ? storyFragmentTitle
            : "Loading"
        }
        tractStackContextPayload={
          storyStep.hasOwnProperty(`${viewportKey}-context`)
            ? storyStep[`${viewportKey}-context`]
            : {}
        }
      />
      <Seo title={storyFragmentTitle} />
      {storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`) ? (
        <>
          <StoryFragment
            updatePanesVisible={updatePanesVisible}
            panesVisible={panesVisible}
            storyFragmentPayload={
              storyStep[`${viewportKey}-${storyFragmentId}`]
            }
            contextPayload={
              storyStep.hasOwnProperty(`${viewportKey}-context`)
                ? storyStep[`${viewportKey}-context`]
                : {}
            }
            allContext={{ ...allGlobalContext, ...allLocalContext }}
            viewportKey={viewportKey}
            prefersReducedMotion={prefersReducedMotion}
          />
          <InView
            onEnter={() => {
              updatePanesVisible("footer", true)
            }}
            onLeave={() => {
              updatePanesVisible("footer", false)
            }}
          >
            <Footer />
          </InView>
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export const Head = ({ data }) => <Seo title={data.nodeStoryFragment.title} />

export default RenderedStoryFragment
