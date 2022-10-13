import * as React from "react"
import PropTypes from "prop-types"
import { TractStackIcon } from "gatsby-plugin-tractstack"

import D3 from "../components/D3"

const Header = ({ siteTitle, setLispActionPayload }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const graphOptions = {
    highlight: [
      {
        class: "Project",
        property: "name",
        value: "neo4jd3",
      },
      {
        class: "User",
        property: "userId",
        value: "eisman",
      },
    ],
    minCollision: 60,
    //neo4jDataUrl: "json/neo4jData.json",
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
                    labels: ["Visitor"],
                    properties: {},
                  },
                  {
                    id: "2",
                    labels: ["ConversionEvents"],
                    properties: {},
                  },
                  {
                    id: "3",
                    labels: ["SecurityMatters"],
                    properties: {},
                  },
                  {
                    id: "4",
                    labels: ["AtRiskMediaHelps"],
                    properties: {},
                  },
                  {
                    id: "5",
                    labels: ["Hero"],
                    properties: {},
                  },
                  {
                    id: "6",
                    labels: ["Impression"],
                    properties: {},
                  },
                  {
                    id: "7",
                    labels: ["Activity"],
                    properties: {},
                  },
                  {
                    id: "8",
                    labels: ["Welcome"],
                    properties: {},
                  },
                  {
                    id: "9",
                    labels: ["WelcomeToAtRiskMedia"],
                    properties: {},
                  },
                ],
                relationships: [
                  {
                    id: "1",
                    type: "SHARES",
                    startNode: "1",
                    endNode: "2",
                    properties: {},
                  },
                  {
                    id: "2",
                    type: "SHARES",
                    startNode: "2",
                    endNode: "3",
                    properties: {},
                  },
                  {
                    id: "3",
                    type: "SHARES",
                    startNode: "1",
                    endNode: "5",
                    properties: {},
                  },
                  {
                    id: "4",
                    type: "SHARES",
                    startNode: "1",
                    endNode: "6",
                    properties: {},
                  },
                  {
                    id: "5",
                    type: "SHARES",
                    startNode: "1",
                    endNode: "7",
                    properties: {},
                  },
                  {
                    id: "6",
                    type: "SHARES",
                    startNode: "5",
                    endNode: "8",
                    properties: {},
                  },
                  {
                    id: "7",
                    type: "SHARES",
                    startNode: "6",
                    endNode: "8",
                    properties: {},
                  },
                  {
                    id: "8",
                    type: "SHARES",
                    startNode: "7",
                    endNode: "8",
                    properties: {},
                  },
                  {
                    id: "9",
                    type: "SHARES",
                    startNode: "8",
                    endNode: "9",
                    properties: {},
                  },
                 {
                    id: "10",
                    type: "SHARES",
                    startNode: "7",
                    endNode: "3",
                    properties: {},
                  },
                  {
                    id: "11",
                    type: "SHARES",
                    startNode: "7",
                    endNode: "4",
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
    nodeRadius: 25,
    onRelationshipDoubleClick: function (relationship) {
      console.log(
        "double click on relationship: " + JSON.stringify(relationship)
      )
    },
    zoomFit: true,
  }

  return (
    <header
      className={isExpanded ? "expanded" : ``}
      style={{
        margin: `0 auto`,
        padding: `var(--space-2) var(--size-gutter)`,
        background: `var(--colour-lightgrey)`,
      }}
    >
      <div className="header">
        {siteTitle}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="header__toggle"
          style={{
            fontSize: `var(--font-sm)`,
            textDecoration: `none`,
          }}
        >
          <img
            alt="At Risk Media logo"
            height={30}
            style={{ margin: 0 }}
            src={TractStackIcon}
          />
        </button>
      </div>
      {isExpanded && (
        <div className="header__graph">
          <D3
            options={graphOptions}
            slug="concierge"
            setLispActionPayload={setLispActionPayload}
          />
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
  setLispActionPayload: PropTypes.func.isRequired,
}

Header.defaultProps = {
  siteTitle: ``,
  setLispActionPayload: (function () {})(),
}

export default Header
