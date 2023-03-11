import { useEffect } from 'react'
import { navigate } from 'gatsby'

const PageNotFound = () => {
  useEffect(() => {
    navigate(`/`)
  }, [])
  return null
}

export default PageNotFound
