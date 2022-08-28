import * as React from "react"
import PropTypes from "prop-types"

const Controller = ({ panesArray, impressions }) => {
  let carouselSlides = []
  let icons = []
  if (panesArray?.length)
    panesArray.map(p => {
      if (impressions.hasOwnProperty(p)) {
        carouselSlides.push(impressions[p].carouselSlides)
        icons.push(impressions[p].icons)
      }
    })
  return (
    <aside>
      {carouselSlides} {icons}
    </aside>
  )
}

Controller.propTypes = {
  panesArray: PropTypes.array.isRequired,
  impressions: PropTypes.object.isRequired,
}

export default Controller
