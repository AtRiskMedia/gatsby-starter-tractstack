// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { Link } from 'gatsby'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

const ZeroParty = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const authData = useAuthStore((state) => state.authData)
  const authenticated = authData.authenticated

  useEffect(() => {
    if (!loaded) {
      setLastStoryStep(`zeroParty`, `conciergePage`)
      setLoaded(true)
    }
  }, [loaded, setLoaded, setLastStoryStep])

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
                      guide <em>... a &quot;flipped&quot; sales funnel.</em>
                    </p>

                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      As you navigate this site, anonymized events-based data is
                      being collected. Behind-the-scenes we are building a{` `}
                      <Link
                        to="/concierge/graph"
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                      >
                        knowledge graph
                      </Link>
                      {` `}
                      which uses machine learning to help us better understand
                      how buyers like yourself interface with us.
                    </p>
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      You are encouraged to{` `}
                      <Link
                        to="/concierge/profile"
                        className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                      >
                        introduce yourself
                      </Link>
                      . You&apos;ll have full control of your communication
                      preferences. [Set your communication preferences to DMs
                      open if you wish to be personally contacted directly.]
                    </p>
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      Throughout the site you may see &quot;belief widgets&quot;
                      where you can express yourself. Any questions asked are
                      intended to help your through the buying journey. If
                      you&quot;re comfortable sharing your thoughts, this
                      website responds <em>adaptively</em> by revealing new
                      content pathways to meet your needs.
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
