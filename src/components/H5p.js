import React from "react"
import PropTypes from "prop-types"

const H5p = ({ src, title, slug }) => {
  const handleContentRef = dom => {
    if (dom) {
      dom.onload = () => {
        dom?.contentWindow?.H5P?.externalDispatcher?.on(
          "xAPI",
          function (event) {
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
