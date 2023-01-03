import React, { useState, Fragment } from "react"
import { Link } from "react-router-dom"
import { classNames } from "gatsby-plugin-tractstack"
import { Listbox, Transition } from "@headlessui/react"
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/20/solid"
import {
  ArrowPathRoundedSquareIcon,
  BellSlashIcon,
  BoltIcon,
} from "@heroicons/react/24/outline"

import { saveProfile } from "../api/services"
import { useAuthStore } from "../stores/authStore"
import { getTokens } from "../api/axiosClient"

const contactPersonaOptions = [
  {
    title: "Infrequent",
    description: "Will keep you in the loop. Monthly updates at most.",
    current: false,
  },
  {
    title: "All Updates",
    description: "Be fully in the know!",
    current: false,
  },
  {
    title: "Major Updates Only",
    description: "Will only send major updates and do so infrequently.",
    current: true,
  },
  {
    title: "None",
    description: "Disables all communications from us.",
    current: false,
  },
]

const ConciergeProfile = () => {
  // if lead is known, pre-inject these values with an unlocking workflow - codeword match
  const storedFirstName = useAuthStore(state => state.firstName)
  const [firstname, setFirstName] = useState(storedFirstName !== "false" ? storedFirstName : "")
  const [email, setEmail] = useState("")
  const [codeword, setCodeword] = useState("")
  const [bio, setBio] = useState("")
  const [personaSelected, setPersonaSelected] = useState(contactPersonaOptions[0])
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(0)
  const fingerprint = useAuthStore(state => state.fingerprint)
  const login = useAuthStore(state => state.login)
  const auth = useAuthStore(state => state.auth)
  console.log(storedFirstName, auth)
  const [loggingIn, setLoggingIn] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()
    if (firstname && email && codeword && !loggingIn) {
      const profile = { firstname: firstname, email: email, codeword: codeword, persona: personaSelected.title, bio: bio.substring(0, 280) }
      console.log(profile)
      saveProfile({ profile }).then(res => {
        if (res.status === 200) {
          // try to re-login with codeword!
          setLoggingIn(1)
          getTokens(fingerprint, codeword).then(res => {
            const accessToken = typeof res.tokens === "string" ? res.tokens : false
            const auth = typeof res.auth === "boolean" ? res.auth : false
            if (accessToken) {
              login({ accessToken: accessToken, fingerprint: fingerprint, auth: auth })
            } else {
              console.log("error with token", res)
            }
            setLoggingIn(0)
          })

        }
      })
    }
    setSubmitted(true)
  }

  const Icon =
    personaSelected.title === "Infrequent" ||
      personaSelected.title === "Major Updates Only"
      ? ArrowPathRoundedSquareIcon
      : personaSelected.title === "All Updates"
        ? BoltIcon
        : BellSlashIcon
  const iconClass =
    personaSelected.title === "Infrequent"
      ? "text-blue"
      : personaSelected.title === "Major Updates Only"
        ? "text-darkgrey"
        : personaSelected.title === "All Updates"
          ? "text-blue"
          : "text-darkgrey"
  const barClass =
    personaSelected.title === "Infrequent"
      ? "bg-blue"
      : personaSelected.title === "Major Updates Only"
        ? "bg-lightgrey"
        : personaSelected.title === "All Updates"
          ? "bg-green"
          : "bg-darkgrey"
  const barWidth =
    personaSelected.title === "Infrequent"
      ? "40%"
      : personaSelected.title === "Major Updates Only"
        ? "20%"
        : personaSelected.title === "All Updates"
          ? "98%"
          : "2%"

  return (
    <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl mb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-orange sm:text-4xl">
          We are rooted in community.
        </h2>
        <p className="mt-4 mb-6 text-xl text-gray-700">
          Introduce yourself to unlock special offers and personalized recommendations throughout the site.
        </p>
        <p className="text-gray-700 text-sm mb-10">
          To read more on our data practices and professional standards, please
          see our{" "}
          <Link
            to={"/data"}
            className="underline underline-offset-1 hover:text-allblack"
          >
            Zero Party data privacy policy
          </Link>
          .
        </p>
        <p className="text-gray-700 text-sm mb-10">
          Not your first visit?{" "}
          <Link
            to={"/authenticate"}
            className="underline underline-offset-1 hover:text-allblack"
          >
            Log-in
          </Link>
          .
        </p>
      </div>
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
              defaultValue={firstname}
              onBlur={e => setFirstName(e.target.value)}
              className={classNames(
                "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                submitted && firstname === ""
                  ? "border-red-500"
                  : "border-gray-300"
              )}
            />
            {submitted && firstname === "" && (
              <span className="text-xs px-2 text-red-500">Required field.</span>
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
              onBlur={e => setEmail(e.target.value)}
              className={classNames(
                "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                submitted && firstname === ""
                  ? "border-red-500"
                  : "border-gray-300"
              )}
            />
            {submitted && email === "" && (
              <span className="text-xs px-2 text-red-500">Required field.</span>
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
                        <Listbox.Label className="sr-only">
                          {" "}
                          Indicate communication preferences{" "}
                        </Listbox.Label>
                        <div className="relative">
                          <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                            <div className="inline-flex divide-x divide-indigo-600 rounded-md shadow-sm">
                              <div className="inline-flex items-center rounded-l-md border border-transparent bg-transparent py-1 pl-3 pr-4 text-black shadow-sm">
                                <p className="ml-2.5 text-sm text-left font-medium w-36">
                                  {personaSelected.title}
                                </p>
                              </div>
                              <Listbox.Button className="inline-flex items-center rounded-l-none rounded-r-md bg-darkgrey p-1 text-sm font-medium text-allwhite hover:bg-lightgrey focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
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
                              {contactPersonaOptions.map(option => (
                                <Listbox.Option
                                  key={option.title}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? "text-black bg-slate-100"
                                        : "text-allblack",
                                      "cursor-default select-none p-2 text-sm"
                                    )
                                  }
                                  value={option}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                                        {option.title}
                                      </span>
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
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
                      className={classNames(iconClass, "flex-shrink-0 h-5 w-5")}
                      aria-hidden="true"
                    />
                    <div className="relative ml-3 flex-1">
                      <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                      <div
                        className={classNames(
                          "absolute inset-y-0 rounded-full border",
                          barClass
                        )}
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-right text-black">{personaSelected.description}</p>
            </div>
          </div>

        </div>
        <div className="grid grid-cols-2 gap-4">
          {firstname ?
            <>
              <div className="col-span-2 mt-10">
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Hello {firstname}. Is there anything else you would like to share?
                </label>
                <div className="mt-2">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange focus:ring-orange md:text-sm"
                    placeholder="Your one-liner bio"
                    defaultValue={""}
                    onBlur={e => setBio(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-span-1">
                <label
                  htmlFor="codeword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Secret code word to protect your account:
                </label>
                <input
                  type="text"
                  name="codeword"
                  id="codeword"
                  autoComplete="new-password"
                  defaultValue={codeword}
                  onBlur={e => setCodeword(e.target.value)}
                  className={classNames(
                    "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                    submitted && firstname === ""
                      ? "border-red-500"
                      : "border-gray-300"
                  )}
                />
                {submitted && codeword === "" && (
                  <span className="text-xs px-2 text-red-500">Required field.</span>
                )}
              </div>
            </>
            : <></>}

          <div className="col-span-2 mt-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm font-medium text-allblack shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              <span className="pr-4">Save Profile</span>
              <ChevronRightIcon className="h-5 w-5 mr-3" aria-hidden="true" />
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}

export default ConciergeProfile
