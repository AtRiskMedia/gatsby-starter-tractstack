// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import Footer from '../../components/Footer'

const Builder = () => {
  return (
    <Wrapper slug="builder" mode="conciergePage">
      <Header siteTitle="Builder" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-slate-50 shadow h-max">
              <div className="p-1 h-screen">
                <iframe
                  title="Tract Stack Story Keep"
                  src="https://builder.tractstack.com"
                  width="100%"
                  className="w-full h-full"
                  seamless={true}
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
