import * as React from "react"
import PropTypes from "prop-types"
import { Routes, Route, Link, HashRouter, useLocation } from "react-router-dom"
import { Popover, Transition } from "@headlessui/react"
import { TractStackIcon, classNames } from "gatsby-plugin-tractstack"
import {
  Bars3Icon,
  CogIcon,
  KeyIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import ConciergeProfile from "./conciergeProfile.js"
import ConciergeGraph from "./conciergeGraph.js"

const _subNavigation = hash => {
  return [
    {
      name: "Profile",
      href: "/profile",
      icon: UserCircleIcon,
      current: hash === "#/profile" || hash === `#/`,
    },
    {
      name: "Knowledge Graph",
      href: "/graph",
      icon: CogIcon,
      current: hash === "#/graph",
    },
    {
      name: "Tract Stack",
      href: "/tractstack",
      icon: KeyIcon,
      current: hash === "#/tractstack",
    },
  ]
}

const TractStack = () => {
  return (
    <div className="divide-y divide-gray-200 lg:col-span-9">
      <div className="py-6 px-4 sm:p-6 lg:pb-8">
        <h3 className="text-xl text-darkgrey mb-4">
          This website has been created using{" "}
          <span className="text-allblack font-bold">Tract Stack</span>
        </h3>

        <p className="text-md text-gray-500 mt-4 max-w-xl">
          Think of this website as an interactive business pitch deck.
        </p>
        <p className="text-md text-gray-500 mt-4 max-w-xl">
          We care about helping businesses build community and make meaningful
          connections with prospective clients/customers. Above all, we want to
          validate whether these products/services are a good fit for{" "}
          <span className="italic">your</span> business.
        </p>
        <p className="text-md text-gray-500 mt-4 max-w-xl">
          As you navigate this site, our special algorithms are taking note of
          where you place your attention. Depending on your path through this
          site, we may make recommendations for free supports and resources.
          Check out the <Link to={"/graph"}>knowledge graph</Link> to see this
          in real-time!
        </p>
        <p className="text-md text-gray-500 mt-4 max-w-xl font-bold">
          All data is anonymized, though we do invite you to introduce yourself.
        </p>
      </div>
    </div>
  )
}
const SubNav = () => {
  const location = useLocation()
  const hash = `#${location.pathname}`
  const subNavigation = _subNavigation(hash)
  return subNavigation.map(item => (
    <Link
      key={item.name}
      to={item.href}
      className={classNames(
        item.current
          ? "bg-slate-100 border-slate-200 text-black hover:text-black"
          : "border-transparent text-gray-900 hover:bg-slate-200 hover:text-gray-900",
        "group border-l-4 px-3 py-2 flex items-center text-sm font-medium"
      )}
      aria-current={item.current ? "page" : undefined}
    >
      <item.icon
        className={classNames(
          item.current
            ? "text-blue group-hover:text-blue"
            : "text-gray-400 group-hover:text-gray-500",
          "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
        )}
        aria-hidden="true"
      />
      <span className="truncate">{item.name}</span>
    </Link>
  ))
}

const Header = ({ siteTitle }) => {
  return (
    <HashRouter>
      <header>
        <Popover className="relative bg-lightgrey">
          <div
            className="pointer-events-none absolute inset-0 z-70030 shadow"
            aria-hidden="true"
          />
          <div className="relative z-70020">
            <div className="mx-auto flex justify-between px-4 py-5 sm:px-6 sm:py-4 md:space-x-10 lg:px-8">
              <h1 className="text-xl mb-0 flex items-center">{siteTitle}</h1>
              <div>
                <div className="-my-2 -mr-2 hidden">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md p-8 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange">
                    <span className="sr-only">Open menu</span>
                    <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <Popover>
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={classNames(
                            open ? "text-gray-900" : "text-gray-500",
                            "group inline-flex items-center rounded-md text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2"
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
                          <Popover.Panel className="absolute h-screen inset-x-0 top-full z-70010 transform shadow-lg block mt-1">
                            <div className="w-full h-full">
                              <main className="relative bg-allwhite">
                                <div className="mx-auto px-2 pb-4 sm:px-4 lg:px-6 lg:pb-6">
                                  <div className="overflow-hidden rounded-lg bg-white shadow">
                                    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                                      <aside className="py-6 lg:col-span-3">
                                        <nav className="space-y-1">
                                          <Routes>
                                            <Route
                                              path="*"
                                              element={<SubNav />}
                                            />
                                          </Routes>
                                        </nav>
                                      </aside>
                                      <Routes>
                                        <Route
                                          path="/"
                                          element={<ConciergeProfile />}
                                        />
                                        <Route
                                          path="/profile"
                                          element={<ConciergeProfile />}
                                        />
                                        <Route
                                          path="/graph"
                                          element={<ConciergeGraph />}
                                        />
                                        <Route
                                          path="/tractstack"
                                          element={<TractStack />}
                                        />
                                      </Routes>
                                    </div>
                                  </div>
                                </div>
                              </main>
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
    </HashRouter>
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
