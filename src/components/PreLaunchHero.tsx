// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import Hex from '../../assets/hex.svg'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { IViewportKeyProps } from '../types'

const PreLaunchHero = ({ viewportKey }: IViewportKeyProps) => {
  return (
    <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8 bg-gradient2 relative">
      {viewportKey !== `mobile` ? (
        <div className="absolute top-0 left-0 xl:left-16">
          <Hex className="w-52 lg:w-60 xl:w-80 fill-slate-200" />
        </div>
      ) : null}
      <div className="mx-auto max-w-sm md:max-w-md text-center z-50 relative">
        <div className="flex flex-col">
          <Logo className="h-16 mb-2 xl:h-20" />
          <Wordmark className="h-10 xl:h-12 fill-black" />
        </div>
        <p className="mt-10 text-2xl leading-10 text-black xl:text-r3xl xl:max-w-lg text-center">
          Make opinionated no-code websites
        </p>
      </div>
    </div>
  )
}

export default PreLaunchHero
