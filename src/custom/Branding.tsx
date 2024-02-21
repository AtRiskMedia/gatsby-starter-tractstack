// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Svg } from '@tractstack/helpers'
import styled from 'styled-components'
import {
  CursorArrowRaysIcon,
  CircleStackIcon,
  ArrowTrendingUpIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'
import { IViewportKeyProps } from '@tractstack/types'

import Hexa from '../../assets/hexa.svg'
import { config } from '../../data/SiteConfig'

interface IStyledDivProps {
  css: string
}
const StyledDiv = styled.div<IStyledDivProps>`
  ${(props: any) => props.css};
`

const Branding = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const breakTop =
    viewportKey !== `desktop`
      ? Svg(`kCzlowcut2`, viewportKey, `herolowcut2`)
      : Svg(`kCzlowcutwide2`, viewportKey, `herolowcutwide2`)

  const features = [
    {
      id: `builder`,
      title: `More than a website builder`,
      description: `Everything your business needs to market and sell online. Integrates with your Shopify store.`,
      icon: (
        <CursorArrowRaysIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
    {
      id: `analytics`,
      title: `Meaningful engagement analytics`,
      description: `As buyers engage with your funnel, we'll generate data-driven insight on what does (and doesn't) convert.`,
      icon: (
        <CircleStackIcon
          className="h-10 w-10 absolute left-1 top-2"
          aria-hidden="true"
        />
      ),
    },
    {
      id: `contentMarketing`,
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
      id: `qualifyLeads`,
      title: `Leads that qualify themselves?`,
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
    <>
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="bg-white-gradient overflow-hidden"
      >
        <div className="absolute">
          <Hexa className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] xl:ml-[30rem] fill-white" />
        </div>

        <div className="mx-auto max-w-5xl md:max-w-7xl xl:px-8 mt-12 md:mt-18 mb-18 md:mb-24">
          <p className="relative mt-16 mb-12 text-2xl xl:text-3xl text-myblack text-center font-action font-bold tracking-wider leading-10 max-w-sm mx-auto">
            {config.slogan}
          </p>
          <div className="relative px-8 xl:px-12">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="relative flex items-center space-x-3 rounded-lg bg-white/80 px-6 py-5 shadow-sm"
                >
                  <div className="my-auto flex-shrink-0 pr-6">
                    {feature.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-action text-black">
                      {feature.title}
                    </p>
                    <p className="text-md text-mydarkgrey pt-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <StyledDiv
        css={`
          margin-top: ${viewportKey === `mobile` ? `50` : `-80`}px;
          position: relative;
          background: none;
          svg {
            fill: #ffffff;
          }
        `}
      >
        {breakTop}
      </StyledDiv>
    </>
  )
}

export default Branding
