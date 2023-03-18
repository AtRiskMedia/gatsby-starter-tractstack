// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import Graph from '../../components/Graph'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

const ConciergeGraph = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const authData = useAuthStore((state) => state.authData)
  const authenticated = authData.authenticated

  useEffect(() => {
    if (!loaded) {
      setLastStoryStep(`graph`, `conciergePage`)
      setLoaded(true)
    }
  }, [loaded, setLoaded, setLastStoryStep])

  return (
    <>
      <Header siteTitle="Site Map | Knowledge graph" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="graph" auth={authenticated} />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9 h-screen max-h-[40rem]">
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

export const Head = () => <Seo title="Site Map | Knowledge graph" />

export default ConciergeGraph
