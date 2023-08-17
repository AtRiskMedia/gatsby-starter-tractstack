import type { GatsbyNode } from 'gatsby'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const path = require(`path`)

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  })
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
            id
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
                id
                title
                slug: field_slug
              }
              contextPanes: field_context_panes {
                id
                title
                slug: field_slug
                relationships {
                  paneFragments: field_pane_fragments {
                    ... on paragraph__markdown {
                      id
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
                      relationships {
                        image: field_image {
                          id
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
            id
            title
            slug: field_slug
            relationships {
              contextPanes: field_context_panes {
                id
                title
                slug: field_slug
                relationships {
                  paneFragments: field_pane_fragments {
                    ... on paragraph__markdown {
                      id
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
      }
    }
  `)

  console.log(result)
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
            tractStackId: node.relationships.tractstack?.id || node.id,
            tractStackTitle: node.relationships.tractstack?.title || node.title,
            tractStackSlug: node.relationships.tractstack?.slug || node.slug,
            contextPane: node,
            resources: result.data.allNodeResource,
          },
        })
      })
    })
}
