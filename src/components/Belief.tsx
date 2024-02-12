// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import {
  classNames,
  heldBeliefsScales,
  heldBeliefsTitles,
} from '@tractstack/helpers'

import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'
import { IBeliefProps } from '../types'

// whitelist: bg-teal-400 bg-lime-400 bg-slate-200 bg-amber-400 bg-red-400 bg-lime-400 bg-amber-400 bg-lime-400 bg-amber-400 bg-lime-400 bg-amber-400 bg-lime-400 bg-amber-400

const Belief = ({ value, cssClasses = ``, storyFragmentId }: IBeliefProps) => {
  const thisScaleLookup = value.scale
  const extra = value && typeof value.extra === `string` ? value.extra : null
  // @ts-expect-error
  const thisTitle = heldBeliefsTitles[thisScaleLookup]
  // @ts-expect-error
  const thisScale = heldBeliefsScales[thisScaleLookup]
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const beliefs = useAuthStore((state) => state.beliefs)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)

  const handleClick = (e: any) => {
    updateBeliefs(value.slug, e.slug)
    pushEvent(
      {
        verb: e.slug,
        id: value.slug,
        title: value.slug,
        type: `Belief`,
      },
      storyFragmentId,
    )
  }

  const selected = useMemo(() => {
    const hasMatchingBelief = beliefs[value.slug]
    const knownOffset =
      typeof hasMatchingBelief === `string`
        ? thisScale.filter((e: any) => e.slug === hasMatchingBelief)[0]
        : false
    if (knownOffset.slug) return knownOffset
    return null
  }, [beliefs, thisScale, value.slug])

  return (
    <>
      {extra ? (
        <div className={classNames(cssClasses, `block pb-2`)}>{extra}</div>
      ) : null}
      <div className="inline-block">
        <Listbox value={selected} onChange={handleClick}>
          {({ open }) => (
            <>
              <div className="z-90101 relative mt-1">
                <Listbox.Button
                  className={classNames(
                    selected?.color
                      ? `border-${selected.color.substring(3)}`
                      : `bg-slate-200`,
                    `relative w-full cursor-default rounded-md border bg-white text-black py-2 pl-3 pr-10 text-left shadow-sm focus:border-myorange focus:outline-none focus:ring-1 focus:ring-myorange sm:text-sm`,
                  )}
                >
                  <span className="flex items-center">
                    <span
                      aria-label="Color swatch for belief"
                      className={classNames(
                        `motion-safe:animate-pulse`,
                        selected?.color ? selected.color : `bg-myorange`,
                        `inline-block h-2 w-2 flex-shrink-0 rounded-full`,
                      )}
                    />
                    <span className="ml-3 block truncate">
                      {selected?.name || thisTitle}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-mylightgrey"
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
                            active ? `text-myblue bg-slate-200` : `text-black`,
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
                                  active ? `text-white` : `text-black`,
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
    </>
  )
}

export default Belief
