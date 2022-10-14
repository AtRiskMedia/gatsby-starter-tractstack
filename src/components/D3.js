import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import Neo4jd3 from "neo4jd3"

const D3 = ({ options, slug }) => {
  const [thisOptions, setThisOptions] = useState({})
  useEffect(
    function injectD3() {
      if (JSON.stringify(options) !== JSON.stringify(thisOptions)) {
        setThisOptions(options)
      }
      if (
        thisOptions.hasOwnProperty("neo4jData") ||
        thisOptions.hasOwnProperty("neo4jDataUrl")
      )
        new Neo4jd3(`#${slug}`, thisOptions)
    },
    [slug, options, thisOptions, setThisOptions]
  )
  return <div id={slug}></div>
}

D3.propTypes = {
  options: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
}

export default D3
