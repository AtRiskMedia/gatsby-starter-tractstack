import React from "react"
import PropTypes from "prop-types"
import Neo4jd3 from "neo4jd3"

const D3 = ({ options, slug, setLispActionPayload }) => {
  React.useEffect(
    function injectD3() {
      // have to investigate ... possibly pass functions (with setLispActionPayload) by adding them to options
      console.log("d3 todo")
      const d3 = new Neo4jd3(`#${slug}`, options)
      console.log(d3)
    },
    [slug, options]
  )
  return <div id={slug}></div>
}

D3.propTypes = {
  options: PropTypes.object.isRequired,
  slug: PropTypes.string.isRequired,
  setLispActionPayload: PropTypes.func.isRequired,
}

export default D3
