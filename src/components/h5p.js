import React from "react"
import PropTypes from "prop-types"

const H5p = ({ src, title }) => {
  const onIframeRef = node => {
    if (!node) {
      return
    }
    node.contentWindow.addEventListener("load", () => {
      node.contentWindow.H5P.externalDispatcher.on("xAPI", function (event) {
        console.log(event)
      })
      console.log("h5p listener")
    })
  }

  return (
    <iframe
      ref={onIframeRef}
      sandbox="allow-same-origin"
      title={title}
      src={src}
    />
  )
}

H5p.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default H5p
