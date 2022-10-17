import * as React from "react"
import PropTypes from "prop-types"
import { TractStackIcon } from "gatsby-plugin-tractstack"

import D3 from "../components/D3"

const Header = ({ siteTitle }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const graphOptions = {
    distance: 150,
    strength: -350,
    labelFontSize: "18px",
    legend: {
      pane: 0,
      INCLUDES: 0,
      visitor: 1,
      VISITS: 1,
      KNOWS: 6,
      BELIEVES: 7,
      claim: 2,
      impression: 3,
      activity: 4,
    },
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
                    properties: {
                      id: 1000,
                      type: "visitor",
                    },
                  },
                  {
                    id: "2",
                    labels: ["SecurityMatters"],
                    properties: {
                      id: 500,
                      type: "claim",
                    },
                  },
                  {
                    id: "3",
                    labels: ["AtRiskMediaHelps"],
                    properties: {
                      id: 501,
                      type: "claim",
                    },
                  },
                  {
                    id: "4",
                    labels: ["Hero"],
                    properties: {
                      id: 800,
                      type: "pane",
                    },
                  },
                  {
                    id: "5",
                    labels: ["Impression"],
                    properties: {
                      id: 900,
                      type: "impression",
                    },
                  },
                  {
                    id: "6",
                    labels: ["Pane"],
                    properties: {
                      id: 700,
                      type: "pane",
                    },
                  },
                  {
                    id: "7",
                    labels: ["Activity"],
                    properties: {
                      id: 701,
                      type: "activity",
                    },
                  },
                ],
                relationships: [
                  {
                    id: "1",
                    type: "VISITS",
                    startNode: "1",
                    endNode: "4",
                    properties: {},
                  },
                  {
                    id: "2",
                    type: "VISITS",
                    startNode: "1",
                    endNode: "6",
                    properties: {},
                  },
                  {
                    id: "3",
                    type: "INCLUDES",
                    startNode: "6",
                    endNode: "5",
                    properties: {},
                  },
                  {
                    id: "4",
                    type: "INCLUDES",
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
          <D3 options={graphOptions} slug="concierge" />
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
