import React from "react"
import { concierge } from "gatsby-plugin-tractstack"

const H5P = ({ src, title, slug, updateEventStream }) => {
  const handleContentRef = dom => {
    if (dom) {
      dom.onload = () => {
        dom?.contentWindow?.H5P?.externalDispatcher?.on(
          "xAPI",
          function (event) {
            const id = event?.data?.statement?.object?.id
            const type = event?.data?.statement?.object?.objectType
            const verb =
              typeof event?.data?.statement?.verb?.display === "object" &&
              event?.data?.statement?.verb?.display?.hasOwnProperty("en-US")
                ? event.data.statement.verb.display["en-US"]
                : ``
            const name =
              typeof event?.data?.statement?.object?.definition?.name ===
                "object" &&
              event?.data?.statement?.object?.definition?.name?.hasOwnProperty(
                "en-US"
              )
                ? event.data.statement.object.definition?.name["en-US"]
                : ``
            const score = event?.data?.statement?.result?.score?.scaled
            const durationRaw = event?.data?.statement?.result?.duration
            const regex = /PT(\d+\.?\d*)S/g
            const durationParsed = regex?.exec(durationRaw)
            const durationInSeconds =
              typeof durationParsed === "object" &&
              durationParsed?.hasOwnProperty("1")
                ? Number(durationParsed[1])
                : null
            //const durationInSeconds = typeof durationParsed === "object" ? durationParsed[1] : ``
            console.log(
              "h5p xAPI event has occurred",
              verb,
              id,
              name,
              type,
              score,
              durationInSeconds
            )
            concierge(
              ["h5p", [verb, [id, name, type, score]]],
              false,
              updateEventStream
            )
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

export default H5P
