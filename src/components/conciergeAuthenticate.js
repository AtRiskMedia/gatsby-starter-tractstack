import React, { useState } from "react"
import { classNames } from "gatsby-plugin-tractstack"
import { ChevronRightIcon } from "@heroicons/react/20/solid"

import { saveProfile } from "../api/services"
import { useAuthStore } from "../stores/authStore"
import { getTokens } from "../api/axiosClient"

const ConciergeAuthenticate = () => {
  // if lead is known, pre-inject these values with an unlocking workflow - codeword match
  const authData = useAuthStore(state => state.authData)
  const emailAlreadyKnown = authData.emailAlreadyKnown
  const knownEmail = authData.email
  const knownFirstName = authData.firstname
  const authenticated = authData.authenticated
  const [email, setEmail] = useState(
    typeof emailAlreadyKnown === "string" && emailAlreadyKnown
      ? emailAlreadyKnown
      : typeof knownEmail === "string" && knownEmail
        ? knownEmail
        : ""
  )
  const [codeword, setCodeword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(0)
  const fingerprint = useAuthStore(state => state.fingerprint)
  const login = useAuthStore(state => state.login)
  const [loggingIn, setLoggingIn] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()
    if (email && codeword && !loggingIn) {
      const profile = { email: email, codeword: codeword }
      saveProfile({ profile })
        .then(() => {
          getTokens(fingerprint, codeword, email).then(res => {
            login(res)
          })
        })
        .catch(() => {
          setSuccess(-1)
        })
        .finally(setLoggingIn(0))
    }
    setSubmitted(true)
  }
  if (authenticated) return <p>IN</p>
  return (
    <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl mb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-orange sm:text-4xl">
          Welcome back
          {!authenticated &&
            !emailAlreadyKnown &&
            knownFirstName &&
            `, ${knownFirstName}.`}
        </h2>
        <p className="mt-4 mb-6 text-xl text-gray-700">
          {emailAlreadyKnown ? (
            <>
              Your email is already registered. Please enter your code word to
              access your profile:
            </>
          ) : (
            <>
              To access your profile, please enter your code word and confirm
              your email:
            </>
          )}
        </p>
      </div>
      <form onSubmit={handleSubmit} method="POST">
        <div className="grid grid-cols-3 gap-4 bg-slate-50">
          <div className="col-span-3 sm:col-span-1">
            <label
              htmlFor="codeword"
              className="block text-sm font-medium text-gray-700"
            >
              Code word:
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
                (submitted && codeword === "") || success === -1
                  ? "border-red-500"
                  : "border-gray-300"
              )}
            />
            {success === -1 ? (
              <span className="text-xs px-2 text-red-500">INCORRECT.</span>
            ) : submitted && codeword === "" ? (
              <span className="text-xs px-2 text-red-500">Required field.</span>
            ) : (
              <></>
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
              readOnly={!emailAlreadyKnown && knownEmail}
              name="email"
              id="email"
              autoComplete="email"
              defaultValue={email}
              onBlur={e => setEmail(e.target.value)}
              className={classNames(
                "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                submitted && email === ""
                  ? "border-red-500"
                  : "border-gray-300",
                !emailAlreadyKnown && knownEmail ? "text-lightgrey" : ""
              )}
            />
            {submitted && email === "" && (
              <span className="text-xs px-2 text-red-500">Required field.</span>
            )}
          </div>
          <div className="col-span-3 mt-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 py-3 px-4 text-sm font-medium text-allblack shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
            >
              <span className="pr-4">Authenticate</span>
              <ChevronRightIcon className="h-5 w-5 mr-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConciergeAuthenticate
