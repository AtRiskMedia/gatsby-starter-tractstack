// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { navigate } from 'gatsby'

import { useAuthStore } from '../../stores/authStore'
import Graph from '../../components/Graph'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

const ConciergeGraph = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const knownLead = useAuthStore((state) => state.authData.knownLead)
  const authenticated = useAuthStore((state) => state.authData.authenticated)

  if (isLoggedIn && knownLead && !authenticated) navigate(`/concierge/login`)

  return (
    <Wrapper slug="graph" mode="conciergePage">
      <Header siteTitle="Site Map | Knowledge graph" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="graph" />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9 h-screen max-h-[40rem]">
                  {isLoggedIn ? <Graph /> : null}
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
