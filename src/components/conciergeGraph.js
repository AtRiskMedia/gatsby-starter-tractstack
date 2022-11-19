import * as React from "react"

import D3 from "../components/D3"

const ConciergeGraph = () => {
  return (
    <div className="divide-y divide-gray-200 lg:col-span-9 h-screen max-h-[40rem]">
      <D3 options={graphOptions} slug="conciergeGraph" />
    </div>
  )
}

const graphOptions = {
  distance: 150,
  strength: -350,
  infoPanel: true,
  labelFontSize: "18px",
  neo4jData: {
    results: [
      {
        columns: ["user", "entity"],
        data: [
          {
            graph: {
              nodes: [
                {
                  id: "1",
                  type: "visitor",
                  labels: ["Visitor"],
                  properties: {},
                },
                {
                  id: "2",
                  type: "claim",
                  labels: ["SecurityMatters"],
                  properties: {},
                },
                {
                  id: "3",
                  type: "claim",
                  labels: ["AtRiskMediaHelps"],
                  properties: {},
                },
                {
                  id: "4",
                  type: "pane",
                  labels: ["Hero"],
                  properties: {},
                },
                {
                  id: "5",
                  type: "impression",
                  labels: ["Impression"],
                  properties: {},
                },
                {
                  id: "6",
                  type: "pane",
                  labels: ["Pane"],
                  properties: {},
                },
                {
                  id: "7",
                  labels: ["Activity"],
                  properties: {},
                },
              ],
              relationships: [
                {
                  id: "1",
                  type: "DISCOVERS",
                  startNode: "1",
                  endNode: "4",
                  properties: {},
                },
                {
                  id: "2",
                  type: "DISCOVERS",
                  startNode: "1",
                  endNode: "6",
                  properties: {},
                },
                {
                  id: "3",
                  type: "REVEALS",
                  startNode: "6",
                  endNode: "5",
                  properties: {},
                },
                {
                  id: "4",
                  type: "REVEALS",
                  startNode: "6",
                  endNode: "7",
                  properties: {},
                },
                {
                  id: "5",
                  type: "KNOWS",
                  startNode: "1",
                  endNode: "2",
                  properties: {},
                },
                {
                  id: "6",
                  type: "BELIEVES",
                  startNode: "1",
                  endNode: "2",
                  properties: {},
                },
                {
                  id: "7",
                  type: "KNOWS",
                  startNode: "1",
                  endNode: "3",
                  properties: {},
                },
              ],
            },
          },
        ],
      },
    ],
    errors: [],
  },
}

export default ConciergeGraph
