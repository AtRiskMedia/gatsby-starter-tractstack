// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment, useEffect } from 'react'
import { Link, navigate } from 'gatsby'
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
import { loadProfile, saveProfile } from '../../api/services'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

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

const getProfile = async () => {
  try {
    const res = await loadProfile()
    if (res) return { profile: res }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
    }
  }
}

const ConciergeProfile = () => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [codeword, setCodeword] = useState(``)
  const [submitted, setSubmitted] = useState(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [badSave, setBadSave] = useState(false)
  const [saved, setSaved] = useState(0)
  const firstname = useAuthStore((state) => state.authData.firstname)
  const shortBio = useAuthStore((state) => state.authData.shortBio)
  const email = useAuthStore((state) => state.authData.email)
  const knownLead = useAuthStore((state) => state.authData.knownLead)
  const authenticated = useAuthStore((state) => state.authData.authenticated)
  const contactPersona = useAuthStore((state) => state.authData.contactPersona)
  const [show, setShow] = useState(!authenticated)
  const updateAuthData = useAuthStore((state) => state.updateAuthData)
  const logout = useAuthStore((state) => state.logout)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const [personaSelected, setPersonaSelected] = useState(
    contactPersonaOptions[0],
  )
  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (firstname && email && codeword && !loggingIn) {
      setLoggingIn(true)
      const profile = {
        firstname,
        email,
        codeword,
        persona: personaSelected.id,
        bio: shortBio.substring(0, 280),
        init: !authenticated,
      }
      saveProfile({ profile })
        .then((response) => {
          if (response.status === 200) {
            document?.getElementById(`rooted`)?.scrollIntoView({
              behavior: `auto`,
              block: `center`,
              inline: `center`,
            })
            setSaved(Date.now())
          }
        })
        .catch(() => {
          console.log(`An error occurred.`)
          setBadSave(true)
          logout(true)
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
    if (contactPersona) {
      let lookup: number | boolean = false
      for (const [key, value] of Object.entries(contactPersonaOptions)) {
        if (value.id === contactPersona) lookup = parseInt(key)
      }
      if (lookup) setPersonaSelected(contactPersonaOptions[lookup])
    }
  }, [contactPersona])

  useEffect(() => {
    if (isLoggedIn && !loaded && !loading) {
      setLoading(true)
      getProfile()
        .then((response: any) => {
          if (response?.profile?.data) {
            const res = response.profile.data
            if (
              typeof res?.firstname === `string` &&
              res.firstname !== firstname
            )
              updateAuthData(`firstname`, res.firstname)
            if (typeof res?.email === `string` && res.email !== email)
              updateAuthData(`email`, res.email)
            if (
              typeof res?.contactPersona === `string` &&
              res.contactPersona !== contactPersona
            )
              updateAuthData(`contactPersona`, res.contactPersona)
            if (typeof res?.shortBio === `string` && res.shortBio !== shortBio)
              updateAuthData(`shortBio`, res.shortBio)
          }
          setLoaded(true)
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [
    loaded,
    loading,
    setLoaded,
    setLoading,
    firstname,
    shortBio,
    email,
    isLoggedIn,
    contactPersona,
    updateAuthData,
  ])

  if (isLoggedIn && knownLead && !authenticated) navigate(`/concierge/login`)

  return (
    <Wrapper slug="profile" mode="conciergePage">
      <Header siteTitle="Zero-party Introductions" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="profile" />
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
                        {authenticated ? (
                          <>Welcome back, {firstname}.</>
                        ) : (
                          <>
                            Introduce yourself to unlock special offers and
                            personalized recommendations throughout the site.
                          </>
                        )}
                      </p>
                      {saved && saved + 10000 > Date.now() ? (
                        <p className="text-red-500 text-lg mb-10">
                          Your profile has been updated.
                        </p>
                      ) : badSave ? null : (
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
                      )}
                      {!isLoggedIn || !authenticated ? (
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
                      ) : null}
                    </div>
                    {badSave ? (
                      <>
                        <p className="text-red-500 text-lg mb-10">
                          Your secret codeword did not match. You have been
                          logged out.
                        </p>
                        <p>
                          <Link
                            to={`/concierge/login`}
                            className="no-underline hover:underline hover:underline-offset-1 text-blue font-bold hover:text-orange"
                          >
                            Log-in
                          </Link>
                        </p>
                      </>
                    ) : show || (!authenticated && !knownLead) ? (
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
                              defaultValue={firstname || ``}
                              onBlur={(e) =>
                                updateAuthData(`firstname`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                                submitted && firstname === ``
                                  ? `border-red-500`
                                  : `border-gray-300`,
                              )}
                            />
                            {submitted && firstname === `` && (
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
                              defaultValue={email}
                              onBlur={(e) =>
                                updateAuthData(`email`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm`,
                                submitted && firstname === ``
                                  ? `border-red-500`
                                  : `border-gray-300`,
                              )}
                            />
                            {submitted && email === `` && (
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
                          {firstname ? (
                            <>
                              <div className="col-span-2 mt-10">
                                <label
                                  htmlFor="bio"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  {!authenticated && firstname ? (
                                    <>
                                      Hello {firstname}. Is there anything else
                                      you would like to share?
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
                                    defaultValue={shortBio}
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
                                    submitted && firstname === ``
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
    </Wrapper>
  )
}

export const Head = () => <Seo title="Zero-party Introductions" />

export default ConciergeProfile
