import type { GatsbyNode } from 'gatsby'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const path = require(`path`)
import { config } from './data/SiteConfig'

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
}

export const onCreatePage = ({ page, actions }: any) => {
  const { createPage, deletePage } = actions
  if (page.path === `/${config.home}/`) {
    createPage({
      ...page,
      path: '/',
    })
    deletePage(page)
  }
  if (page.path === '/') {
    deletePage(page)
  }
}

export const createPages: GatsbyNode['createPages'] = async ({
  graphql,
  actions,
}) => {
  const { createPage } = actions
  const contextPaneTemplate = path.resolve(`src/templates/contextPane.tsx`)
  const result: any = await graphql(`
    query {
      allNodeResource {
        edges {
          node {
            id: drupal_id
            slug: field_slug
            optionsPayload: field_options
            actionLisp: field_action_lisp
            oneliner: field_oneliner
            title
          }
        }
      }
      allNodeStoryFragment {
        edges {
          node {
            relationships {
              tractstack: field_tract_stack {
                id: drupal_id
                title
                slug: field_slug
              }
              contextPanes: field_context_panes {
                id: drupal_id
                title
                slug: field_slug
                isContextPane: field_is_context_pane
                optionsPayload: field_options
                relationships {
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
      }
      allNodeTractstack {
        edges {
          node {
            id: drupal_id
            title
            slug: field_slug
            relationships {
              contextPanes: field_context_panes {
                id: drupal_id
                title
                slug: field_slug
                isContextPane: field_is_context_pane
                optionsPayload: field_options
                relationships {
                  markdown: field_markdown {
                    id: drupal_id
                    slug: field_slug
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
      }
    }
  `)
  result.data.allNodeStoryFragment.edges
    .concat(result.data.allNodeTractstack.edges)
    .forEach((edge: any) => {
      edge.node.relationships.contextPanes.forEach((node: any) => {
        createPage({
          path: `context/${node.slug}`,
          component: contextPaneTemplate,
          context: {
            id: node.id,
            title: node.title,
            slug: node.field_slug,
            tractStackId: ``,
            tractStackTitle: ``,
            tractStackSlug: ``,
            contextPane: node,
            resources: result.data.allNodeResource,
          },
        })
      })
    })
}

export const onCreateNode = ({
  node,
  createNodeId,
  createContentDigest,
  actions,
}: any) => {
  const { createNode, createParentChildLink } = actions
  const thisType = node.internal.type === `node__markdown` ? `Markdown` : null
  if (thisType) {
    // generate MarkdownRemark and PaneFragment
    const markdownNode: any = {
      id: createNodeId(`${node.id} MarkdownRemark`),
      parent: node.id,
      children: [],
      internal: {
        type: thisType,
        mediaType: `text/markdown`,
        content: node?.field_markdown_body,
      },
    }
    markdownNode.frontmatter = {
      title: node.field_alt_description || node.title,
      id: node.id,
    }
    markdownNode.internal.contentDigest = createContentDigest(markdownNode)
    createNode(markdownNode)
    createParentChildLink({ parent: node, child: markdownNode })
    return markdownNode
  }
  return {}
}

