import React, { useEffect } from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { useBreakpoint } from "gatsby-plugin-breakpoints"
import { InView } from "react-cool-inview"
import create from "zustand"
import {
  Compositor,
  useInterval,
  getScrollbarSize,
} from "gatsby-plugin-tractstack"

import config from "../../data/SiteConfig"
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
          field_options
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
    hasH5P: false,
  },
  panesVisible: {
    last: false,
    footer: false,
  },
  revealContext: {
    slug: false,
    reveal: undefined,
  },
  eventStream: {},
  updateStoryStep: (key, value) =>
    set(state => ({
      storyStep: { ...state.storyStep, [key]: value },
    })),
  updatePanesVisible: (key, value) =>
    set(state => ({
      panesVisible: { ...state.panesVisible, [key]: value },
    })),
  updateRevealContext: (key, value) =>
    set(state => ({
      revealContext: { ...state.revealContext, [key]: value },
    })),
  updateEventStream: (key, value) =>
    set(state => ({
      eventStream: { ...state.eventStream, [key]: value },
    })),
  updateEventStreamCleanup: lastSync =>
    set(state => ({
      eventStream: {
        ...Object.keys(state.eventStream)
          .filter(k => k > lastSync)
          .reduce((obj, key) => {
            obj[key] = state.eventStream[key]
            return obj
          }, {}),
      },
    })),
}))

function useWindowScale() {
  useEffect(() => {
    function handleResize() {
      const scrollBarOffset = getScrollbarSize()
      const thisWidth = window.innerWidth - scrollBarOffset
      const thisScale =
        thisWidth < 801
          ? thisWidth / 600
          : thisWidth < 1367
            ? thisWidth / 1080
            : thisWidth / 1920
      document.documentElement.style.setProperty("--scale", thisScale * 0.99)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])
}

const RenderedStoryFragment = ({ data }) => {
  const updateStoryStep = useStore(state => state.updateStoryStep)
  const updatePanesVisible = useStore(state => state.updatePanesVisible)
  const updateRevealContext = useStore(state => state.updateRevealContext)
  const updateEventStream = useStore(state => state.updateEventStream)
  const updateEventStreamCleanup = useStore(
    state => state.updateEventStreamCleanup
  )
  const storyStep = useStore(state => state.storyStep)
  const panesVisible = useStore(state => state.panesVisible)
  const revealContext = useStore(state => state.revealContext)
  const eventStream = useStore(state => state.eventStream)
  const prefersReducedMotion = usePrefersReducedMotion()
  const breakpoints = useBreakpoint()
  const viewportKey = breakpoints.mobile
    ? "mobile"
    : breakpoints.tablet
      ? "tablet"
      : breakpoints.desktop
        ? "desktop"
        : "server"
  useWindowScale()
  const storyFragmentTitle = data.nodeStoryFragment.title
  const storyFragmentId = data.nodeStoryFragment.id
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
  const storyFragmentPayload =
    viewportKey !== "server"
      ? storyFragmentCompositor({
        data: data.nodeStoryFragment,
        viewportKey: viewportKey,
        codeHooks: codeHooks,
        updateRevealContext: updateRevealContext,
        updateEventStream: updateEventStream,
      })
      : null
  const tractStackContextPayload =
    viewportKey !== "server" && typeof storyFragmentPayload === "object"
      ? Compositor(
        data.nodeStoryFragment.relationships.field_tract_stack.relationships
          .field_context_panes,
        null,
        viewportKey,
        updateRevealContext,
        updateEventStream
      )
      : null

  const [lastSync, setLastSync] = React.useState(0)
  const [lastRead, setLastRead] = React.useState(0)
  useInterval(() => {
    const now = Date.now()
    const payload =
      typeof eventStream === "object"
        ? Object.keys(eventStream)
          .filter(k => k <= now && k > lastSync)
          .reduce((obj, key) => {
            obj[key] = eventStream[key]
            return obj
          }, {})
        : {}
    const currentPaneId = panesVisible.last
    const detectRead =
      lastRead !== currentPaneId && panesVisible.hasOwnProperty(currentPaneId)
        ? Date.now() - panesVisible[currentPaneId] > config.readThreshold
        : null
    if (detectRead) {
      const duration = Date.now() - panesVisible[currentPaneId]
      setLastRead(currentPaneId)
      updateEventStream(Date.now() + 1, {
        command: "read",
        payload: { id: currentPaneId, duration: duration },
      })
    }
    updateEventStreamCleanup(now)
    setLastSync(now)
  }, config.conciergeSync)

  useEffect(
    function bootstrapStoryFragment() {
      if (
        viewportKey !== "server" &&
        typeof storyFragmentPayload === "object" &&
        !storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`)
      ) {
        updateStoryStep("hasH5P", storyFragmentPayload?.hasH5P || false)
        updateStoryStep(
          `${viewportKey}-${storyFragmentId}`,
          storyFragmentPayload
        )
      }
      if (
        viewportKey !== "server" &&
        typeof tractStackContextPayload === "object" &&
        !storyStep.hasOwnProperty(`${viewportKey}-context`) &&
        storyStep.hasOwnProperty(`${viewportKey}-${storyFragmentId}`)
      ) {
        updateStoryStep(`${viewportKey}-context`, tractStackContextPayload)
      }
    },
    [
      viewportKey,
      storyFragmentId,
      storyFragmentPayload,
      tractStackContextPayload,
      updateStoryStep,
      storyStep,
    ]
  )

  useEffect(
    function toggleContext() {
      if (
        viewportKey !== "server" &&
        revealContext["slug"] === undefined &&
        typeof panesVisible["last"] === "string"
      ) {
        updateRevealContext("slug", false)
        const element = document.getElementById(
          `wrapper-${panesVisible["last"]}`
        )
        element.scrollIntoView()
      } else if (
        viewportKey !== "server" &&
        typeof revealContext["slug"] === "string" &&
        revealContext["reveal"] === Date.now()
      ) {
        const element = document.getElementById(`context`)
        element.scrollIntoView()
        updateRevealContext("reveal", undefined)
      }
    },
    [updateRevealContext, panesVisible, revealContext, viewportKey]
  )

  if (viewportKey === "server") return <></>

  //const thisGraph = tractStackGraph(data.allNodeStoryFragment.edges)
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
            revealContext={revealContext}
            updateRevealContext={updateRevealContext}
            updateEventStream={updateEventStream}
            panesVisible={panesVisible}
            updatePanesVisible={updatePanesVisible}
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
