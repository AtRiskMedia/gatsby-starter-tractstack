// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { useAuthStore } from '../stores/authStore'
import Hex from '../../assets/hex.svg'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'
import { IViewportKeyProps } from '../types'
import Belief from '../components/Belief'

const PreLaunchHero = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const beliefs = useAuthStore((state) => state.beliefs)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const confusing = !!beliefs?.Confusing
    const nonTechnical = !!beliefs?.NonTechnical
    const thisCount =
      confusing && nonTechnical ? 2 : confusing ? 1 : nonTechnical ? 1 : 0
    if (thisCount !== count) setCount(thisCount)
  }, [count, setCount, beliefs])

  return (
    <>
      <div className="py-24 px-6 sm:px-6 lg:px-8 bg-gradient2 relative">
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
            Make your own opinionated no-code website
          </p>
        </div>
      </div>
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
                    {count < 2 ? (
                      <p>
                        <span className="font-bold italic">
                          Opinionated website ahead:
                        </span>
                        {` `}
                        &nbsp; Tell us your opinions and this website will
                        adjust its tone and adapt to give you a better
                        experience.
                      </p>
                    ) : (
                      <>
                        <p>
                          <span className="font-bold italic">Noted!</span>
                          {` `}
                          &nbsp; Your opinions have been applied. This website
                          experience has been adjusted.
                        </p>
                        <p className="mt-6">Change your answers at any time.</p>
                      </>
                    )}
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
                        Already familiar with Tract Stack?{` `}
                        <Belief
                          value={{ slug: `Confusing`, scale: `tf` }}
                          cssClasses={``}
                          storyFragmentId={storyFragmentId}
                        />
                      </li>
                    </ul>
                    <p className="mt-6">
                      {count < 2 ? (
                        <span>
                          Please respond to the above two statements to get
                          started.
                        </span>
                      ) : null}
                      {` `}
                      {count === 1 ? (
                        <span className="font-action text-green">
                          ({count}/2 answered)
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
    </>
  )
}

export default PreLaunchHero
