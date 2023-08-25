// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import {
  CursorArrowRaysIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline'

import { IViewportKeyProps } from 'gatsby-plugin-tractstack/types'

const FeaturesGrid = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  return (
    <div id={`${viewportKey}-${storyFragmentId.id}`} className="sm:px-8 pb-12 bg-allwhite">
      <div className="mx-auto max-w-5xl md:max-w-7xl lg:px-8">
        <div className="relative px-8 lg:px-12">
          <div className="max-w-3xl md:flex md:flex-row mx-auto w-fit">
            <dl className="mx-auto max-w-lg">
              <div className="relative pl-16 pb-8 pt-6">
                <dt className="inline font-action">
                  <CursorArrowRaysIcon
                    className="h-10 w-10 absolute left-1 top-1"
                    aria-hidden="true"
                  />
                  No-code website builder
                </dt>
                {` `}
                <dd className="pt-2">
                  Get a fast,{` `}
                  <abbr title="Search Engine Optimization / Search Engine Marketing">
                    SEO/SEM
                  </abbr>
                  {` `}
                  ready website up in minutes!
                </dd>
              </div>
              <div className="relative pl-16 pb-8">
                <dt className="inline font-action">
                  <CircleStackIcon
                    className="h-10 w-10 absolute left-1 top-1"
                    aria-hidden="true"
                  />
                  Actionable insights + engagement analytics
                </dt>
                {` `}
                <dd className="pt-2">
                  Customizable dashboards and data-driven insights gleaned from
                  website activity. Learn from your potential buyers.
                </dd>
              </div>
              <div className="relative pl-16 pb-8">
                <dt className="inline font-action">
                  <ArrowTrendingUpIcon
                    className="h-10 w-10 absolute left-1 top-1"
                    aria-hidden="true"
                  />
                  Passive lead generation
                </dt>
                {` `}
                <dd className="pt-2">
                  Show buyers the way through their purchasing journey. Help
                  them understand and &apos;make sense&apos; of each step
                  towards purchase.
                </dd>
              </div>
              <div className="relative pl-16 pb-8">
                <dt className="inline font-action">
                  <BeakerIcon
                    className="h-10 w-10 absolute left-1 top-1"
                    aria-hidden="true"
                  />
                  Better tooling for content marketing
                </dt>
                {` `}
                <dd className="pt-2">
                  Everything you need to rank for keywords and to establish
                  authority in your space.
                </dd>
              </div>
              <div className="relative pl-16 pb-8 pt-6">
                <dt className="inline font-action">
                  <ShoppingCartIcon
                    className="h-10 w-10 absolute left-1 top-1"
                    aria-hidden="true"
                  />
                  E-commerce integration with Shopify
                </dt>
                {` `}
                <dd className="pt-2">
                  Sell your products direct from your website
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesGrid
