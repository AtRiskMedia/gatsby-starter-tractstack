// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link, navigate } from 'gatsby'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { useStoryStepStore } from '../../stores/storyStep'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'
import { config } from '../../../data/SiteConfig'

const ZeroParty = () => {
  const storySteps = useStoryStepStore((state) => state.storySteps)
  let target: any // FIX
  Object.keys(storySteps).forEach((e) => {
    if (storySteps[e]?.type !== `conciergePage`) target = storySteps[e]
  })
  function close() {
    const thisViewport =
      window.innerWidth < 801
        ? `600`
        : window.innerWidth < 1367
        ? `1080`
        : `1920`
    const thisTo =
      target?.type === `storyFragment`
        ? `/${target.id}/${thisViewport}`
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
    <Wrapper slug="zeroParty" mode="conciergePage">
      <Header siteTitle="Powered by Tract Stack" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="zeroParty" />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9 relative">
                  <div className="absolute right-4 top-4 text-darkgrey hover:text-orange">
                    <button onClick={() => close()}>
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="py-6 px-4 sm:p-6 lg:pb-8 my-16">
                    <h3 className="text-3xl tracking-tight text-orange sm:text-4xl">
                      Zero-party data policy
                    </h3>

                    <p className="text-2xl text-darkgrey mt-4 md:max-w-2xl">
                      Think of this website as an interactive business pitch
                      deck presented as a choose your own adventure style buyers
                      guide <em>... a &quot;flipped&quot; sales funnel.</em>
                    </p>

                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      As you navigate this site, anonymized events-based data is
                      being collected. Behind-the-scenes we are building a{` `}
                      <Link
                        to="/concierge/graph"
                        className="no-underline hover:underline hover:underline-offset-1 text-blue hover:text-orange"
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
                        className="no-underline hover:underline hover:underline-offset-1 text-blue hover:text-orange"
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
                    <p className="text-lg text-darkgrey mt-4 md:max-w-2xl">
                      Tract Stack is currently pre-launch and pre-revenue. We
                      are not monetizing or selling/sharing any data with third
                      parties. We will soon add functionality to opt-out and
                      even wipe any associated data.
                    </p>
                  </div>
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

export const Head = () => <Seo title="Powered by Tract Stack" />

export default ZeroParty
