import React, { useEffect, useState } from "react"
import { graphql, navigate } from "gatsby"
import { Helmet } from "react-helmet"
import { InView } from "react-cool-inview"
import {
  Compositor,
  useInterval,
  getScrollbarSize,
} from "gatsby-plugin-tractstack"
import { getCurrentBrowserFingerPrint } from "@rajesh896/broprint.js"

import { useAuthStore } from "../stores/authStore"
import { useStoryStepStore } from "../stores/storyStep"
import { pushPayload } from "../api/services"
import { getTokens } from "../api/axiosClient"
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
          field_slug
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

const RenderedStoryFragment = ({ data }) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn())
  const login = useAuthStore(state => state.login)
  const fingerprint = useAuthStore(state => state.fingerprint)
  const validToken = useAuthStore(state => state.validToken)
  const fingerprintCheck = useAuthStore(state => state.fingerprintCheck)
  const setFingerprint = useAuthStore(state => state.setFingerprint)
  const setFingerprintCheck = useAuthStore(state => state.setFingerprintCheck)
  const [viewportKey, setViewportKey] = useState("server")
  const [lastSync, setLastSync] = useState(0)
  const [loggingIn, setLoggingIn] = useState(0)
  const updatePanesVisible = useStoryStepStore(
    state => state.updatePanesVisible
  )
  const updateRevealContext = useStoryStepStore(
    state => state.updateRevealContext
  )
  const updateEventStreamCleanup = useStoryStepStore(
    state => state.updateEventStreamCleanup
  )
  const updateContentMap = useStoryStepStore(state => state.updateContentMap)
  const updateEventStream = useStoryStepStore(state => state.updateEventStream)
  const panesVisible = useStoryStepStore(state => state.panesVisible)
  const revealContext = useStoryStepStore(state => state.revealContext)
  const eventStream = useStoryStepStore(state => state.eventStream)
  const processRead = useStoryStepStore(state => state.processRead)
  const prefersReducedMotion = usePrefersReducedMotion()
  const storyFragmentTitle = data.nodeStoryFragment.title
  const storyFragmentSlug = data.nodeStoryFragment.field_slug
  const storyFragmentId = data.nodeStoryFragment.id
  const tractStackId = data.nodeStoryFragment.relationships.field_tract_stack.id
  const tractStackSlug =
    data.nodeStoryFragment.relationships.field_tract_stack.field_slug
  const storyFragmentPayload =
    viewportKey !== "server"
      ? storyFragmentCompositor({
        data: data.nodeStoryFragment,
        viewportKey: viewportKey,
        codeHooks: codeHooks,
        hooks: {
          updateRevealContext: updateRevealContext,
          updateContentMap: updateContentMap,
          processRead: processRead,
          updateEventStream: updateEventStream,
          navigate: navigate,
        },
      })
      : null
  const tractStackContextPayload =
    viewportKey !== "server" && typeof storyFragmentPayload === "object"
      ? Compositor(
        data.nodeStoryFragment.relationships.field_tract_stack.relationships
          .field_context_panes,
        null,
        viewportKey,
        {
          updateRevealContext: updateRevealContext,
          updateContentMap: updateContentMap,
          processRead: processRead,
        }
      )
      : null

  useEffect(() => {
    function generateContentMap() {
      Object.entries(storyFragmentPayload.contentMap).forEach(entry => {
        const [key, value] = entry
        updateContentMap(key, {
          id: key,
          slug: value,
          type: "pane",
          storyFragmentId: storyFragmentId,
          storyFragmentSlug: storyFragmentSlug,
          tractStackId: tractStackId,
          tractStackSlug: tractStackSlug,
        })
      })
      Object.entries(tractStackContextPayload.contentMap).forEach(entry => {
        const [key, value] = entry
        updateContentMap(key, {
          id: key,
          slug: value,
          type: "context",
          tractStackId: tractStackId,
          tractStackSlug: tractStackSlug,
        })
      })
    }
    if (
      typeof tractStackContextPayload === "object" &&
      typeof storyFragmentPayload === "object" &&
      tractStackContextPayload?.hasOwnProperty("contentMap") &&
      storyFragmentPayload?.hasOwnProperty("contentMap")
    )
      generateContentMap()
  }, [
    updateContentMap,
    tractStackContextPayload,
    storyFragmentPayload,
    storyFragmentId,
    storyFragmentSlug,
    tractStackId,
    tractStackSlug,
  ])

  useEffect(() => {
    function handleResize() {
      const scrollBarOffset = getScrollbarSize()
      const thisWidth = window.innerWidth - scrollBarOffset
      setViewportKey(
        thisWidth < 801 ? "mobile" : thisWidth < 1367 ? "tablet" : "desktop"
      )
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

  useEffect(() => {
    if (
      viewportKey !== "server" &&
      typeof revealContext["slug"] === "undefined" &&
      typeof panesVisible["last"] === "string"
    ) {
      updateRevealContext("slug", false)
      const element = document.getElementById(`wrapper-${panesVisible["last"]}`)
      element.scrollIntoView()
    } else if (
      viewportKey !== "server" &&
      typeof revealContext["slug"] === "string" &&
      Date.now() - revealContext["reveal"] < 1000
    ) {
      const element = document.getElementById(`context`)
      element.scrollIntoView()
    }
  }, [updateRevealContext, panesVisible, revealContext, viewportKey])

  useEffect(() => {
    if (
      viewportKey !== "server" &&
      (fingerprint === "none" || fingerprint === "undefined") &&
      (fingerprintCheck === false || !validToken)
      //        typeof fingerprint === "undefined" || (typeof fingerprint === "string" && fingerprint === "undefined"
    ) {
      getCurrentBrowserFingerPrint().then(fingerprint1 => {
        getCurrentBrowserFingerPrint().then(fingerprint2 => {
          if (fingerprint1 !== fingerprint2) {
            setFingerprint("masked")
            setFingerprintCheck("masked")
          } else if (typeof fingerprint2 === "number") {
            setFingerprint(fingerprint2.toString())
            setFingerprintCheck(true)
          } else {
            console.log("Unknown error occurred during ident.")
          }
        })
      })
    }
  }, [
    viewportKey,
    fingerprint,
    fingerprintCheck,
    setFingerprint,
    setFingerprintCheck,
    validToken,
  ])

  useEffect(() => {
    const doCheck =
      fingerprint !== "none" && fingerprint !== "masked"
        ? true
        : fingerprint === "undefined"
          ? true
          : false
    if (doCheck && !loggingIn && !validToken) {
      setLoggingIn(1)
      getTokens(fingerprint)
        .then(res => {
          login(res)
        })
        .catch(e => {
          console.log("An error occurred.", e)
        })
        .finally(setLoggingIn(0))
    }
  }, [
    validToken,
    fingerprint,
    login,
    loggingIn,
    setLoggingIn,
  ])

  useInterval(() => {
    const now = Date.now()
    const payload =
      typeof eventStream === "object"
        ? Object.keys(eventStream)
          .filter(k => k > lastSync)
          .reduce((obj, key) => {
            obj[key] = eventStream[key]
            return obj
          }, {})
        : {}
    if (isLoggedIn && Object.keys(payload).length > 0) {
      const events = payload
      pushPayload({ events }).then(res => {
        console.log("to sync to concierge", payload, res)
        updateEventStreamCleanup(now)
        setLastSync(now)
      })
    } else if (fingerprint === "masked") {
      updateEventStreamCleanup(now)
      setLastSync(now)
    }
    processRead(true)
  }, config.conciergeSync)

  if (viewportKey === "server") return <></>
  return (
    <>
      {storyFragmentPayload?.hasH5P && (
        <Helmet>
          <script src="/h5p-resizer.js" />
        </Helmet>
      )}
      <Header
        siteTitle={storyFragmentTitle}
        contextPayload={tractStackContextPayload}
      />
      <Seo title={storyFragmentTitle} />
      <>
        <StoryFragment
          storyFragmentPayload={storyFragmentPayload}
          contextPayload={tractStackContextPayload}
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
    </>
  )
}

export const Head = ({ data }) => <Seo title={data.nodeStoryFragment.title} />

export default RenderedStoryFragment
