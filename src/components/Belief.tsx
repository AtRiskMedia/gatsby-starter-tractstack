// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useState, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { classNames } from 'gatsby-plugin-tractstack'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import { IBeliefProps } from '../types'

const likertscale = [
  { id: 1, name: `Strongly disagree`, color: `bg-red-400` },
  { id: 2, name: `Disagree`, color: `bg-amber-400` },
  { id: 3, name: `Neither agree nor disagree`, color: `bg-slate-200` },
  { id: 4, name: `Agree`, color: `bg-lime-400` },
  { id: 5, name: `Strongly agree`, color: `bg-teal-400` },
]

const Belief = ({ value, cssClasses }: IBeliefProps) => {
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const beliefs = useAuthStore((state) => state.beliefs)
  const updateEventStream = useStoryStepStore(
    (state) => state.updateEventStream,
  )
  const thisBelief = beliefs[value.slug]
  const selectedOffset: any =
    typeof thisBelief === `string`
      ? likertscale.filter((e) => e.name === beliefs[value.slug])[0]
      : false
  const [selected, setSelected] = useState(selectedOffset)
  const [lastSelected, setLastSelected] = useState(false)

  useEffect(() => {
    if (
      (selected?.name && !lastSelected) ||
      (selected?.name && selected.name !== lastSelected)
    ) {
      setLastSelected(selected.name)
      updateBeliefs(value.slug, selected.name)
      updateEventStream(Date.now(), {
        verb: selected.name,
        id: value.slug,
        title: value.title,
        type: `Belief`,
      })
    }
  }, [
    value,
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
                  <span className="ml-3 block truncate">
                    {selected ? selected.name : `Agree or Disagree?`}
                  </span>
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
                  {likertscale.map((likert) => (
                    <Listbox.Option
                      key={likert.id}
                      className={({ active }) =>
                        classNames(
                          active ? `text-blue bg-slate-200` : `text-gray-900`,
                          `relative cursor-default select-none py-2 pl-3 pr-9`,
                        )
                      }
                      value={likert}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                likert.color,
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
                              {likert.name}
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
