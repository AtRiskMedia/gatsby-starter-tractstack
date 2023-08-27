// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import {
  classNames,
  heldBeliefsScales,
  heldBeliefsTitles,
} from 'gatsby-plugin-tractstack'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import { IBeliefProps } from '../types'

const Belief = ({
  value,
  cssClasses,
  cssClassesExtra = ``,
  storyFragmentId,
}: IBeliefProps) => {
  const thisScaleLookup = value.scale
  const extra = value && typeof value.extra === `string` ? value.extra : null
  // @ts-expect-error
  const thisTitle = heldBeliefsTitles[thisScaleLookup]
  // @ts-expect-error
  const thisScale = heldBeliefsScales[thisScaleLookup]
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const beliefs = useAuthStore((state) => state.beliefs)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)
  const [selected, setSelected] = useState<any>(false)
  const [init, setInit] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = (e: any) => {
    setSelected(e)
    updateBeliefs(value.slug, e.slug)
    pushEvent(
      {
        verb: e.slug,
        id: value.slug,
        title: thisTitle,
        type: `Belief`,
      },
      storyFragmentId,
    )
    const newCount =
      beliefs.NonTechnical && beliefs.Confusing
        ? 2
        : beliefs.NonTechnical || beliefs.Confusing
        ? 1
        : 0
    if (newCount !== count) setCount(newCount)
  }

  useEffect(() => {
    function doInit() {
      const hasMatchingBelief = beliefs[value.slug]
      const knownOffset =
        typeof hasMatchingBelief === `string`
          ? thisScale.filter((e: any) => e.slug === hasMatchingBelief)[0]
          : false
      if (knownOffset.slug && !selected.slug) {
        setSelected(knownOffset)
        setInit(true)
      }
    }
    if (!init) setTimeout(() => doInit(), 50)
  }, [init, setInit, beliefs, thisScale, selected.slug, value.slug])

  return (
    <div className={classNames(cssClasses, `inline-flex`)}>
      {extra ? (
        <div className="mr-4 flex justify-center items-end">
          <span className={cssClassesExtra}>{extra}</span>
        </div>
      ) : null}
      <Listbox value={selected} onChange={handleClick}>
        {({ open }) => (
          <>
            <div className="relative mt-1 -rotate-1">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-slate-200 bg-white text-allblack py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange sm:text-sm">
                <span className="flex items-center">
                  <span
                    aria-label="Color swatch for belief"
                    className={classNames(
                      selected?.color ? selected.color : `bg-slate-200`,
                      `inline-block h-2 w-2 flex-shrink-0 rounded-full`,
                    )}
                  />
                  <span className="ml-3 block truncate">
                    {selected?.name || thisTitle}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-lightgrey"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {thisScale.map((factor: any) => (
                    <Listbox.Option
                      key={factor.id}
                      className={({ active }) =>
                        classNames(
                          active ? `text-blue bg-slate-200` : `text-black`,
                          `relative cursor-default select-none py-2 pl-3 pr-9`,
                        )
                      }
                      value={factor}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                factor.color,
                                `inline-block h-2 w-2 flex-shrink-0 rounded-full`,
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                selected ? `underline` : ``,
                                `ml-3 block truncate`,
                              )}
                            >
                              {factor.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? `text-white` : `text-allblack`,
                                `absolute inset-y-0 right-0 flex items-center px-2`,
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default Belief
