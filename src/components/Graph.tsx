// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { graph } from '../api/services'
import D3 from './D3'

const getGraph = async () => {
  try {
    const response = await graph()
    const data = response?.data
    if (data) {
      const graphNodes: any = []
      const graphNodeIds: any = []
      const graphRelationships: any = []
      const graphRelationshipIds: any = []
      data.forEach((row: any) => {
        if (!graphNodeIds.includes(row.v.id)) {
          graphNodes.push(row.v)
          graphNodeIds.push(row.v.id)
        }
        if (!graphNodeIds.includes(row.c.id)) {
          graphNodes.push(row.c)
          graphNodeIds.push(row.c.id)
        }
        if (!graphNodeIds.includes(row.s.id)) {
          graphNodes.push(row.s)
          graphNodeIds.push(row.s.id)
        }
        if (!graphNodeIds.includes(row.t.id)) {
          graphNodes.push(row.t)
          graphNodeIds.push(row.t.id)
        }
        if (!graphRelationshipIds.includes(row.a.id)) {
          graphRelationships.push(row.a)
          graphRelationshipIds.push(row.a.id)
        }
        if (!graphRelationshipIds.includes(row.d.id)) {
          graphRelationships.push(row.d)
          graphRelationshipIds.push(row.d.id)
        }
        if (!graphRelationshipIds.includes(row.r.id)) {
          graphRelationships.push(row.r)
          graphRelationshipIds.push(row.r.id)
        }
      })
      const graph = {
        results: [
          {
            columns: [`user`, `entity`],
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
      return { graph, error: null }
    }
    return { graph: null, error: null }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      graph: null,
    }
  }
}

const Graph = () => {
  const [graphData, setGraphData] = useState({})
  const [loading, setLoading] = useState(0)

  useEffect(() => {
    function goGetGraph() {
      setLoading(1)
      getGraph()
        .then((res: any) => {
          setGraphData(res?.graph)
        })
        .catch((e) => {
          console.log(`An error occurred.`, e)
        })
        .finally(() => setLoading(0))
    }
    if (graphData && Object.keys(graphData).length === 0 && !loading)
      goGetGraph()
  }, [graphData, setGraphData, loading, setLoading])
  const thisOptions = { ...graphOptions, neo4jData: graphData }

  return (
    <>
      {graphData === null ? (
        <div className="flex items-center justify-center h-full">
          <div className="max-w-xs leading-6 text-lg text-darkgrey">
            <p>
              <strong>
                Breadcrumbs knowledge graph data has insufficient data.
              </strong>
              {` `}
              <em>Please come back after navigating the website some more.</em>
            </p>
          </div>
        </div>
      ) : (
        <D3 options={thisOptions} slug="conciergeGraph" />
      )}
    </>
  )
}

const graphOptions = {
  distance: 100,
  strength: -150,
  infoPanel: true,
  labelFontSize: `9px`,
}

export default Graph
