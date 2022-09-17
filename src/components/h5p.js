import React from "react"
import PropTypes from "prop-types"

const H5p = ({ src, title, slug }) => {
  const handleContentRef = dom => {
    console.log("listening", dom)
    if (dom) {
      dom.onload = () => {
        console.log("listen")
        dom?.contentWindow?.H5p?.externalDispatcher?.on(
          "xAPI",
          function (event) {
            console.log("hit")
            console.log(event.data.statement)
          }
        )
      }
    }
  }
  return (
    <iframe
      id={slug}
      title={title}
      ref={handleContentRef}
      src={src}
      frameBorder="0"
      allowFullScreen="allowfullscreen"
    />
  )
}

H5p.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default H5p
