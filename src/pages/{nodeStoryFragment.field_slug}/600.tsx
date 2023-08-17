// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../../stores/storyStep'
import StoryFragment from '../../components/StoryFragment'
import Header from '../../components/Header'
import Seo from '../../components/Seo'
import Belief from '../../components/Belief'
import YouTube from '../../components/YouTube'
import templates from '../../custom/templates'
import storyFragmentCompositor from '../../components/storyFragmentCompositor'
import { IStoryFragmentPayload } from '../../types'
import { config } from '../../../data/SiteConfig'

export const query = graphql`
  query ($id: String) {
    allNodeResource {
      edges {
        node {
          id: drupal_id
          drupalNid: drupal_internal__nid
          title
          slug: field_slug
          categorySlug: field_category_slug
          optionsPayload: field_options
          actionLisp: field_action_lisp
          oneliner: field_oneliner
        }
      }
    }
    nodeStoryFragment(id: { eq: $id }) {
      id: drupal_id
      drupalNid: drupal_internal__nid
      title
      slug: field_slug
      socialImagePath: field_social_image_path
      tailwindBgColour: field_tailwind_background_colour
      relationships {
        tractstack: field_tract_stack {
          id: drupal_id
          drupalNid: drupal_internal__nid
          title
          socialImagePath: field_social_image_path
          slug: field_slug
          relationships {
            contextPanes: field_context_panes {
              id: drupal_id
              title
              drupalNid: drupal_internal__nid
              slug: field_slug
              relationships {
                paneFragments: field_pane_fragments {
                  ... on paragraph__markdown {
                    id: drupal_id
                    markdownBody: field_markdown_body
                    zindex: field_zindex
                    hiddenViewports: field_hidden_viewports
                    optionsPayload: field_options
                    isContextPane: field_context_pane
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
            storyFragments: field_story_fragments {
              id: drupal_id
              title
              slug: field_slug
            }
          }
        }
        menu: field_menu {
          optionsPayload: field_options
          theme: field_theme
          id
          internal {
            type
          }
          relationships {
            svgLogo: field_svg_logo {
              id: drupal_id
              localFile {
                publicURL
              }
            }
            imageLogo: field_image_logo {
              id: drupal_id
              localFile {
                childImageSharp {
                  mobile: gatsbyImageData(width: 512, placeholder: BLURRED)
                }
              }
            }
            menuItems: field_menu_items {
              id
              title: field_title
              slug: field_slug
              optionsPayload: field_options
              level: field_level
            }
          }
        }
        panes: field_panes {
          id: drupal_id
          title
          slug: field_slug
          optionsPayload: field_options
          heightRatio: field_height_ratio_mobile
          heightOffset: field_height_offset_mobile
          relationships {
            paneFragments: field_pane_fragments {
              ... on paragraph__background_colour {
                id
                bgColour: field_background_colour
                hiddenViewports: field_hidden_viewports
                internal {
                  type
                }
              }

              ... on paragraph__background_pane {
                id
                zindex: field_zindex
                shape: field_shape_mobile
                hiddenViewports: field_hidden_viewports
                optionsPayload: field_options
                internal {
                  type
                }
              }

              ... on paragraph__background_video {
                id
                zindex: field_zindex
                altText: field_alt_text
                imageMaskShape: field_image_mask_shape_mobile
                hiddenViewports: field_hidden_viewports
                cdnUrl: field_cdn_url
                optionsPayload: field_options
                internal {
                  type
                }
              }

              ... on paragraph__background_image {
                id
                zindex: field_zindex
                altText: field_alt_text
                imageMaskShape: field_image_mask_shape_mobile
                hiddenViewports: field_hidden_viewports
                optionsPayload: field_options
                bgPosition: field_background_position
                internal {
                  type
                }
                relationships {
                  image: field_image {
                    id: drupal_id
                    filename
                    mobile: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 1366, placeholder: BLURRED)
                      }
                    }
                  }
                }
              }

              ... on paragraph__svg {
                id
                zindex: field_zindex
                imageMaskShape: field_image_mask_shape_mobile
                hiddenViewports: field_hidden_viewports
                optionsPayload: field_options
                svgFile: field_svg_file {
                  description
                }
                internal {
                  type
                }
                relationships {
                  svgFile: field_svg_file {
                    id: drupal_id
                    filename
                    localFile {
                      publicURL
                    }
                  }
                }
              }

              ... on paragraph__markdown {
                id
                markdownBody: field_markdown_body
                zindex: field_zindex
                imageMaskShape: field_image_mask_shape_mobile
                textShapeOutside: field_text_shape_outside_mobile
                hiddenViewports: field_hidden_viewports
                optionsPayload: field_options
                isModal: field_modal
                isContextPane: field_context_pane
                internal {
                  type
                }
                childPaneFragment {
                  childMarkdownRemark {
                    htmlAst
                  }
                }
                relationships {
                  image: field_image {
                    id: drupal_id
                    filename
                    localFile {
                      publicURL
                    }
                    mobile: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 1366, placeholder: BLURRED)
                      }
                    }
                  }
                }
              }
            }
          }
        }

        contextPanes: field_context_panes {
          id: drupal_id
          title
          slug: field_slug
          relationships {
            paneFragments: field_pane_fragments {
              ... on paragraph__markdown {
                id: drupal_id
                markdownBody: field_markdown_body
                zindex: field_zindex
                hiddenViewports: field_hidden_viewports
                optionsPayload: field_options
                isContextPane: field_context_pane
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

const StoryFragmentViewport = ({ data }: IStoryFragmentPayload) => {
  const isHome = data.nodeStoryFragment.slug === config.home
  const viewportKey = `mobile`
  const storyFragmentTitle = data.nodeStoryFragment.title
  const resourcePayload = data?.allNodeResource?.edges
  const [scrollToPane, setScrollToPane] = useState(``)
  useEffect(() => {
    if (scrollToPane) {
      const pane =
        typeof document !== `undefined`
          ? document.getElementById(`${viewportKey}-${scrollToPane}`)
          : null
      if (pane) {
        pane.scrollIntoView({ behavior: `smooth` })
        setScrollToPane(``)
      }
    }
  }, [scrollToPane, viewportKey])
  const processRead = useStoryStepStore((state) => state.processRead)
  const storyFragmentPayload = storyFragmentCompositor({
    data: data.nodeStoryFragment,
    viewportKey,
    hooks: {
      belief: Belief,
      youtube: YouTube,
      processRead,
      GatsbyImage,
      getImage,
      resourcePayload,
      templates,
      setScrollToPane,
    },
  })
  const hasH5P =
    storyFragmentPayload.storyFragment[
      `${viewportKey}-${storyFragmentPayload.id}`
    ]!.hasH5P

  return (
    <>
      {hasH5P ? (
        <Helmet>
          <script src="/h5p-resizer.js" />
        </Helmet>
      ) : null}
      <Header isHome={isHome} siteTitle={storyFragmentTitle} open={false} />
      <StoryFragment payload={storyFragmentPayload} />
    </>
  )
}

export const Head = ({ data }: IStoryFragmentPayload) => (
  <Seo
    title={data.nodeStoryFragment.title}
    socialImagePath={
      data.nodeStoryFragment.socialImagePath ||
      data.nodeStoryFragment.relationships.tractstack.socialImagePath
    }
  />
)

export default StoryFragmentViewport
