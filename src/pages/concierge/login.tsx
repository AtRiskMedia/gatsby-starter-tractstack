// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
import { navigate, Link } from 'gatsby'
import { classNames } from 'gatsby-plugin-tractstack'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { XMarkIcon } from '@heroicons/react/24/outline'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import { getTokens } from '../../api/axiosClient'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'
import { config } from '../../../data/SiteConfig'

const ConciergeLogin = () => {
  const [badLogin, setBadLogin] = useState(false)
  const firstName = useAuthStore((state) => state.authData.firstname)
  const knownLead = useAuthStore((state) => state.authData.knownLead)
  const authenticated = useAuthStore((state) => state.authData.authenticated)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const knownEmail = useAuthStore((state) => state.authData.email)
  const knownFirstName = typeof firstName === `string`
  const [email, setEmail] = useState(
    typeof knownEmail === `string` && knownEmail ? knownEmail : ``,
  )
  const [codeword, setCodeword] = useState(``)
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(0)
  const fingerprint = useAuthStore((state) => state.fingerprint)
  const login = useAuthStore((state) => state.login)
  const [loggingIn, setLoggingIn] = useState(0)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  let target: any // FIX
  Object.keys(storySteps).forEach((e) => {
    if (storySteps[e]?.type !== `conciergePage`) target = storySteps[e]
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (email && codeword && fingerprint && !loggingIn) {
      getTokens(fingerprint, codeword, email)
        .then((res) => {
          if (typeof res?.error === `string`) {
            setSuccess(-1)
            setBadLogin(true)
          } else if (res?.tokens !== null) {
            login(res)
            navigate(`/concierge/profile`)
          }
        })
        .catch(() => {
          setSuccess(-1)
        })
        .finally(() => setLoggingIn(0))
    }
    setSubmitted(true)
  }

  if (authenticated) navigate(`/concierge/profile`)

  function close() {
    const thisTo =
      target?.type === `storyFragment`
        ? `/${target.id}/`
        : target?.type === `contextPane`
        ? `/context/${target.id}`
        : target?.type === `conciergePage`
        ? `/concierge/${target.id}`
        : target?.type === `product`
        ? `/products/${target.id}`
        : target?.type === `/breadcrumbs`
        ? `${target.id}`
        : `/${config.home}`
    navigate(`${thisTo}`)
  }

  return (
    <Wrapper slug="login" mode="conciergePage">
      <Header siteTitle="Login" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="login" />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9 relative">
                  <div className="absolute right-4 top-4 text-darkgrey hover:text-orange">
                    <button onClick={() => close()}>
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl my-16">
                    <div>
                      <h2 className="text-3xl tracking-tight text-orange sm:text-4xl">
                        Welcome back
                        {!authenticated && knownFirstName
                          ? `, ${firstName}.`
                          : null}
                      </h2>
                      {isLoggedIn && !authenticated && knownLead ? null : (
                        <p className="text-blue text-lg mt-4 mb-4">
                          First visit?{` `}
                          <Link
                            to={`/concierge/profile`}
                            className="no-underline hover:underline hover:underline-offset-1 text-blue hover:text-orange font-main font-bold"
                          >
                            Create Profile
                          </Link>
                          .
                        </p>
                      )}
                      <p className="mt-4 mb-6 text-lg text-gray-700">
                        To access your profile, please enter your code word and
                        confirm your email:
                      </p>
                    </div>
                    <form id="login" onSubmit={handleSubmit} method="POST">
                      <div className="grid grid-cols-3 gap-4 bg-slate-50">
                        <div className="col-span-3 sm:col-span-1">
                          <label
                            htmlFor="codeword"
                            className="block text-sm text-gray-700 font-bold"
                          >
                            Code word:
                          </label>
                          <input
                            type="text"
                            name="codeword"
                            id="codeword"
                            autoComplete="off"
                            defaultValue={codeword}
                            onBlur={(e) => setCodeword(e.target.value)}
                            className={classNames(
                              `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                              (submitted && codeword === ``) || success === -1
                                ? `border-red-500`
                                : `border-gray-300`,
                            )}
                          />
                          {submitted && codeword === `` ? (
                            <span className="text-xs px-2 text-red-500 font-action">
                              Required field.
                            </span>
                          ) : (
                            <></>
                          )}
                        </div>
                        <div className="col-span-3 sm:col-span-2">
                          <label
                            htmlFor="email"
                            className="block text-sm text-gray-700 font-bold"
                          >
                            Email address
                          </label>
                          <input
                            type="text"
                            readOnly={!!knownEmail}
                            name="email"
                            id="email"
                            autoComplete="email"
                            defaultValue={email}
                            onBlur={(e) => setEmail(e.target.value)}
                            className={classNames(
                              `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                              submitted && email === ``
                                ? `border-red-500`
                                : `border-gray-300`,
                              knownEmail ? `text-lightgrey` : ``,
                            )}
                          />
                          {submitted && email === `` && (
                            <span className="text-xs px-2 text-red-500">
                              Required field.
                            </span>
                          )}
                        </div>
                        {success === -1 || badLogin ? (
                          <div className="col-span-3 italic text-red-500">
                            <p>
                              Those credentials did not match our records.
                              Please try again.
                            </p>
                          </div>
                        ) : null}
                        <div className="col-span-3 mt-6">
                          <button
                            type="submit"
                            className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm text-allblack shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                          >
                            <span className="pr-4">Authenticate</span>
                            <ChevronRightIcon
                              className="h-5 w-5 mr-3"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export const Head = () => <Seo title="Login" />

export default ConciergeLogin