export const createSchemaCustomization = ({ actions }: any) => {
  //actions.printTypeDefinitions({ path: "./typeDefs.txt" })
  const { createTypes } = actions
  const typeDefs = `
  type node__markdown implements Node {
    title: String
    field_slug: String
    field_category_slug: String
    field_markdown_body: String
    field_alt_description: String
    field_is_context_pane: Boolean
    field_image: [node__markdownField_image]
    field_image_svg: [node__markdownField_image_svg]
  }
  type node__markdownRelationships {
    field_image: [file__file] @link(by: "id", from: "field_image___NODE")
    field_image_svg: [file__file] @link(by: "id", from: "field_image_svg___NODE")
    node__pane: [node__pane] @link(by: "id", from: "node__pane___NODE")
  }
  type node__markdownField_image {
    description: String
    drupal_internal__target_id: Int
  }
  type node__markdownField_image_svg {
    description: String
    drupal_internal__target_id: Int
  }
  type node__story_fragment implements Node {
    title: String
    field_slug: String
    field_social_image_path: String
    field_tailwind_background_colour: String
    relationships: node__story_fragmentRelationships
    field_menu: node__story_fragmentField_menu
    field_panes: [node__story_fragmentField_panes]
    field_context_panes: [node__story_fragmentField_context_panes]
    field_tract_stack: node__story_fragmentField_tract_stack
  }
  type node__story_fragmentField_menu {
    drupal_internal__target_id: Int
  }
  type node__story_fragmentField_panes {
    drupal_internal__target_id: Int
  }
  type node__tractstackField_context_panes {
    drupal_internal__target_id: Int
  }
  type node__story_fragmentField_context_panes {
    drupal_internal__target_id: Int
  }
  type node__story_fragmentField_tract_stack {
    drupal_internal__target_id: Int
  }

  type node__story_fragmentRelationships {
    field_menu: node__menu @link(by: "id", from: "field_menu___NODE")
    field_panes: [node__pane] @link(by: "id", from: "field_panes___NODE")
    field_context_panes: [node__pane] @link(by: "id", from: "field_context_panes___NODE")
    field_tract_stack: node__tractstack @link(by: "id", from: "field_tract_stack___NODE")
    node__tractstack: [node__tractstack] @link(by: "id", from: "node__tractstack___NODE")
  }

type node__resource implements Node {
  status: Boolean
  title: String
  field_action_lisp: String
  field_oneliner: String
  field_options: String
  field_slug: String
  field_category_slug: String
}

  type node__tractstack implements Node {
    field_slug: String
    field_social_image_path: String
    relationships: node__tractstackRelationships
    field_story_fragments: [node__tractstackField_story_fragments]
    field_context_panes: [node__tractstackField_context_panes]
  }

  type node__pane implements Node {
    title: String
    field_height_offset_desktop: Int
    field_height_offset_mobile: Int
    field_height_offset_tablet: Int
    field_height_ratio_desktop: String
    field_height_ratio_mobile: String
    field_height_ratio_tablet: String
    field_slug: String
    field_options: String
    relationships: node__paneRelationships
    field_markdown: [node__markdown]
    field_image: [node__paneField_image]
    field_image_svg: [node__paneField_image_svg]
  }
  type node__paneRelationships {
    node__story_fragment: [node__story_fragment] @link(by: "id", from: "node__story_fragment___NODE")
    node__markdown: [node__markdown] @link(by: "id", from: "node__markdown___NODE")
    field_image: [file__file] @link(by: "id", from: "field_image___NODE")
    field_image_svg: [file__file] @link(by: "id", from: "field_image_svg___NODE")
  }
  type node__paneField_image {
    description: String
    drupal_internal__target_id: Int
  }
  type node__paneField_image_svg {
    description: String
    drupal_internal__target_id: Int
  }

  type node__menu implements Node {
    field_options: String
    field_theme: String
    relationships: node__menuRelationships
 }
  type node__menuRelationships {
    node__story_fragment: [node__story_fragment] @link(by: "id", from: "node__story_fragment___NODE")
  }

  type node__tractstackRelationships {
    field_story_fragments: [node__story_fragment] @link(by: "id", from: "field_story_fragments___NODE")
    field_context_panes: [node__pane] @link(by: "id", from: "field_context_panes___NODE")
    node__story_fragment: [node__story_fragment] @link(by: "id", from: "node__story_fragment___NODE")
  }

  type node__tractstackField_story_fragments {
    drupal_internal__target_id: Int
  }

  type file__file implements Node {
    relationships: file__fileRelationships
    localFile: File @link(by: "id", from: "localFile___NODE")
  }

  type file__fileRelationships {
    node__markdown: [node__markdown] @link(by: "id", from: "node__markdown___NODE")
  }

  `
  createTypes(typeDefs)
}
