// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState, useEffect } from 'react'

import { useAuthStore } from '../../stores/authStore'
import { graph } from '../../api/services'
import D3 from '../../components/D3'
import Seo from '../../components/Seo'
import Header from '../../components/Header'
import ConciergeNav from '../../components/ConciergeNav'
import Footer from '../../components/Footer'

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

const ConciergeGraph = () => {
  const [graphData, setGraphData] = useState({})
  const [loading, setLoading] = useState(0)
  const authData = useAuthStore((state) => state.authData)
  const authenticated = authData.authenticated

  useEffect(() => {
    function goGetGraph() {
      setLoading(1)
      getGraph()
        .then((res: any) => {
          console.log(res?.graph)
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
      <Header siteTitle="Site Map | Knowledge graph" open={true} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <aside className="py-6 lg:col-span-3">
                  <nav className="space-y-1">
                    <ConciergeNav active="graph" auth={authenticated} />
                  </nav>
                </aside>

                <div className="divide-y divide-gray-200 lg:col-span-9 h-screen max-h-[40rem]">
                  {graphData === null ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="max-w-xs leading-6 text-lg text-darkgrey">
                        <strong>No data yet.</strong>
                        {` `}
                        <em>
                          Please come back after navigating the website some
                          more.
                        </em>
                      </div>
                    </div>
                  ) : (
                    <D3 options={thisOptions} slug="conciergeGraph" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

const graphOptions = {
  distance: 100,
  strength: -150,
  infoPanel: true,
  labelFontSize: `9px`,
}

export const Head = () => <Seo title="Site Map | Knowledge graph" />

export default ConciergeGraph
