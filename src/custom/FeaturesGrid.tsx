// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import {
  CursorArrowRaysIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'

import { IViewportKeyProps } from 'gatsby-plugin-tractstack/types'

const FeaturesGrid = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const features = [
    {
      id: `builder`,
      title: `All-in-one website builder`,
      description: `Everything your business needs to market and sell online. Integrates with your Shopify store.`,
      icon: (
        <CursorArrowRaysIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
    {
      id: `insights`,
      title: `Real-time engagement analytics`,
      description: `As buyers engage with your funnel, we'll generate data-driven insight on what does (and doesn't) convert.`,
      icon: (
        <CircleStackIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
    {
      id: `marketing`,
      title: `Better tooling for content marketing`,
      description: `Removes all the complexity. Gives you everything you'll need in one tool. You retain ownership and control of your data.`,
      icon: (
        <ArrowTrendingUpIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
    {
      id: `qualify`,
      title: `Allows you to "qualify" your leads`,
      description: `Easily create interactive 'mini-funnels' that pre-filter or onboard prospective new buyers/clients.`,
      icon: (
        <BeakerIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
  ]

  return (
    <div
      id={`${viewportKey}-${storyFragmentId.id}`}
      className="sm:px-8 pb-24 bg-allwhite"
    >
      <div className="mx-auto max-w-5xl md:max-w-7xl xl:px-8">
        <div className="relative px-8 xl:px-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="relative flex items-center space-x-3 rounded-lg px-6 py-5 shadow-sm"
              >
                <div className="my-auto flex-shrink-0 pr-6">{feature.icon}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-action text-black">
                    {feature.title}
                  </p>
                  <p className="text-md text-darkgrey pt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesGrid
