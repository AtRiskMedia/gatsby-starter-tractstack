import React, { useState, useEffect } from "react"

import { graph } from "../api/services"
import D3 from "../components/D3"

const getGraph = async fingerprint => {
  try {
    const response = await graph({ fingerprint })
    const data = response?.data
    if (data) {
      console.log('todo', data)
      let graphNodes = []
      let graphRelationships = []
      data.forEach((row) => {
        graphNodes.push(row.v)
        graphNodes.push(row.c)
        graphRelationships.push(row.r)
      })
      const graph = {
        results: [
          {
            columns: ["user", "entity"],
            data: [
              {
                graph: {
                  nodes: graphNodes,
                  relationships: graphRelationships,
                },
              },
            ],
          },
        ],
        errors: [],
      }
      return { graph: graph, error: null }
    }
    return { graph: null, error: null }
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
      graph: null,
    }
  }
}

const ConciergeGraph = () => {
  const [graphData, setGraphData] = useState({})

  useEffect(() => {
    function goGetGraph() {
      getGraph().then(res => {
        console.log(res)
        setGraphData(res?.graph)
      })
    }
    if (graphData && Object.keys(graphData).length === 0) goGetGraph()
  }, [graphData, setGraphData])
  const thisOptions = { ...graphOptions, neo4jData: graphData }
  if (graphData && Object.keys(graphData).length === 0) return <></>
  console.log(thisOptions)
  return (
    <>
      <p className="p-4">* coming soon; this isn't real data yet!</p>
      <div className="divide-y divide-gray-200 lg:col-span-9 h-screen max-h-[40rem]">
        <D3 options={thisOptions} slug="conciergeGraph" />
      </div>
    </>
  )
}

const graphOptions = {
  distance: 150,
  strength: -350,
  infoPanel: true,
  labelFontSize: "18px"
}

export default ConciergeGraph
