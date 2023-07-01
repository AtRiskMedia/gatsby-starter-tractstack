// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { Svg } from 'gatsby-plugin-tractstack'
import styled from 'styled-components'

import { useAuthStore } from '../stores/authStore'
import Hex from '../../assets/hex.svg'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { IViewportKeyProps } from '../types'
import Belief from '../components/Belief'

interface IStyledDivProps {
  css: string
}
const StyledDiv = styled.div<IStyledDivProps>`
  ${(props: any) => props.css};
`

const PreLaunchHero = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const beliefs = useAuthStore((state) => state.beliefs)
  const [count, setCount] = useState(0)
  const breakTop =
    viewportKey !== `desktop`
      ? Svg(`kCzlowcutC`, viewportKey, `herolowcutC`)
      : Svg(`kCzlowcutwideC`, viewportKey, `herolowcutwideC`)

  useEffect(() => {
    const confusing = !!beliefs?.Confusing
    const nonTechnical = !!beliefs?.NonTechnical
    const thisCount =
      confusing && nonTechnical ? 2 : confusing ? 1 : nonTechnical ? 1 : 0
    if (thisCount !== count) setCount(thisCount)
  }, [count, setCount, beliefs])

  const branding =
    viewportKey === `mobile` ? (
      <div className="z-30 relative pt-16 px-6">
        <div className="flex flex-row flex-nowrap">
          <div className="px-6">
            <div className="flex flex-col w-fit">
              <Logo className="h-10 mb-2" />
              <Wordmark className="h-6 fill-black" />
            </div>
            <p className="mt-4 text-md text-black">
              A better way to reach buyers
            </p>
          </div>
          <div className="flex flex-col place-content-center place-items-center">
            <p className="text-sm text-darkgrey pl-8 font-action tracking-wider px-6 max-w-xs">
              no-code, build-your-own fast and fully accessible websites to grow
              your brand or business
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div className="z-30 relative py-12 md:py-24 ml-12 max-w-sm">
        <div className="flex flex-col w-fit">
          <Logo className="h-16 mb-2" />
          <Wordmark className="h-10 fill-black" />
        </div>
        <p className="mt-6 text-3xl text-black">A better way to reach buyers</p>
        <p className="mt-6 text-md text-darkgrey font-action tracking-wider">
          no-code, build-your-own fast and fully accessible websites to grow
          your brand or business
        </p>
      </div>
    )

  return (
    <>
      <div id={`${viewportKey}-${storyFragmentId}`}>
        <div className="absolute">
          <Hex className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] lg:w-[60rem] lg:ml-[20rem] xl:ml-[30rem] fill-white" />
        </div>
        <div className="absolute w-full h-full z-0 bg-white-gradient"></div>
        <div className="md:flex md:flex-row md:flex-nowrap mx-auto">
          {branding}
          <div className="z-50 relative mt-8 mb-12 md:my-auto md:ml-16 p-6">
            <div className="w-full rounded-xl bg-story-controls p-6 max-w-xl mx-auto -rotate-2">
              <ul>
                <li>
                  <h3 className="font-action text-orange text-xl">
                    What&apos;s your jam?
                  </h3>
                </li>
                <li>
                  <p className="text-gray-700">
                    Use these widgets to customize your web reading experience!
                  </p>
                </li>
                <li className="mt-6">
                  I prefer non-technical explanations{` `}
                  <Belief
                    value={{ slug: `NonTechnical`, scale: `agreement` }}
                    cssClasses={``}
                    storyFragmentId={storyFragmentId}
                  />
                </li>
                <li className="mt-6">
                  I&apos;m already familiar with Tract Stack{` `}
                  <Belief
                    value={{ slug: `AlreadyFamiliar`, scale: `tf` }}
                    cssClasses={``}
                    storyFragmentId={storyFragmentId}
                  />
                </li>
                <li className="mt-6">
                  To read more on our data practices and professional standards,
                  please see our{` `}
                  <Link
                    to={`/concierge/zeroParty`}
                    className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                  >
                    Zero Party data privacy policy
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <StyledDiv css="margin-bottom:-1px; position: relative; background:none; svg {fill:#393d34;}">
        {breakTop}
      </StyledDiv>
    </>
  )
}

export default PreLaunchHero
