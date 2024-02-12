// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Svg } from '@tractstack/helpers'
import { IViewportKeyProps } from '@tractstack/types'
import styled from 'styled-components'

import Hexa from '../../assets/hexa.svg'
import Wordmark from '../../assets/ARm-wordmark.svg'
import Logo from '../../assets/ARm-logo.svg'

interface IStyledDivProps {
  css: string
}
const StyledDiv = styled.div<IStyledDivProps>`
  ${(props: any) => props.css};
`

const AtRiskMedia = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const breakTop =
    viewportKey !== `desktop`
      ? Svg(`kCzlowcut2`, viewportKey, `herolowcut2`)
      : Svg(`kCzlowcutwide2`, viewportKey, `herolowcutwide2`)

  const branding = (
    <div className="py-24 mx-auto w-fit relative z-10">
      <div className="flex flex-col w-fit">
        <span className="mb-2">
          <Logo className="h-14 mx-auto fill-myblack" />
        </span>
        <Wordmark className="h-6 fill-myblack" />
      </div>
    </div>
  )

  return (
    <>
      <div
        id={`${viewportKey}-${storyFragmentId.id}`}
        className="bg-white-gradient overflow-hidden"
      >
        <div className="absolute">
          <Hexa className="w-[40rem] ml-[10rem] md:w-[60rem] md:ml-[10rem] xl:ml-[30rem] fill-mywhite" />
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

export default AtRiskMedia
