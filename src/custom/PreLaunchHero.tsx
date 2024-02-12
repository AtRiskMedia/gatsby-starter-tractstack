// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
// import { Link } from 'gatsby'
import { Svg } from '@tractstack/helpers'
import { IViewportKeyProps } from '@tractstack/types'
import styled from 'styled-components'
// import { InformationCircleIcon } from '@heroicons/react/24/outline'

import Hexa from '../../assets/hexa.svg'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
// import Belief from '../components/Belief'
import { config } from '../../data/SiteConfig'

interface IStyledDivProps {
  css: string
}
const StyledDiv = styled.div<IStyledDivProps>`
  ${(props: any) => props.css};
`

const PreLaunchHero = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const breakTop =
    viewportKey !== `desktop`
      ? Svg(`kCzlowcut2`, viewportKey, `herolowcut2`)
      : Svg(`kCzlowcutwide2`, viewportKey, `herolowcutwide2`)

  const branding = (
    <div className="py-24 mx-auto max-w-xs md:max-w-sm relative z-10">
      <div className="flex flex-col w-fit mx-auto">
        <Logo className="h-16 mb-2" />
        <Wordmark className="h-10 fill-black" />
      </div>
      <p className="mt-6 text-sm text-mydarkgrey text-center font-action tracking-wider">
        {config.slogan}
      </p>
    </div>
  )

  return (
    <>
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="bg-white-gradient overflow-hidden"
      >
        <div className="absolute">
          <Hexa className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] xl:ml-[30rem] fill-white" />
        </div>
        {branding}
      </div>
      <StyledDiv
        css={`
          margin-top: ${viewportKey === `mobile` ? `-30` : `-50`}px;
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

export default PreLaunchHero
