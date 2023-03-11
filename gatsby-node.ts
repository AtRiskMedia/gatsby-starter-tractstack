import type { GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

const path = require(`path`)

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions }) => {
  const { createPage } = actions
  const contextPaneTemplate = path.resolve(`src/templates/contextPane.tsx`)
  const result: any = await graphql(`
    query {
      allNodeStoryFragment {
        edges {
          node {
            relationships {
              field_tract_stack {
                id
                title
                field_slug
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
      }
      allNodeTractstack {
        edges {
          node {
            id
            title
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
            }
          }
        }
      }
    }
  `)

  result.data.allNodeStoryFragment.edges
    .concat(result.data.allNodeTractstack.edges)
    .forEach((edge: any) => {
      edge.node.relationships.field_context_panes.forEach((node: any) => {
        createPage({
          path: `context/${node.field_slug}`,
          component: contextPaneTemplate,
          context: {
            id: node.id,
            title: node.title,
            tractStackId: node.relationships.field_tract_stack?.id || node.id,
            tractStackTitle:
              node.relationships.field_tract_stack?.title || node.title,
            tractStackSlug:
              node.relationships.field_tract_stack?.field_slug ||
              node.field_slug,
            contextPane: node,
          },
        })
      })
    })
}
