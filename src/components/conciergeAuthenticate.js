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

const ConciergeAuthenticate = () => {
  // if lead is known, pre-inject these values with an unlocking workflow - codeword match
  const [email, setEmail] = useState("")
  const [codeword, setCodeword] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(0)
  const fingerprint = useAuthStore(state => state.fingerprint)
  const login = useAuthStore(state => state.login)
  const [loggingIn, setLoggingIn] = useState(0)

  const handleSubmit = e => {
    e.preventDefault()
    if (firstname && email && codeword && !loggingIn) {
      const profile = { email: email, codeword: codeword, persona: personaSelected.title, bio: bio.substring(0, 280) }
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

  return (
    <div className="py-6 px-4 sm:p-6 lg:pb-8 lg:col-span-9 md:max-w-2xl mb-16">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-orange sm:text-4xl">
          Welcome back
        </h2>
      </div>
      <form onSubmit={handleSubmit} method="POST">
        <div className="grid grid-cols-3 gap-4 bg-slate-50">

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

export default ConciergeAuthenticate
