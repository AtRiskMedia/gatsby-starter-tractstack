// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'

import { useAuthStore } from '../../stores/authStore'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

const ZeroParty = () => {
  const authData = useAuthStore((state) => state.authData)
  const authenticated = authData.authenticated

  return (
    <>
      <Header siteTitle="Powered by Tract Stack" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="zeroParty" auth={authenticated} />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9">
                  <div className="py-6 px-4 sm:p-6 lg:pb-8 my-16">
                    <h3 className="text-3xl font-bold tracking-tight text-orange sm:text-4xl">
                      Zero-party data policy
                    </h3>

                    <p className="text-2xl text-darkgrey font-bold mt-4 md:max-w-2xl">
                      Think of this website as an interactive business pitch
                      deck presented as a choose your own adventure style buyers
                      guide <em>... a &quot;flipped&quot; sales funnel!</em>
                    </p>

                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      As you navigate this site, event-based data is being
                      tracked. Our special algorithms are taking note of where
                      you place your attention. Depending on your path through
                      this site, we may make recommendations for free supports
                      and resources. Behind-the-scenes we are building a{` `}
                      <Link
                        to="/concierge/graph"
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                      >
                        knowledge graph
                      </Link>
                      {` `}
                      which uses machine learning to help us better understand
                      how buyers like yourself move through our funnel.
                    </p>
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      Above all, the{` `}
                      <a
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                        href={`https://tractstack.com`}
                      >
                        Tract Stack
                      </a>
                      {` `}
                      technology has been painstakenly hand-crafted to equip
                      brands, agencies, and service companies with the tools
                      they need to validate their product-market-fit. If you
                      {` `}
                      <em>are not</em> their market, we want to honour your time
                      and help you quickly reach this realization. But{` `}
                      <em>if you are</em> a prospective buyer, this site is
                      designed for you!
                    </p>
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      You may elect to{` `}
                      <Link
                        to="/concierge/profile"
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                      >
                        introduce yourself
                      </Link>
                      . Elsewhere through the site you may see &quot;belief
                      widgets&quot; where you can express yourself. Any data you
                      provide is anonymized and would be used <em>within</em>
                      {` `}
                      our app to generate insights about how our
                      products/services resonate with buyers like yourself.
                    </p>
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      If you do{` `}
                      <Link
                        to={`/concierge/profile`}
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                      >
                        introduce yourself
                      </Link>
                      , you&apos;ll have full control to set your communication
                      preferences. If you <em>do</em> wish to be personally
                      contacted directly, set your communication preferences to
                      DMs open.
                    </p>
                  </div>
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

export const Head = () => <Seo title="Powered by Tract Stack" />

export default ZeroParty
