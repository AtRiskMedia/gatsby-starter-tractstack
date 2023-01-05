import React, { useState, useEffect } from "react"

import { graph } from "../api/services"
import D3 from "../components/D3"

const getGraph = async fingerprint => {
  try {
    const response = await graph({ fingerprint })
    const data = response?.data
    if (data) {
      let graphNodes = [],
        graphNodeIds = []
      let graphRelationships = [],
        graphRelationshipIds = []
      data.forEach(row => {
        if (!graphNodeIds.includes(row.v.id)) {
          graphNodes.push(row.v)
          graphNodeIds.push(row.v.id)
        }
        if (!graphNodeIds.includes(row.c.id)) {
          graphNodes.push(row.c)
          graphNodeIds.push(row.c.id)
        }
        if (!graphRelationshipIds.includes(row.r.id)) {
          graphRelationships.push(row.r)
          graphRelationshipIds.push(row.r.id)
        }
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
  const [loading, setLoading] = useState(0)

  useEffect(() => {
    function goGetGraph() {
      setLoading(1)
      getGraph()
        .then(res => {
          setGraphData(res?.graph)
        })
        .catch(e => {
          console.log("An error occurred.", e)
        })
        .finally(setLoading(0))
    }
    if (graphData && Object.keys(graphData).length === 0 && !loading)
      goGetGraph()
  }, [graphData, setGraphData, loading, setLoading])
  const thisOptions = { ...graphOptions, neo4jData: graphData }
  if (graphData && Object.keys(graphData).length === 0) return <>Loading...</>
  return (
    <>
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
  labelFontSize: "18px",
}

export default ConciergeGraph
