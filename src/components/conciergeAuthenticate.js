import React, { useState } from "react"
import { navigate } from "gatsby"
import { classNames } from "gatsby-plugin-tractstack"
import { ChevronRightIcon } from "@heroicons/react/20/solid"

import { useAuthStore } from "../stores/authStore"
import { getTokens } from "../api/axiosClient"

const ConciergeAuthenticate = () => {
  const authData = useAuthStore(state => state.authData)
  const updateAuthData = useAuthStore(state => state.updateAuthData)
  const emailConflict = authData.emailConflict
  const knownEmail = authData.email
  const knownFirstName = authData.firstname
  const badLogin = authData.badLogin
  const authenticated = authData.authenticated
  const [email, setEmail] = useState(
    typeof emailConflict === "string" && emailConflict
      ? emailConflict
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
      getTokens(fingerprint, codeword, email)
        .then(res => {
          if (res.tokens !== null) {
            login(res)
            navigate("/")
          } else {
            setSuccess(-1)
            console.log("bad")
            updateAuthData("badLogin", true)
          }
        })
        .catch(() => {
          setSuccess(-1)
          console.log("bad")
          updateAuthData("badLogin", true)
        })
        .finally(setLoggingIn(0))
    }
    setSubmitted(true)
  }

  return (
    <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl mb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-orange sm:text-4xl">
          Welcome back
          {!authenticated &&
            !emailConflict &&
            knownFirstName &&
            `, ${knownFirstName}.`}
        </h2>
        <p className="mt-4 mb-6 text-xl text-gray-700">
          {emailConflict ? (
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
              autoComplete="off"
              defaultValue={codeword}
              onBlur={e => setCodeword(e.target.value)}
              className={classNames(
                "mt-1 block w-full rounded-md shadow-sm focus:border-orange focus:ring-orange md:text-sm",
                (submitted && codeword === "") || success === -1
                  ? "border-red-500"
                  : "border-gray-300"
              )}
            />
            {submitted && codeword === "" ? (
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
              readOnly={!emailConflict && knownEmail}
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
                !emailConflict && knownEmail ? "text-lightgrey" : ""
              )}
            />
            {submitted && email === "" && (
              <span className="text-xs px-2 text-red-500">Required field.</span>
            )}
          </div>
          {success === -1 || badLogin ? (
            <div className="col-span-3 italic text-red-500">
              <p>
                Those credentials did not match our records. Please try again.
              </p>
            </div>
          ) : (
            <></>
          )}

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
