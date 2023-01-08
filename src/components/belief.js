import React, { Fragment, useState } from "react"
import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid"
import { classNames } from "gatsby-plugin-tractstack"

import { useStoryStepStore } from "../stores/storyStep"
import { useAuthStore } from "../stores/authStore"

const likert = [
  { id: 0, name: "Agree or Disagree?", color: "bg-slate-50" },
  { id: 1, name: "Strongly disagree", color: "bg-red-400" },
  { id: 2, name: "Disagree", color: "bg-amber-400" },
  { id: 3, name: "Neither agree nor disagree", color: "bg-slate-200" },
  { id: 4, name: "Agree", color: "bg-lime-400" },
  { id: 5, name: "Strongly agree", color: "bg-teal-400" },
]

const Belief = ({ value, cssClasses }) => {
  const updateEventStream = useStoryStepStore(state => state.updateEventStream)
  const updateBeliefs = useAuthStore(state => state.updateBeliefs)

  const [selected, setSelected] = useState(people[3])

  return (
    <div className={cssClasses}>
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">
              Assigned to
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange sm:text-sm">
                <span className="flex items-center">
                  <span
                    aria-label={selected.online ? "Online" : "Offline"}
                    className={classNames(
                      selected.online ? "bg-green-400" : "bg-gray-200",
                      "inline-block h-2 w-2 flex-shrink-0 rounded-full"
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
                  {people.map(likert => (
                    <Listbox.Option
                      key={likert.id}
                      className={({ active }) =>
                        classNames(
                          active ? `text-white bg-slate-200` : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
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
                                "inline-block h-2 w-2 flex-shrink-0 rounded-full"
                              )}
                              aria-hidden="true"
                            />
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "ml-3 block truncate"
                              )}
                            >
                              {likert.name}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-orange",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
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

  //return <span>{value}</span>
}

export default Belief
