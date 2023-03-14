// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { getScrollbarSize } from 'gatsby-plugin-tractstack'

import { useAuthStore } from '../stores/authStore'
import StoryFragment from './StoryFragment'
import { getTokens } from '../api/axiosClient'
import { IStoryFragmentProps } from '../types'

const StoryFragmentWrapper = ({
  viewportKey,
  payload,
}: IStoryFragmentProps) => {
  const [loggingIn, setLoggingIn] = useState(false)
  const [lastRun, setLastRun] = useState(0)
  const login = useAuthStore((state) => state.login)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const encryptedEmail = useAuthStore((state) => state.authData.encryptedEmail)
  const encryptedCode = useAuthStore((state) => state.authData.encryptedCode)
  const badLogin = useAuthStore((state) => state.authData.badLogin)
  const validToken = useAuthStore((state) => state.validToken)
  const fingerprint = useAuthStore((state) => state.fingerprint)
  const setFingerprint = useAuthStore((state) => state.setFingerprint)

  useEffect(() => {
    if (typeof fingerprint === `object` && fingerprint === null) {
      const fpPromise = FingerprintJS.load()
        ; (async () => {
          const fp = await fpPromise
          const result = await fp.get()
          setFingerprint(result.visitorId)
        })()
    }
  }, [fingerprint, setFingerprint])

  useEffect(() => {
    const doCheck =
      !isLoggedIn && typeof fingerprint === `string` && fingerprint.length > 0
        ? true
        : !isLoggedIn &&
          typeof encryptedEmail === `string` &&
          encryptedEmail.length > 0 &&
          typeof encryptedCode === `string` &&
          encryptedCode.length > 0
          ? true
          : !validToken

    if (
      lastRun + 2000 < Date.now() &&
      doCheck &&
      !isLoggedIn &&
      !loggingIn &&
      !badLogin &&
      typeof fingerprint === `string` &&
      fingerprint.length > 0
    ) {
      setLastRun(Date.now())
      setLoggingIn(true)
      getTokens(fingerprint)
        .then((res) => login(res))
        .finally(() => setLoggingIn(false))
    }
  }, [
    encryptedCode,
    encryptedEmail,
    validToken,
    badLogin,
    fingerprint,
    login,
    loggingIn,
    isLoggedIn,
    setLastRun,
    lastRun,
  ])

  useEffect(() => {
    function handleResize() {
      const scrollBarOffset = getScrollbarSize()
      const thisWidth = window?.innerWidth
      const thisViewportKey =
        thisWidth < 801 ? `mobile` : thisWidth < 1367 ? `tablet` : `desktop`
      const thisViewport =
        thisViewportKey === `mobile`
          ? `600`
          : thisViewportKey === `tablet`
            ? 1080
            : 1920
      if (thisViewportKey !== viewportKey)
        navigate(`/${payload.slug}/${thisViewport}`)
      const thisScale =
        thisWidth < 801
          ? (thisWidth - scrollBarOffset) / 600
          : thisWidth < 1367
            ? (thisWidth - scrollBarOffset) / 1080
            : (thisWidth - scrollBarOffset) / 1920
      document.documentElement.style.setProperty(
        `--scale`,
        thisScale.toString(),
      )
    }
    window.addEventListener(`resize`, handleResize)
    handleResize()
    return () => window.removeEventListener(`resize`, handleResize)
  }, [viewportKey, payload.slug])

  return <StoryFragment viewportKey={viewportKey} payload={payload} />
}

export default StoryFragmentWrapper
