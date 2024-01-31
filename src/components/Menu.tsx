// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import { Popover, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { preParseConcierge, lispLexer } from '@tractstack/helpers'

import { useStoryStepStore } from '../stores/storyStep'
import { config } from '../../data/SiteConfig'

const Menu = ({ theme, payload }: any) => {
  const processRead = useStoryStepStore((state) => state.processRead)
  const hooks = {
    belief: () => {},
    processRead: () => {},
    GatsbyImage: () => {},
    getImage: () => {},
    resourcePayload: () => {},
  }
  const id = {
    id: ``,
    title: ``,
    slug: ``,
    tractStackId: ``,
    tractStackTitle: ``,
    tractStackSlug: ``,
    home: config.home,
  }
  if (theme !== `default`) {
    console.log(`${theme} theme not found`)
    return <></>
  }
  const links = payload
    .filter((e: any) => !e.featured)
    .map((e: any) => {
      const item = { ...e }
      const payload = lispLexer(e.actionLisp)
      const to = preParseConcierge(payload, id, hooks)
      if (typeof to === `string`) {
        item.to = to
        item.internal = true
      } else if (typeof to === `object`) item.to = to[0]
      return item
    })
  const featuredLinks = payload
    .filter((e: any) => e.featured)
    .map((e: any) => {
      const item = { ...e }
      const payload = lispLexer(e.actionLisp)
      const to = preParseConcierge(payload, id, hooks)
      if (typeof to === `string`) {
        item.to = to
        item.internal = true
      } else if (typeof to === `object`) item.to = to[0]
      return item
    })

  return (
    <Popover className="relative">
      <Popover.Button className="mx-3 mt-3 inline-flex items-center gap-x-1 text-lg font-bold leading-6 text-myblue hover:text-black">
        <span>Menu</span>
        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-50 mt-5 flex w-screen max-w-max right-0 px-4">
          <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-mywhite text-sm leading-6 shadow-lg ring-1 ring-mydarkgrey/5">
            <div className="p-4">
              {links.map((item: any) => (
                <div
                  key={item.name}
                  className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-myorange/5"
                >
                  <div>
                    {item.internal ? (
                      <Link
                        to={item.to}
                        onClick={() => processRead()}
                        className="font-bold text-myblack hover:text-black"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                    ) : (
                      <a
                        href={item.to}
                        className="font-bold text-myblack hover:text-black"
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    )}
                    <p className="mt-1 text-mydarkgrey">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-8">
              <div className="flex justify-between">
                <h3 className="mt-4 text-sm leading-6 text-myblue">
                  Featured Links
                </h3>
                <Link
                  to="/breadcrumbs"
                  className="text-sm leading-6 text-myorange"
                >
                  Breadcrumbs <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
              <ul role="list" className="mt-6 space-y-6">
                {featuredLinks.map((item: any) => (
                  <li key={item.name} className="relative">
                    {item.internal ? (
                      <Link
                        to={item.to}
                        className="block truncate text-sm font-bold leading-6 text-mydarkgrey hover:text-black"
                        title={item.description}
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                    ) : (
                      <a
                        href={item.to}
                        className="block truncate text-sm font-bold leading-6 text-mydarkgrey hover:text-black"
                        title={item.description}
                      >
                        {item.name}
                        <span className="absolute inset-0" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default Menu
