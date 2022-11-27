import * as React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const Context = ({ children, updatePanesVisible }) => {
  function hideContext() {
    console.log(1)
    updatePanesVisible("revealContext", false)
  }
  React.useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        hideContext()
      }
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [])

  return (
    <div id="context" className="z-80010 bg-allblack-seethrough">
      <button
        type="button"
        className="z-70020 absolute right-8 top-8 rounded-md bg-lightgrey text-black hover:text-white hover:bg-orange focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
        onClick={() => hideContext()}
      >
        <span className="sr-only">Hide controller</span>
        <XMarkIcon className="h-16 w-16" aria-hidden="true" />
      </button>
      {children}
    </div>
  )
}

export default Context
