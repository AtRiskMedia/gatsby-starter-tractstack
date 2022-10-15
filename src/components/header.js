import * as React from "react"
import PropTypes from "prop-types"
import { TractStackIcon } from "gatsby-plugin-tractstack"

import D3 from "../components/D3"

const Header = ({ siteTitle }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const graphOptions = {
    distance: 100,
    labelFontSize: "14px",
    legend: {
      StoryFragment: 0,
      Claim: 1,
      Impression: 2,
      Pane: 3,
      Activity: 4,
      Visitor: 5,
      UNLOCKS: 6,
      CLAIMS: 7,
      KNOWS: 8,
      BELIEVES: 9,
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
                    properties: {},
                  },
                  {
                    id: "2",
                    labels: ["SecurityMatters"],
                    properties: {},
                  },
                  {
                    id: "3",
                    labels: ["AtRiskMediaHelps"],
                    properties: {},
                  },
                  {
                    id: "4",
                    labels: ["Hero"],
                    properties: {},
                  },
                  {
                    id: "5",
                    labels: ["Impression"],
                    properties: {},
                  },
                  {
                    id: "6",
                    labels: ["Activity"],
                    properties: {},
                  },
                  {
                    id: "7",
                    labels: ["WelcomeToAtRiskMedia"],
                    properties: {},
                  },
                ],
                relationships: [
                  {
                    id: "1",
                    type: "UNLOCKS",
                    startNode: "1",
                    endNode: "7",
                    properties: {},
                  },
                  {
                    id: "2",
                    type: "UNLOCKS",
                    startNode: "7",
                    endNode: "5",
                    properties: {},
                  },
                  {
                    id: "3",
                    type: "UNLOCKS",
                    startNode: "7",
                    endNode: "4",
                    properties: {},
                  },
                  {
                    id: "4",
                    type: "UNLOCKS",
                    startNode: "7",
                    endNode: "6",
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
