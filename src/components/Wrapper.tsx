// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import { useEffect, useState } from 'react'
import { getScrollbarSize } from '@tractstack/helpers'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import { getTokens } from '../api/axiosClient'
import { IWrapperProps } from '@tractstack/types'

const Wrapper = ({ slug, mode, children }: IWrapperProps) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const [loggingIn, setLoggingIn] = useState(false)
  const [lastRun, setLastRun] = useState(0)
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const setViewportKey = useAuthStore((state) => state.setViewportKey)
  const login = useAuthStore((state) => state.login)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const encryptedEmail = useAuthStore((state) => state.authData.encryptedEmail)
  const encryptedCode = useAuthStore((state) => state.authData.encryptedCode)
  const badLogin = useAuthStore((state) => state.authData.badLogin)
  const validToken = useAuthStore((state) => state.validToken)
  const setLastStoryStep = useStoryStepStore((state) => state.setLastStoryStep)
  const referrer = useAuthStore((state) => state.referrer)
  const setReferrer = useAuthStore((state) => state.setReferrer)
  const scrollToPane = useStoryStepStore((state) => state.scrollToPane)
  const setScrollToPane = useStoryStepStore((state) => state.setScrollToPane)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const utmSource = params.get(`utm_source`)
    const utmMedium = params.get(`utm_medium`)
    const utmCampaign = params.get(`utm_campaign`)
    const utmTerm = params.get(`utm_term`)
    const utmContent = params.get(`utm_content`)
    if (
      typeof referrer.init === `undefined` &&
      (document?.referrer ||
        utmSource ||
        utmMedium ||
        utmCampaign ||
        utmTerm ||
        utmContent)
    ) {
      setReferrer({
        init: true,
        httpReferrer: document.referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      })
    }
  }, [referrer, setReferrer])

  useEffect(() => {
    if (!loaded) {
      if (mode === `storyFragment`) setLastStoryStep(slug, mode)
      setLoaded(true)
    }
  }, [loaded, setLoaded, setLastStoryStep, slug, mode])

  useEffect(() => {
    if (process.env.NODE_ENV !== `development`) {
      const doCheck = !isLoggedIn
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
        !badLogin
      ) {
        setLastRun(Date.now())
        setLoggingIn(true)
        getTokens()
          .then((res) => login(res))
          .finally(() => setLoggingIn(false))
      }
    }
  }, [
    encryptedCode,
    encryptedEmail,
    validToken,
    badLogin,
    login,
    loggingIn,
    isLoggedIn,
    setLastRun,
    lastRun,
  ])

  useEffect(() => {
    function doScrollTo() {
      const pane =
        typeof document !== `undefined`
          ? document.getElementById(`${viewportKey}-${scrollToPane}`)
          : null
      if (pane) {
        pane.scrollIntoView({ behavior: `smooth` })
        setScrollToPane(``)
      }
    }
    if (scrollToPane) {
      setTimeout(() => {
        doScrollTo()
      }, 1250)
    }
  }, [scrollToPane, viewportKey, setScrollToPane])

  useEffect(() => {
    function handleResize() {
      const scrollBarOffset = getScrollbarSize()
      const thisWidth = window?.innerWidth
      const thisViewportKey =
        thisWidth < 801 ? `mobile` : thisWidth < 1367 ? `tablet` : `desktop`
      if (thisViewportKey !== viewportKey) setViewportKey(thisViewportKey)
      const thisScale =
        thisWidth < 801
          ? (thisWidth - scrollBarOffset) / 601
          : thisWidth < 1367
            ? (thisWidth - scrollBarOffset) / 1081
            : (thisWidth - scrollBarOffset) / 1921
      document.documentElement.style.setProperty(
        `--scale`,
        thisScale.toString(),
      )
    }
    window.addEventListener(`resize`, handleResize)
    handleResize()
    return () => window.removeEventListener(`resize`, handleResize)
  }, [viewportKey, slug, mode, setViewportKey])

  return children
}

export default Wrapper
