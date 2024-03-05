// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link, graphql } from 'gatsby'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Graph from '../components/Graph'
import Wrapper from '../components/Wrapper'
import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'

export const query = graphql`
  query {
    allNodeTractstack {
      edges {
        node {
          title
          relationships {
            storyFragments: field_story_fragments {
              title
              slug: field_slug
            }
            contextPanes: field_context_panes {
              id: drupal_id
              title
              slug: field_slug
            }
          }
        }
      }
    }
    allNodeStoryFragment {
      edges {
        node {
          title
          slug: field_slug
          relationships {
            contextPanes: field_context_panes {
              id: drupal_id
              title
              slug: field_slug
            }
            panes: field_panes {
              id: drupal_id
              title
              slug: field_slug
            }
          }
        }
      }
    }
  }
`

const Breadcrumbs = (data: any) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const storyFragments = data.data.allNodeStoryFragment.edges
  const tractStacks = data.data.allNodeTractstack.edges
  const contextPanes: any[] = []
  storyFragments.forEach((e: any) => {
    e.node.relationships.contextPanes.forEach((p: any) => {
      contextPanes.push(p)
    })
  })
  tractStacks.forEach((e: any) => {
    e.node.relationships.contextPanes.forEach((p: any) => {
      contextPanes.push(p)
    })
  })
  const hasBreadcrumbs = Object.keys(storySteps)?.length
  const memory: any[] = []
  const breadcrumbs = Object.keys(storySteps)?.map((e: any, i: number) => {
    if (memory.includes(storySteps[e].id)) return null
    else memory.push(storySteps[e].id)
    const thisSlug = storySteps[e].id
    const thisStoryFragmentPayload = storyFragments?.filter(
      (e: any) => e.node.slug === thisSlug,
    )
    const thisContextPanePayload = contextPanes?.filter(
      (e: any) => e.slug === thisSlug,
    )
    const type =
      thisStoryFragmentPayload &&
      thisStoryFragmentPayload[0] &&
      thisStoryFragmentPayload[0].node
        ? `storyFragment`
        : thisContextPanePayload &&
            thisContextPanePayload[0] &&
            thisContextPanePayload[0].title
          ? `contextPane`
          : `conciergePage`
    const thisPayload =
      type === `storyFragment`
        ? thisStoryFragmentPayload &&
          thisStoryFragmentPayload[0] &&
          thisStoryFragmentPayload[0].node
        : type === `contextPane`
          ? thisContextPanePayload &&
            thisContextPanePayload[0] &&
            thisContextPanePayload[0]
          : type === `conciergePage`
            ? thisSlug
            : null
    const thisTo =
      type === `storyFragment` && thisPayload.slug === config.home
        ? `/`
        : type === `storyFragment`
          ? `/${thisPayload.slug}`
          : type === `contextPane`
            ? `/context/${thisPayload.slug}`
            : type === `conciergePage`
              ? `/concierge/${thisPayload}`
              : null
    if (thisPayload && thisTo)
      return (
        <p key={`${thisPayload.id}-${i}`} className="text-center p-6">
          <Link to={thisTo}>{thisPayload.title}</Link>
        </p>
      )
    return <></>
  })

  return (
    <Wrapper slug="breadcrumbs" mode="breadcrumbs">
      <Header
        siteTitle="Your Content Journey | Breadcrumbs Path"
        open={false}
      />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-screen">
              <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x shadow-inner shadow-lightgrey">
                <div className="md:col-span-12">
                  <div className="mx-auto max-w-2xl py-8 px-4 md:px-0">
                    <h2 className="text-center text-3xl tracking-tight text-myblack md:text-4xl mb-12">
                      Your Content Journey | Breadcrumbs Path
                    </h2>
                    {hasBreadcrumbs ? (
                      breadcrumbs
                    ) : (
                      <p className="text-center">
                        No breadcrumbs found!
                        {` `}
                        <Link to="/">Visit the Home Page</Link>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {isLoggedIn() ? (
                <div className="h-3/5">
                  <Graph data={data.data} />
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export default Breadcrumbs
