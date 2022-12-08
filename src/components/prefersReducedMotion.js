import { useEffect, useState } from "react"

const mediaQuery = "(prefers-reduced-motion: no-preference)"

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)
  useEffect(() => {
    const mediaQueryList = window.matchMedia(mediaQuery)
    setPrefersReducedMotion(!window.matchMedia(mediaQuery).matches)
    const listener = event => {
      setPrefersReducedMotion(!event.matches)
    }
    mediaQueryList.addEventListener("change", listener)
    return () => {
      mediaQueryList.removeEventListener("change", listener)
    }
  }, [])
  return prefersReducedMotion
}

export default usePrefersReducedMotion
