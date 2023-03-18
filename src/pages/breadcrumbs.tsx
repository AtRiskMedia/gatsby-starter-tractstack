// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link, graphql } from 'gatsby'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Graph from '../components/Graph'
import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'

export const query = graphql`
  query {
    allNodeStoryFragment {
      edges {
        node {
          id
          title
          field_slug
          relationships {
            field_context_panes {
              field_slug
              id
              title
            }
          }
        }
      }
    }
    allNodeTractstack {
      edges {
        node {
          relationships {
            field_context_panes {
              id
              title
              field_slug
            }
          }
        }
      }
    }
  }
`

const Breadcrumbs = (data: any) => {
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const storyFragments = data.data.allNodeStoryFragment.edges
  const tractStacks = data.data.allNodeTractstack.edges
  const contextPanes: any[] = []
  storyFragments.forEach((e: any) => {
    e.node.relationships.field_context_panes.forEach((p: any) => {
      contextPanes.push(p)
    })
  })
  tractStacks.forEach((e: any) => {
    e.node.relationships.field_context_panes.forEach((p: any) => {
      contextPanes.push(p)
    })
  })
  const thisWidth = typeof window !== `undefined` ? window?.innerWidth : 0
  const viewportWidth =
    thisWidth < 801 ? `600` : thisWidth < 1367 ? `1080` : `1920`
  const hasBreadcrumbs = Object.keys(storySteps)?.length
  const breadcrumbs = Object.keys(storySteps)?.map((e: any, i: number) => {
    const thisSlug = storySteps[e].id
    const thisStoryFragmentPayload = storyFragments?.filter(
      (e: any) => e.node.field_slug === thisSlug,
    )
    const thisContextPanePayload = contextPanes?.filter(
      (e: any) => e.field_slug === thisSlug,
    )
    const thisConciergePagePayload = config.conciergeNav?.filter(
      (e: any) => e.id === thisSlug,
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
          : thisConciergePagePayload && thisConciergePagePayload[0]
            ? `conciergePage`
            : null
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
            ? thisConciergePagePayload && thisConciergePagePayload[0]
            : null
    const thisTo =
      type === `storyFragment`
        ? `/${thisPayload.field_slug}/${viewportWidth}`
        : type === `contextPane`
          ? `/context/${thisPayload.field_slug}`
          : type === `conciergePage`
            ? `/concierge/${thisPayload.id}`
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
    <>
      <Header siteTitle="Breadcrumb Path" open={false} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <div className="lg:col-span-12">
                  <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
                    <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-12">
                      Your Breadcrumbs Path
                    </h2>
                    {hasBreadcrumbs ? (
                      breadcrumbs
                    ) : (
                      <p className="text-center">
                        No breadcrumbs found!
                        {` `}
                        <Link to={`/${config.home}/${viewportWidth}/`}>
                          Visit the Home Page
                        </Link>
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-12 text-center h-64 mb-24">
                  <Graph />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Breadcrumbs