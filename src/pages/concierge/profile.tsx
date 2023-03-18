// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment, useEffect } from 'react'
import { Link } from 'gatsby'
import { classNames } from 'gatsby-plugin-tractstack'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathRoundedSquareIcon,
  BellSlashIcon,
  BoltIcon,
  ChatBubbleBottomCenterIcon,
} from '@heroicons/react/24/outline'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import { saveProfile, initProfile } from '../../api/services'
import { getTokens, getProfile } from '../../api/axiosClient'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'
import { IAuthStorePayload } from '../../types'

const contactPersonaOptions = [
  {
    id: `major`,
    title: `Major Updates Only`,
    description: `Will only send major updates and do so infrequently.`,
    current: true,
  },
  {
    id: `all`,
    title: `All Updates`,
    description: `Be fully in the know!`,
    current: false,
  },
  {
    id: `open`,
    title: `DMs open`,
    description: `Leave your contact details and we'll get in touch!`,
    current: false,
  },
  {
    id: `none`,
    title: `None`,
    description: `Disables all communications from us.`,
    current: false,
  },
]

const ConciergeProfile = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [codeword, setCodeword] = useState(``)
  const [submitted, setSubmitted] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [dataLoading, setDataLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const authData: IAuthStorePayload = useAuthStore((state) => state.authData)
  const [show, setShow] = useState(!authData.authenticated)
  const updateAuthData = useAuthStore((state) => state.updateAuthData)
  const authenticated = authData.authenticated
  const login = useAuthStore((state) => state.login)
  const fingerprint = useAuthStore((state) => state.fingerprint)
  let lookup: number | boolean = false
  if (authData.contactPersona) {
    for (const [key, value] of Object.entries(contactPersonaOptions)) {
      if (value.title === authData.contactPersona) lookup = parseInt(key)
    }
  }
  const [personaSelected, setPersonaSelected] = useState(
    typeof lookup === `number`
      ? contactPersonaOptions[lookup]
      : contactPersonaOptions[0],
  )
  const doGetProfile = !dataLoading && !dataLoaded && authData.authenticated
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (authData.firstname && authData.email && codeword && !loggingIn) {
      const profile = {
        firstname: authData.firstname,
        email: authData.email,
        codeword,
        persona: personaSelected.title,
        bio: authData.shortBio.substring(0, 280),
        init: !authData.authenticated,
      }
      setLoggingIn(true)
      const doFunction = authData.authenticated ? saveProfile : initProfile
      doFunction({ profile })
        .then((response) => {
          if (response.status === 200 && response?.data?.emailConflict)
            updateAuthData(`emailConflict`, authData.email)
          else if (
            response.status === 200 &&
            !authData.authenticated &&
            fingerprint
          ) {
            getTokens(fingerprint, codeword, authData.email)
              .then((res) => {
                login(res)
                document?.getElementById(`rooted`)?.scrollIntoView({
                  behavior: `auto`,
                  block: `center`,
                  inline: `center`,
                })
              })
              .catch(() => {
                console.log(`An error occurred.`)
              })
          }
        })
        .catch(() => {
          updateAuthData(`badLogin`, true)
        })
        .finally(() => {
          setLoggingIn(false)
          setShow(false)
        })
    }
    setSubmitted(true)
  }
  function showProfile() {
    setShow(true)
  }
  const Icon =
    personaSelected.title === `DMs open`
      ? ChatBubbleBottomCenterIcon
      : personaSelected.title === `Major Updates Only`
      ? ArrowPathRoundedSquareIcon
      : personaSelected.title === `All Updates`
      ? BoltIcon
      : BellSlashIcon
  const iconClass =
    personaSelected.title === `DMs open`
      ? `text-orange`
      : personaSelected.title === `Major Updates Only`
      ? `text-darkgrey`
      : personaSelected.title === `All Updates`
      ? `text-blue`
      : `text-darkgrey`
  const barClass =
    personaSelected.title === `DMs open`
      ? `bg-orange`
      : personaSelected.title === `Major Updates Only`
      ? `bg-lightgrey`
      : personaSelected.title === `All Updates`
      ? `bg-green`
      : `bg-darkgrey`
  const barWidth =
    personaSelected.title === `DMs open`
      ? `100%`
      : personaSelected.title === `Major Updates Only`
      ? `20%`
      : personaSelected.title === `All Updates`
      ? `98%`
      : `2%`

  useEffect(() => {
    if (doGetProfile) {
      setDataLoading(true)
      getProfile()
        .then((res) => {
          if (
            typeof res?.firstname === `string` &&
            res.firstname !== authData.firstname
          )
            updateAuthData(`firstname`, res.firstname)
          if (typeof res?.email === `string` && res.email !== authData.email)
            updateAuthData(`email`, res.email)
          if (
            typeof res?.contactPersona === `string` &&
            res.contactPersona !== authData.contactPersona
          )
            updateAuthData(`contactPersona`, res.contactPersona)
          if (
            typeof res?.shortBio === `string` &&
            res.shortBio !== authData.shortBio
          )
            updateAuthData(`shortBio`, res.shortBio)
          setDataLoaded(true)
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => setDataLoading(false))
    }
  }, [doGetProfile, setDataLoading, setDataLoaded, authData, updateAuthData])

  useEffect(() => {
    if (!loaded) {
      setLastStoryStep(`profile`, `conciergePage`)
      setLoaded(true)
    }
  }, [loaded, setLoaded, setLastStoryStep])

  return (
    <>
      <Header siteTitle="Zero-party Introductions" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="profile" auth={authenticated} />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9">
                  <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl my-16">
                    <div>
                      <h2
                        id="rooted"
                        className="text-3xl font-bold tracking-tight text-orange sm:text-4xl"
                      >
                        We are rooted in community.
                      </h2>
                      <p className="mt-4 mb-4 text-lg text-gray-700">
                        {authData.authenticated ? (
                          <>
                            Welcome back, {authData.firstname} ({fingerprint}).
                          </>
                        ) : (
                          <>
                            Introduce yourself to unlock special offers and
                            personalized recommendations throughout the site.
                          </>
                        )}
                      </p>
                      <p className="text-gray-700 text-lg mb-6">
                        To read more on our data practices and professional
                        standards, please see our{` `}
                        <Link
                          to={`/concierge/zeroParty`}
                          className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                        >
                          Zero Party data privacy policy
                        </Link>
                        .
                      </p>
                      {!authData.authenticated && (
                        <p className="text-blue text-lg mb-10">
                          Not your first visit?{` `}
                          <Link
                            to={`/concierge/login`}
                            className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                          >
                            Log-in
                          </Link>
                          .
                        </p>
                      )}
                    </div>
                    {show ||
                    (!authData.authenticated && !authData.knownLead) ? (
                      <form onSubmit={handleSubmit} method="POST">
                        <div className="grid grid-cols-3 gap-4 bg-slate-50">
                          <div className="col-span-3 sm:col-span-1">
                            <label
                              htmlFor="firstname"
                              className="block text-sm font-medium text-gray-700"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              name="firstname"
                              id="firstname"
                              autoComplete="given-name"
                              defaultValue={authData.firstname || ``}
                              onBlur={(e) =>
                                updateAuthData(`firstname`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                                submitted && authData.firstname === ``
                                  ? `border-red-500`
                                  : `border-gray-300`,
                              )}
                            />
                            {submitted && authData.firstname === `` && (
                              <span className="text-xs px-2 text-red-500">
                                Required field.
                              </span>
                            )}
                          </div>

                          <div className="col-span-3 sm:col-span-2">
                            <label
                              htmlFor="email-address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email address
                            </label>
                            <input
                              type="text"
                              name="email"
                              id="email"
                              autoComplete="email"
                              defaultValue={authData.email}
                              onBlur={(e) =>
                                updateAuthData(`email`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                                submitted && authData.firstname === ``
                                  ? `border-red-500`
                                  : `border-gray-300`,
                              )}
                            />
                            {submitted && authData.email === `` && (
                              <span className="text-xs px-2 text-red-500">
                                Required field.
                              </span>
                            )}
                          </div>

                          <div className="col-span-3 mt-2">
                            <div className="space-y-3">
                              <label
                                htmlFor="contactpersona"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Communication Preferences
                              </label>

                              <div className="flex items-center text-sm">
                                <div className="pr-8 text-sm text-black">
                                  <Listbox
                                    value={personaSelected}
                                    onChange={setPersonaSelected}
                                    name="contactpersona"
                                  >
                                    {({ open }) => (
                                      <>
                                        <Listbox.Label
                                          id="contactpersonalabel"
                                          className="sr-only"
                                        >
                                          {` `}
                                          Indicate communication preferences
                                          {` `}
                                        </Listbox.Label>
                                        <div className="relative">
                                          <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                                            <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                                              <div className="inline-flex items-center rounded-l-md border border-transparent bg-transparent py-1 pl-3 pr-4 text-black shadow-sm">
                                                <p className="ml-2.5 text-sm text-left font-medium w-36">
                                                  {personaSelected.title}
                                                </p>
                                              </div>
                                              <Listbox.Button
                                                id="contactpersonabutton"
                                                className="inline-flex items-center rounded-l-none rounded-r-md bg-darkgrey p-1 text-sm font-medium text-allwhite hover:bg-lightgrey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                              >
                                                <span className="sr-only">
                                                  Change contact-persona setting
                                                </span>
                                                <ChevronDownIcon
                                                  className="h-5 w-5"
                                                  aria-hidden="true"
                                                />
                                              </Listbox.Button>
                                            </div>
                                          </div>

                                          <Transition
                                            show={open}
                                            as={Fragment}
                                            leave="transition ease-in duration-100"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                          >
                                            <Listbox.Options className="absolute z-10 mt-1 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                              {contactPersonaOptions.map(
                                                (option) => (
                                                  <Listbox.Option
                                                    key={option.id}
                                                    className={({ active }) =>
                                                      classNames(
                                                        active
                                                          ? `text-black bg-slate-100`
                                                          : `text-allblack`,
                                                        `cursor-default select-none p-2 text-sm`,
                                                      )
                                                    }
                                                    value={option}
                                                  >
                                                    {({ selected }) => (
                                                      <>
                                                        <span
                                                          className={classNames(
                                                            selected
                                                              ? `font-semibold`
                                                              : `font-normal`,
                                                            `block truncate`,
                                                          )}
                                                        >
                                                          {option.title}
                                                        </span>
                                                      </>
                                                    )}
                                                  </Listbox.Option>
                                                ),
                                              )}
                                            </Listbox.Options>
                                          </Transition>
                                        </div>
                                      </>
                                    )}
                                  </Listbox>
                                </div>
                                <div className="flex flex-1 items-center">
                                  <div
                                    aria-hidden="true"
                                    className="ml-1 flex flex-1 items-center"
                                  >
                                    <Icon
                                      className={classNames(
                                        iconClass,
                                        `flex-shrink-0 h-5 w-5`,
                                      )}
                                      aria-hidden="true"
                                    />
                                    <div className="relative ml-3 flex-1">
                                      <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                                      <div
                                        className={classNames(
                                          `absolute inset-y-0 rounded-full border`,
                                          barClass,
                                        )}
                                        style={{ width: barWidth }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-right text-black">
                                {personaSelected.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {authData.firstname ? (
                            <>
                              <div className="col-span-2 mt-10">
                                <label
                                  htmlFor="bio"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  {!authData.authenticated &&
                                  authData.firstname ? (
                                    <>
                                      Hello {authData.firstname}. Is there
                                      anything else you would like to share?
                                    </>
                                  ) : (
                                    <>
                                      Would you like to share anything else?
                                      (Contact preferences; company bio; phone
                                      number)
                                    </>
                                  )}
                                </label>
                                <div className="mt-2">
                                  <textarea
                                    id="bio"
                                    name="bio"
                                    rows={3}
                                    maxLength={280}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange md:text-sm"
                                    placeholder="Your one-liner bio"
                                    defaultValue={authData.shortBio}
                                    onBlur={(e) =>
                                      updateAuthData(`shortBio`, e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-span-1">
                                <label
                                  htmlFor="codeword"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Enter the secret code word to protect your
                                  account:
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
                                    submitted && authData.firstname === ``
                                      ? `border-red-500`
                                      : `border-gray-300`,
                                  )}
                                />
                                {submitted && codeword === `` && (
                                  <span className="text-xs px-2 text-red-500">
                                    Required field.
                                  </span>
                                )}
                              </div>
                            </>
                          ) : (
                            <></>
                          )}

                          <div className="col-span-2 mt-6">
                            <button
                              type="submit"
                              className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm font-medium text-allblack shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                            >
                              <span className="pr-4">Save Profile</span>
                              <ChevronRightIcon
                                className="h-5 w-5 mr-3"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-10">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm font-medium text-allblack shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
                          onClick={() => showProfile()}
                        >
                          <span className="pr-4">Edit your profile</span>
                          <ChevronRightIcon
                            className="h-5 w-5 mr-3"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export const Head = () => <Seo title="Zero-party Introductions" />

export default ConciergeProfile
