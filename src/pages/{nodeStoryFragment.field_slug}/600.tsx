// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'

import { useStoryStepStore } from '../../stores/storyStep'
import StoryFragmentWrapper from '../../components/StoryFragmentWrapper'
import Header from '../../components/Header'
import Seo from '../../components/Seo'
import Belief from '../../components/Belief'
import storyFragmentCompositor from '../../components/storyFragmentCompositor'
import { IStoryFragmentPayload } from '../../types'

export const query = graphql`
  query ($id: String) {
    nodeStoryFragment(id: { eq: $id }) {
      id
      title
      field_slug
      field_social_image_path
      field_tailwind_background_colour
      relationships {
        field_tract_stack {
          id
          title
          field_social_image_path
          field_slug
          relationships {
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
            field_story_fragments {
              id
              title
              field_slug
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
                }
              }
            }
            field_menu_items {
              id
              field_title
              field_slug
              field_options
              field_level
            }
          }
        }
        field_panes {
          id
          title
          field_slug
          field_options
          field_height_ratio: field_height_ratio_mobile
          field_height_offset: field_height_offset_mobile
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
                field_shape: field_shape_mobile
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
                field_image_mask_shape: field_image_mask_shape_mobile
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
                field_image_mask_shape: field_image_mask_shape_mobile
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
                  }
                }
              }

              ... on paragraph__svg {
                id
                field_zindex
                field_image_mask_shape: field_image_mask_shape_mobile
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
                field_image_mask_shape: field_image_mask_shape_mobile
                field_text_shape_outside: field_text_shape_outside_mobile
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
                    localFile {
                      publicURL
                    }
                    mobile: localFile {
                      childImageSharp {
                        gatsbyImageData(width: 768, placeholder: BLURRED)
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

const StoryFragmentViewport = ({ data }: IStoryFragmentPayload) => {
  const viewportKey = `mobile`
  const storyFragmentTitle = data.nodeStoryFragment.title
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const processRead = useStoryStepStore((state) => state.processRead)
  const storyFragmentPayload = storyFragmentCompositor({
    data: data.nodeStoryFragment,
    viewportKey,
    hooks: {
      belief: Belief,
      updateEventStream,
      processRead,
      GatsbyImage,
      getImage,
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
      <Header siteTitle={storyFragmentTitle} open={false} />
      <StoryFragmentWrapper
        viewportKey={viewportKey}
        payload={storyFragmentPayload}
      />
    </>
  )
}

export const Head = ({ data }: IStoryFragmentPayload) => (
  <Seo
    title={data.nodeStoryFragment.title}
    socialImagePath={
      data.nodeStoryFragment.field_social_image_path ||
      data.nodeStoryFragment.relationships.field_tract_stack
        .field_social_image_path
    }
  />
)

export default StoryFragmentViewport
