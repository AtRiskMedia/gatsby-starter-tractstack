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
                  tablet: gatsbyImageData(width: 512, placeholder: BLURRED)
                }
              }
            }
          }
        }
        panes: field_panes {
          id: drupal_id
          title
          slug: field_slug
          optionsPayload: field_options
          heightRatio: field_height_ratio_tablet
          heightOffset: field_height_offset_tablet
          relationships {
            field_image {
              id: drupal_id
              filename
              localFile {
                publicURL
              }
              all: localFile {
                childImageSharp {
                  gatsbyImageData(width: 1366, placeholder: BLURRED)
                }
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
                  all: localFile {
                    childImageSharp {
                      gatsbyImageData(width: 1366, placeholder: BLURRED)
                    }
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
  const viewportKey = `tablet`
  const storyFragmentTitle = data.nodeStoryFragment.title
  const resourcePayload = data?.allNodeResource?.edges
  const processRead = useStoryStepStore((state) => state.processRead)
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
