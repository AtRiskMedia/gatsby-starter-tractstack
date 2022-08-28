import * as React from "react"
import PropTypes from "prop-types"

const Controller = ({ panesArray, impressions }) => {
  let thisImpressions = []
  if( panesArray?.length )
  panesArray.map(p => {
    if (impressions.hasOwnProperty(p)) thisImpressions.push(impressions[p])
  })
  return <aside>{thisImpressions}</aside>
}

Controller.propTypes = {
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Controller
