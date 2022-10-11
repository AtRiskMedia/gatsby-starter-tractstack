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
                    labels: ["You"],
                    properties: {
                      visitorId: "wedowpkdpoewkdwedw",
                    },
                  },
                  {
                    id: "2",
                    labels: ["Concierge"],
                    properties: {},
                  },
                  {
                    id: "3",
                    labels: ["YourEpinet"],
                    properties: {
                      visitorId: "wedowpkdpoewkdwedw",
                    },
                  },
                ],
                relationships: [
                  {
                    id: "1",
                    type: "KNOWS",
                    startNode: "2",
                    endNode: "1",
                    properties: {},
                  },
                  {
                    id: "2",
                    type: "BELIEVES",
                    startNode: "2",
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
