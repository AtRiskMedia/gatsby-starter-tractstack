import { useEffect } from "react"
import { navigate } from "gatsby"

const IndexPage = () => {
  useEffect(() => {
    navigate("/welcome")
  }, [])
  return null
}

export default IndexPage
