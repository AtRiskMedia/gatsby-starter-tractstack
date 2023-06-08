// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
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
  const breakTop = Svg(`kCzbangA`, viewportKey, `herobangA`)
  const breakBottom = Svg(`kCzlowcutD`, viewportKey, `herolowcutD`)

  useEffect(() => {
    const confusing = !!beliefs?.Confusing
    const nonTechnical = !!beliefs?.NonTechnical
    const thisCount =
      confusing && nonTechnical ? 2 : confusing ? 1 : nonTechnical ? 1 : 0
    if (thisCount !== count) setCount(thisCount)
  }, [count, setCount, beliefs])

  return (
    <>
      <div>
        <div className="absolute">
          <Hex className="w-[40rem] ml-[50%] lg:ml-[80%] fill-slate-200" />
        </div>
        <div className="absolute w-full h-full z-0 bg-white-gradient"></div>
        <div className="z-30 relative py-24 pl-8 md:pl-24 max-w-xs md:max-w-sm lg:max-w-md">
          <div className="flex flex-col w-fit">
            <Logo className="h-16 mb-2" />
            <Wordmark className="h-10 fill-black" />
          </div>
          <p className="mt-6 text-3xl text-black">
            A better way to court buyers
          </p>
          <p className="mt-6 max-w-xs text-lg text-darkgrey">
            no-code, build-your-own fast, beautiful, and fully accessible
            website to grow your brand / business
          </p>
        </div>
      </div>
      <StyledDiv css="margin-bottom:-1px; position: relative; background:none; svg {fill:#10120d;}">
        {breakTop}
      </StyledDiv>
      <div className="py-16 px-6 sm:px-6 lg:px-8 bg-blue-gradient relative">
        <div className="sm:px-8 my-16" id="beliefs">
          <div className="mx-auto max-w-7xl lg:px-8">
            <div className="relative px-4 sm:px-8 lg:px-12">
              <div className="mx-auto max-w-2xl lg:max-w-5xl">
                <div className="max-w-2xl md:flex md:flex-row mx-auto">
                  <h3 className="font-action text-xl font-bold tracking-tight text-allwhite sm:text-2xl">
                    What&apos;s your jam?
                  </h3>
                  <div className="my-auto text-xl text-white pl-12 mt-6 md:mt-0">
                    <ul>
                      <li className="mt-6">
                        Do you prefer non-technical explanations{` `}
                        <Belief
                          value={{ slug: `NonTechnical`, scale: `agreement` }}
                          cssClasses={``}
                          storyFragmentId={storyFragmentId}
                        />
                      </li>
                      <li className="mt-6">
                        New to Tract Stack?{` `}
                        <Belief
                          value={{ slug: `Confusing`, scale: `tf` }}
                          cssClasses={``}
                          storyFragmentId={storyFragmentId}
                        />
                      </li>
                    </ul>
                    <p className="mt-6">
                      This website adapts to give you the best content
                      experience based on your stated preferences!
                      {` `}
                      {count === 1 ? (
                        <span className="font-action text-green">
                          ({count}/2 answered)
                        </span>
                      ) : count === 2 ? (
                        <span className="mt-6">
                          You can change your answers at any time.
                        </span>
                      ) : null}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StyledDiv css="margin-bottom:-1px; position: relative; background:none; svg {fill:#10120d;}">
        {breakBottom}
      </StyledDiv>
    </>
  )
}

export default PreLaunchHero
