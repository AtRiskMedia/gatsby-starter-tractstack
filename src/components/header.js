import * as React from "react"
import PropTypes from "prop-types"
import { Popover, Transition } from "@headlessui/react"
import { TractStackIcon, classNames } from "gatsby-plugin-tractstack"
import { Bars3Icon } from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/20/solid"

import D3 from "../components/D3"

const Header = ({ siteTitle }) => {
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

  return (
    <header>
      <Popover className="relative bg-lightgrey">
        <div
          className="pointer-events-none absolute inset-0 z-70030 shadow"
          aria-hidden="true"
        />
        <div className="relative z-70020">
          <div className="mx-auto flex justify-between px-4 py-5 sm:px-6 sm:py-4 md:space-x-10 lg:px-8">
            <div>{siteTitle}</div>
            <div>
              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center rounded-md p-8 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>
              <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                <Popover>
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={classNames(
                          open ? "text-gray-900" : "text-gray-500",
                          "group inline-flex items-center rounded-md text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        )}
                      >
                        <span>
                          <img
                            alt="At Risk Media logo"
                            height={"30px"}
                            style={{ margin: 0, maxHeight: "30px" }}
                            src={TractStackIcon}
                          />
                        </span>
                        <ChevronDownIcon
                          className={classNames(
                            open ? "text-gray-600" : "text-gray-400",
                            "ml-2 h-5 w-5 group-hover:text-gray-500"
                          )}
                          aria-hidden="true"
                        />
                      </Popover.Button>

                      <Transition
                        as={React.Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 -translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 -translate-y-1"
                      >
                        <Popover.Panel className="absolute h-screen inset-x-0 top-full z-70010 hidden transform shadow-lg md:block">
                          <div className="absolute inset-0 flex">
                            <div className="w-1/2 bg-allwhite" />
                            <div className="w-1/2 bg-white" />
                          </div>
                          <div className="relative h-screen mx-auto grid grid-cols-1 lg:grid-cols-2">
                            <div className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
                              <p>
                                This experience is powered by Tract Stack
                                Concierge.
                              </p>
                            </div>
                            <div className="px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
                              <D3
                                options={graphOptions}
                                slug="conciergeGraph"
                              />
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </Popover>
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
