// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { Svg } from 'gatsby-plugin-tractstack'
import styled from 'styled-components'

import { useAuthStore } from '../stores/authStore'
import Hex from '../../assets/hex.svg'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { IViewportKeyProps } from '../types'

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

  return (
    <>
      <div id={`${viewportKey}-${storyFragmentId}`}>
        <div className="absolute">
          <Hex className="w-[40rem] xl:w-[60rem] ml-[50%] xl:ml-[40%] lg:ml-[80%] fill-slate-200" />
        </div>
        <div className="absolute w-full h-full z-0 bg-white-gradient"></div>
        <div className="z-30 relative py-24 pl-8 md:pl-24 max-w-xs md:max-w-sm lg:max-w-md">
          <div className="flex flex-col w-fit">
            <Logo className="h-16 mb-2" />
            <Wordmark className="h-10 fill-black" />
          </div>
          <p className="mt-6 text-3xl text-black">
            A better way to reach buyers
          </p>
          <p className="mt-6 max-w-xs text-lg text-darkgrey">
            no-code, build-your-own fast and fully accessible websites to grow
            your brand or business
          </p>
        </div>
      </div>
      <StyledDiv css="margin-bottom:-1px; position: relative; background:none; svg {fill:#393d34;}">
        {breakTop}
      </StyledDiv>
    </>
  )
}

export default PreLaunchHero
