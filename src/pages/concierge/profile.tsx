// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, Fragment, useEffect } from 'react'
import { Link, navigate } from 'gatsby'
import { classNames } from '@tractstack/helpers'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import {
  ArrowPathRoundedSquareIcon,
  BellSlashIcon,
  BoltIcon,
  ChatBubbleBottomCenterIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { useAuthStore } from '../../stores/authStore'
import { useStoryStepStore } from '../../stores/storyStep'
import { loadProfile, saveProfile } from '../../api/services'
import { getTokens } from '../../api/axiosClient'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import Wrapper from '../../components/Wrapper'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'
import { config } from '../../../data/SiteConfig'

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
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(false)
  const [badSave, setBadSave] = useState(false)
  const [saved, setSaved] = useState(0)
  const login = useAuthStore((state) => state.login)
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
  const storySteps = useStoryStepStore((state) => state.storySteps)
  let target: any // FIX
  Object.keys(storySteps).forEach((e) => {
    if (storySteps[e]?.type !== `conciergePage`) target = storySteps[e]
  })

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (firstname && email && codeword && !saving) {
      setSaving(true)
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
              behavior: `smooth`,
            })
            setSaved(Date.now())
            if (!authenticated) {
              setCreated(true)
              getTokens(codeword, email).then((res) => login(res))
            } else setCreated(false)
          }
        })
        .catch(() => {
          console.log(`An error occurred.`)
          setBadSave(true)
          logout(true)
        })
        .finally(() => {
          setSaving(false)
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
      ? `text-black`
      : personaSelected.title === `Major Updates Only`
        ? `text-mydarkgrey`
        : personaSelected.title === `All Updates`
          ? `text-myorange`
          : `text-mydarkgrey`
  const barClass =
    personaSelected.title === `DMs open`
      ? `bg-green`
      : personaSelected.title === `All Updates`
        ? `bg-myorange/90`
        : personaSelected.title === `Major Updates Only`
          ? `bg-myorange/50`
          : `bg-mydarkgrey`
  const barWidth =
    personaSelected.title === `DMs open`
      ? `100%`
      : personaSelected.title === `All Updates`
        ? `100%`
        : personaSelected.title === `Major Updates Only`
          ? `50%`
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
    <Wrapper slug="profile" mode="conciergePage">
      <Header siteTitle="Zero-party Introductions" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x shadow-inner shadow-mylightgrey">
                <aside className="py-6 md:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="profile" />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 md:col-span-9 relative">
                  <div className="absolute right-4 top-4 text-mydarkgrey hover:text-myorange">
                    <button onClick={() => close()}>
                      <XMarkIcon className="w-8 h-8" />
                    </button>
                  </div>
                  <div className="py-6 px-4 md:pb-8 md:col-span-9 md:max-w-2xl my-16">
                    <div>
                      <h2
                        id="rooted"
                        className="text-3xl tracking-tight text-myorange md:text-4xl font-bold"
                      >
                        Join our launch waitlist
                      </h2>
                      <p className="mt-4 mb-4 text-lg text-mydarkgrey">
                        {authenticated ? (
                          <>Welcome back, {firstname}.</>
                        ) : (
                          <>
                            Tract Stack is pre-launch and under active
                            development. We welcome you to introduce yourself
                            below.
                          </>
                        )}
                      </p>
                      {saved && saved + 10000 > Date.now() ? (
                        <p className="text-red-500 text-lg mb-10">
                          Your profile has been{` `}
                          {!created ? `updated` : `created`}.
                        </p>
                      ) : badSave ? (
                        <p className="text-red-500 text-lg mb-10">
                          Your profile could not be created. You have likely
                          already registered this email. Please try logging in.
                          If issues persists, please email **info at atriskmedia
                          dot com**.
                        </p>
                      ) : null}
                      {!isLoggedIn || !authenticated ? (
                        <p className="text-myblue text-lg mb-10">
                          Not your first visit?{` `}
                          <Link
                            to={`/concierge/login`}
                            className="no-underline hover:underline hover:underline-offset-1 text-myblue hover:text-myorange font-main font-bold"
                          >
                            Log-in
                          </Link>
                          .
                        </p>
                      ) : null}
                    </div>
                    {badSave ? null : show || (!authenticated && !knownLead) ? (
                      <form onSubmit={handleSubmit} method="POST">
                        <div className="grid grid-cols-3 gap-4 bg-slate-50">
                          <div className="col-span-3 md:col-span-1">
                            <label
                              htmlFor="firstname"
                              className="block text-sm text-mydarkgrey"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              name="firstname"
                              id="firstname"
                              autoComplete="given-name"
                              defaultValue={firstname || ``}
                              onChange={(e) =>
                                updateAuthData(`firstname`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-myorange focus:ring-myorange md:text-sm`,
                                submitted && firstname === ``
                                  ? `border-red-500`
                                  : `border-slate-200`,
                              )}
                            />
                            {submitted && firstname === `` && (
                              <span className="text-xs px-2 text-red-500">
                                Required field.
                              </span>
                            )}
                          </div>

                          <div className="col-span-3 md:col-span-2">
                            <label
                              htmlFor="email"
                              className="block text-sm text-mydarkgrey"
                            >
                              Email address
                            </label>
                            <input
                              type="text"
                              name="email"
                              id="email"
                              autoComplete="email"
                              defaultValue={email}
                              onChange={(e) =>
                                updateAuthData(`email`, e.target.value)
                              }
                              className={classNames(
                                `mt-1 block w-full rounded-md shadow-sm focus:border-myorange focus:ring-myorange md:text-sm`,
                                submitted && firstname === ``
                                  ? `border-red-500`
                                  : `border-slate-200`,
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
                              <div className="flex items-center text-sm">
                                <div className="pr-8 text-sm text-black">
                                  <Listbox
                                    value={personaSelected}
                                    onChange={setPersonaSelected}
                                  >
                                    {({ open }) => (
                                      <>
                                        <Listbox.Label className="block text-sm text-mydarkgrey mb-2">
                                          Communication Preferences
                                        </Listbox.Label>

                                        <div className="relative mt-2">
                                          <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-black shadow-sm ring-1 ring-inset ring-myorange focus:outline-none focus:ring-2 focus:ring-myorange sm:text-sm sm:leading-6">
                                            <span className="block truncate">
                                              {personaSelected.title}
                                            </span>
                                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                              <ChevronDownIcon
                                                className="h-5 w-5 text-mydarkgrey"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          </Listbox.Button>

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
                                                          : `text-black`,
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
                                                              ? `underline`
                                                              : ``,
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
                                      <div className="h-3 rounded-full border border-gray-200 bg-slate-100" />
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
                                  className="block text-sm text-mydarkgrey"
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
                                    className="block w-full rounded-md border-slate-200 shadow-sm focus:border-myorange focus:ring-myorange md:text-sm"
                                    placeholder="Your one-liner bio"
                                    defaultValue={shortBio}
                                    onChange={(e) =>
                                      updateAuthData(`shortBio`, e.target.value)
                                    }
                                  />
                                </div>
                              </div>

                              <div className="col-span-1">
                                <label
                                  htmlFor="codeword"
                                  className="block text-sm text-mydarkgrey"
                                >
                                  {authenticated ? `Re-e` : `E`}nter your secret
                                  code word to protect your account:
                                </label>
                                <input
                                  type="text"
                                  name="codeword"
                                  id="codeword"
                                  autoComplete="off"
                                  defaultValue={codeword}
                                  onChange={(e) => setCodeword(e.target.value)}
                                  className={classNames(
                                    `mt-1 block w-full rounded-md shadow-sm focus:border-myorange focus:ring-myorange`,
                                    submitted && firstname === ``
                                      ? `border-red-500`
                                      : `border-slate-200`,
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
                              className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm text-black shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2"
                            >
                              <span className="pr-4">
                                {authenticated ? `Save Profile` : config.action}
                              </span>
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
                          className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm text-black shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-myorange focus:ring-offset-2"
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
