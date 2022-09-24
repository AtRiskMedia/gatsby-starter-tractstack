import React from "react"
import PropTypes from "prop-types"

const H5p = ({ src, title, slug, setLispActionHook }) => {
  const handleContentRef = dom => {
    if (dom) {
      dom.onload = () => {
        dom?.contentWindow?.H5P?.externalDispatcher?.on(
          "xAPI",
          function (event) {
            console.log(JSON.stringify(event.data.statement))

            const id = event?.data?.statement?.object?.id
            const type = event?.data?.statement?.object?.objectType
            const verb =
              typeof event?.data?.statement?.verb?.display === "object" &&
              event?.data?.statement?.verb?.display?.hasOwnProperty("en-US")
                ? event.data.statement.verb.display["en-US"]
                : ``
            const name =
              typeof event?.data?.statement?.object?.name === "object" &&
              event?.data?.statement?.object?.name?.hasOwnProperty("en-US")
                ? event.data.statement.object.name["en-US"]
                : ``
            const result = event?.data?.statement?.result?.score?.scaled
            console.log(verb, id, name, type, result)
            //setLispActionHook(["h5p", [JSON.stringify(event.data.statement)]])
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
