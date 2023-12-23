// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'
import { processGraphPayload } from '@tractstack/helpers'

import { getGraph } from '../api/services'
import VisNetwork from './VisNetwork'
import { useAuthStore } from '../stores/authStore'

const goGetGraph = async () => {
  try {
    const response = await getGraph()
    const data =
      typeof response?.data !== `undefined`
        ? processGraphPayload(response?.data)
        : null
    return { graph: data, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const Graph = () => {
  const [graphData, setGraphData] = useState({})
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())

  useEffect(() => {
    if (
      isLoggedIn &&
      graphData &&
      Object.keys(graphData).length === 0 &&
      !loading &&
      !loaded
    ) {
      setLoading(true)
      goGetGraph()
        .then((res: any) => {
          console.log(res?.graph)
          setGraphData(res?.graph)
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => setLoaded(true))
      setLoading(false)
    }
  }, [
    isLoggedIn,
    graphData,
    setGraphData,
    loaded,
    loading,
    setLoaded,
    setLoading,
  ])

  return (
    <section className="xl:max-w-screen-2xl h-full">
      <div className="h-full shadow-sm bg-white">
        {!loaded ? (
          <div className="flex items-center justify-center h-full">
            <div className="max-w-xs leading-6 text-lg text-mydarkgrey">
              <p>
                <strong>LOADING</strong>
              </p>
            </div>
          </div>
        ) : (
          <VisNetwork payload={graphData} />
        )}
      </div>
    </section>
  )
}

export default Graph
