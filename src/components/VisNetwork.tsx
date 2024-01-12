// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useEffect, useState } from 'react'
import { navigate, Link } from 'gatsby'
import { Network } from 'vis-network'
import { Dialog, Transition } from '@headlessui/react'
import { BeakerIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { config } from '../../data/SiteConfig'
import { useStoryStepStore } from '../stores/storyStep'

const VisNetwork = ({ nodes, payload }: any) => {
  const setGotoLastPane = useStoryStepStore((state) => state.setGotoLastPane)
  const [gotoMenu, setGotoMenu] = useState<any>({})
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const goto = ({ title, type }: { title: string; type: string }) => {
      let gotoSlug
      let gotoContextSlug
      let gotoSlugs: any[] = []
      let gotoParentTitle

      if (type === `TractStack`) {
        nodes.allNodeTractstack.edges.forEach((e: any) => {
          if (e.node.title === title) {
            gotoSlugs = e.node.relationships.storyFragments.map((f: any) => {
              return [
                f.slug !== config.home ? `/${f.slug}` : `/`,
                f.slug,
                f.title,
              ]
            })
            gotoParentTitle = title
          }
        })
      }

      if (type === `StoryFragment`) {
        nodes.allNodeStoryFragment.edges.forEach((e: any) => {
          if (e.node.title === title) {
            gotoSlug = e.node.slug !== config.home ? `/${e.node.slug}` : `/`
          }
        })
      }

      if (type === `Pane`) {
        let found = false
        nodes.allNodeStoryFragment.edges.forEach((e: any) => {
          e.node.relationships.panes.forEach((f: any) => {
            if (f.title === title) {
              found = true
              gotoParentTitle = title
              gotoSlugs.push([
                e.node.slug !== config.home ? `/${e.node.slug}` : `/`,
                e.node.slug,
                e.node.title,
                f.id,
              ])
            }
          })
          if (!found) {
            e.node.relationships.contextPanes.forEach((f: any) => {
              if (f.title === title) {
                found = true
                gotoContextSlug = `/context/${f.slug}`
              }
            })
          }
        })
        if (!found)
          nodes.allNodeTractstack.edges.forEach((e: any) => {
            e.node.relationships.contextPanes.forEach((f: any) => {
              if (f.title === title) {
                found = true
                gotoContextSlug = `/context/${f.slug}`
              }
            })
          })
      }

      if (gotoSlug) navigate(gotoSlug)
      if (gotoContextSlug) navigate(gotoContextSlug)
      if (
        gotoSlugs.length === 1 &&
        typeof gotoSlugs[0] !== `undefined` &&
        typeof gotoSlugs[0][0] !== `undefined` &&
        typeof gotoSlugs[0][1] !== `undefined` &&
        typeof gotoSlugs[0][2] !== `undefined` &&
        typeof gotoSlugs[0][3] !== `undefined`
      ) {
        setGotoLastPane([gotoSlugs[0][3], gotoSlugs[0][1]])
        navigate(gotoSlugs[0][0])
      } else {
        setGotoMenu({ title: gotoParentTitle, slugs: gotoSlugs, type })
        setOpen(true)
      }
    }
    const container = document.getElementById(`mynetwork`)
    const options = {
      nodes: {
        shape: `dot`,
        scaling: {
          label: {
            min: 8,
            max: 20,
          },
        },
      },
    }
    if (container) {
      const network = new Network(container, payload, options)
      network.on(`doubleClick`, function (params) {
        const nid = params?.nodes?.length > 0 ? params.nodes[0] : null
        if (nid) {
          const thisNode = payload.nodes.filter((e: any) => nid === e.id)
          if (thisNode.length)
            goto({ title: thisNode[0].label, type: thisNode[0].title })
        }
      })
    }
  }, [nodes, payload, setGotoLastPane])

  return (
    <>
      {open ? (
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-myblue bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                      <button
                        type="button"
                        className="rounded-md bg-white text-mydarkgrey hover:text-myblue focus:outline-none focus:ring-2 focus:ring-mygreen focus:ring-offset-2"
                        onClick={() => setOpen(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-myorange/20 sm:mx-0 sm:h-10 sm:w-10">
                        <BeakerIcon
                          className="h-6 w-6 text-myorange"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-bold leading-6 text-myblack"
                        >
                          Fast Travel
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-myblue">
                            {gotoMenu.type === `TractStack`
                              ? `This Tract Stack has the following Story Fragments:`
                              : gotoMenu.type === `Pane`
                                ? `This Pane is on the following pages:`
                                : null}
                          </p>
                          <ul className="py-3 text-md">
                            {gotoMenu.slugs.map((e: any) => (
                              <li className="py-2" key={e[1]}>
                                <Link
                                  onClick={() => {
                                    if (gotoMenu.type === `Pane`)
                                      setGotoLastPane([e[3], e[1]])
                                  }}
                                  to={e[0]}
                                >
                                  {e[2]}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      ) : null}
      <div id="mynetwork" className="w-full h-full"></div>
    </>
  )
}

export default VisNetwork
