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
    allNodeStoryFragment {
      edges {
        node {
          id
          title
          slug: field_slug
          relationships {
            contextPanes: field_context_panes {
              slug: field_slug
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
            contextPanes: field_context_panes {
              id
              title
              slug: field_slug
            }
          }
        }
      }
    }
    allShopifyProduct(filter: { status: { eq: ACTIVE } }) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
  }
`

const Breadcrumbs = (data: any) => {
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const storyFragments = data.data.allNodeStoryFragment.edges
  const tractStacks = data.data.allNodeTractstack.edges
  const products = data.data.allShopifyProduct.edges
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
  const viewportWidth =
    viewportKey === `mobile`
      ? `600`
      : viewportKey === `tablet`
        ? `1080`
        : `1920`
  const hasBreadcrumbs = Object.keys(storySteps)?.length
  const memory: any[] = []
  const breadcrumbs = Object.keys(storySteps)?.map((e: any, i: number) => {
    if (memory.includes(storySteps[e].id)) return null
    else memory.push(storySteps[e].id)
    const thisSlug = storySteps[e].id
    const isProduct = storySteps[e].type === `product` ? storySteps[e].id : null
    const product = isProduct
      ? products.filter((e: any) => e?.node?.handle === isProduct)[0].node
      : null
    const thisStoryFragmentPayload = storyFragments?.filter(
      (e: any) => e.node.slug === thisSlug,
    )
    const thisContextPanePayload = contextPanes?.filter(
      (e: any) => e.slug === thisSlug,
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
            : isProduct
              ? `product`
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
            : isProduct
              ? product
              : null
    const thisTo =
      type === `storyFragment`
        ? `/${thisPayload.slug}/${viewportWidth}`
        : type === `contextPane`
          ? `/context/${thisPayload.slug}`
          : type === `conciergePage`
            ? `/concierge/${thisPayload.id}`
            : type === `product`
              ? `/products/${thisPayload.handle}`
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
      <Header siteTitle="Breadcrumb Path" open={false} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x shadow-inner shadow-lightgrey">
                <div className="md:col-span-12">
                  <div className="mx-auto max-w-2xl py-16 px-4 md:px-0">
                    <h2 className="text-center text-3xl tracking-tight text-gray-900 md:text-4xl mb-12">
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

                {isLoggedIn() ? (
                  <div className="md:col-span-12 text-center h-96 mb-24">
                    <Graph />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export default Breadcrumbs
