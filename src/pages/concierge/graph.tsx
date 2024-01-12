// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { navigate, graphql } from 'gatsby'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import Graph from '../../components/Graph'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'
import { config } from '../../../data/SiteConfig'

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

const ConciergeGraph = ({ data }: any) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const knownLead = useAuthStore((state) => state.authData.knownLead)
  const authenticated = useAuthStore((state) => state.authData.authenticated)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  let target: any // FIX
  Object.keys(storySteps).forEach((e) => {
    if (storySteps[e]?.type !== `conciergePage`) target = storySteps[e]
  })
  if (isLoggedIn && knownLead && !authenticated) navigate(`/concierge/login`)

  function close() {
    const thisTo =
      target?.type === `storyFragment`
        ? `/${target.id}/`
        : target?.type === `contextPane`
          ? `/context/${target.id}`
          : target?.type === `conciergePage`
            ? `/concierge/${target.id}`
            : target?.type === `product`
              ? `/products/${target.id}`
              : target?.type === `/breadcrumbs`
                ? `${target.id}`
                : `/${config.home}`
    navigate(`${thisTo}`)
  }

  return (
    <Wrapper slug="graph" mode="conciergePage">
      <Header siteTitle="Site Map | Knowledge graph" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 md:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="graph" />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 md:col-span-9 h-screen h-screen relative">
                  <div className="absolute right-4 top-4 text-darkgrey hover:text-orange">
                    <button onClick={() => close()}>
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  {isLoggedIn ? (
                    <Graph data={data} />
                  ) : (
                    <p className="p-6">
                      Insufficient data found. Please check back after
                      navigating the site!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export const Head = () => <Seo title="Site Map | Knowledge graph" />

export default ConciergeGraph
