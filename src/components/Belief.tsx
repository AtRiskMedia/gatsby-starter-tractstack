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

const Belief = ({ value, cssClasses }: IBeliefProps) => {
  const thisScaleLookup = value.scale
  // @ts-expect-error
  const thisTitle = heldBeliefsTitles[thisScaleLookup]
  // @ts-expect-error
  const thisScale = heldBeliefsScales[thisScaleLookup]
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const beliefs = useAuthStore((state) => state.beliefs)
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const hasMatchingBelief = beliefs[value.slug]
  const selectedOffset: any =
    typeof hasMatchingBelief === `string`
      ? thisScale.filter((e: any) => e.slug === beliefs[value.slug])[0]
      : { id: 0, name: thisTitle, slug: `none`, color: `` }
  const [selected, setSelected] = useState(selectedOffset)
  const [lastSelected, setLastSelected] = useState(``)

  useEffect(() => {
    if (selected.slug === `none`) setSelected(selectedOffset)
  }, [selected, selectedOffset, setSelected, hasMatchingBelief])

  useEffect(() => {
    if (
      (selected?.slug && !lastSelected && selected.slug !== `none`) ||
      (selected?.slug &&
        selected.slug !== lastSelected &&
        selected.slug !== `none`)
    ) {
      setLastSelected(selected.slug)
      updateBeliefs(value.slug, selected.slug)
      updateEventStream(Date.now(), {
        verb: selected.slug,
        id: value.slug,
        title: thisTitle,
        type: `Belief`,
      })
    }
  }, [
    value,
    thisTitle,
    selected,
    lastSelected,
    updateBeliefs,
    updateEventStream,
    setLastSelected,
  ])

  return (
    <div className={cssClasses}>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <div className="relative mt-1">
              <Listbox.Button className="relative cursor-default rounded-md border border-gray-300 bg-white text-allblack py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange sm:text-sm">
                <span className="flex items-center">
                  <span
                    aria-label="Color swatch for belief"
                    className={classNames(
                      selected.color ? selected.color : `bg-slate-200`,
                      `inline-block h-2 w-2 flex-shrink-0 rounded-full`,
                    )}
                  />
                  <span className="ml-3 block truncate">{selected.name}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
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
                <Listbox.Options className="absolute z-90000 mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {thisScale.map((factor: any) => (
                    <Listbox.Option
                      key={factor.id}
                      className={({ active }) =>
                        classNames(
                          active ? `text-blue bg-slate-200` : `text-gray-900`,
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
                                selected ? `font-semibold` : `font-normal`,
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
                                `absolute inset-y-0 right-0 flex items-center pr-4`,
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
