// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { graphql } from 'gatsby'

import Wrapper from '../components/Wrapper'
import StoryFragment from '../components/StoryFragment'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { IStoryFragmentPayload } from '../types'
import { config } from '../../data/SiteConfig'

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
                  desktop: gatsbyImageData(width: 512, placeholder: BLURRED)
                }
              }
            }
          }
        }
        contextPanes: field_context_panes {
          id: drupal_id
          title
          slug: field_slug
        }
        panes: field_panes {
          id: drupal_id
          title
          slug: field_slug
          optionsPayload: field_options
          heightRatioDesktop: field_height_ratio_desktop
          heightRatioTablet: field_height_ratio_tablet
          heightRatioMobile: field_height_ratio_mobile
          heightOffsetDesktop: field_height_offset_desktop
          heightOffsetTablet: field_height_offset_tablet
          heightOffsetMobile: field_height_offset_mobile
          relationships {
            field_image {
              id: drupal_id
              filename
              localFile {
                publicURL
              }
            }
            field_image_svg {
              id: drupal_id
              localFile {
                publicURL
              }
            }
            markdown: field_markdown {
              id: drupal_id
              slug: field_slug
              markdownBody: field_markdown_body
              childMarkdown {
                childMarkdownRemark {
                  htmlAst
                }
              }
              relationships {
                images: field_image {
                  id: drupal_id
                  filename
                  localFile {
                    publicURL
                  }
                }
                imagesSvg: field_image_svg {
                  id: drupal_id
                  filename
                  localFile {
                    publicURL
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
  const storyFragmentId = data.nodeStoryFragment.id
  const storyFragmentTitle = data.nodeStoryFragment.title
  const storyFragmentSlug = data.nodeStoryFragment.slug
  const tractStackId = data.nodeStoryFragment.relationships.tractstack.id
  const tractStackTitle = data.nodeStoryFragment.relationships.tractstack.title
  const tractStackSlug = data.nodeStoryFragment.relationships.tractstack.slug

  return (
    <Wrapper slug={data.nodeStoryFragment.slug} mode="storyFragment">
      <Header isHome={isHome} siteTitle={storyFragmentTitle} open={false} />
      <StoryFragment
        payload={{
          storyFragment: data.nodeStoryFragment,
          resources: data.allNodeResource?.edges,
          contextPanesMap: data.nodeStoryFragment.relationships.contextPanes,
          id: {
            id: storyFragmentId,
            title: storyFragmentTitle,
            slug: storyFragmentSlug,
            tractStackId,
            tractStackTitle,
            tractStackSlug,
          },
        }}
      />
    </Wrapper>
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
