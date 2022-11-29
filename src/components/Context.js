import * as React from "react"
import { XMarkIcon } from "@heroicons/react/24/outline"

const Context = ({ children, last, updatePanesVisible }) => {
  function hideContext() {
    updatePanesVisible("revealContext", false)
    updatePanesVisible("gotoLast", true)
  }
  React.useEffect(() => {
    function handleEscapeKey(event) {
      if (event.code === "Escape") {
        updatePanesVisible("revealContext", false)
        updatePanesVisible("gotoLast", true)
      }
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [updatePanesVisible])

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
