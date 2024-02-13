// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'

import Seo from '../../components/Seo'
import Wrapper from '../../components/Wrapper'
import Footer from '../../components/Footer'

const Builder = () => {
  return (
    <Wrapper slug="builder" mode="conciergePage">
      <header className="relative z-90000">
        <div className="mx-auto flex justify-between px-4 py-5 md:space-x-10 md:px-8 bg-white shadow-inner shadow-darkgrey">
          <div className="flex flex-nowrap">
            <h1 className="text-xl leading-none mb-0 flex items-center font-action">
              Story Keep | Edit this Site
            </h1>
          </div>
          <div className="inline-flex">
            <Link to={`/`} className="mx-2 hover:text-blue">
              Close
            </Link>
          </div>
        </div>
      </header>
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-mydarkgrey shadow h-max">
              <div className="p-1 h-screen">
                <iframe
                  key="storykeep"
                  title="Your Story Keep"
                  src={process.env.STORYKEEP_URL}
                  width="100%"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export const Head = () => <Seo title="Tract Stack Story Keep" />

export default Builder
