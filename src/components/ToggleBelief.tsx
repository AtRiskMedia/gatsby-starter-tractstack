// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Switch } from '@headlessui/react'
import { classNames } from 'gatsby-plugin-tractstack'

import { IToggleBeliefProps } from 'src/types'
import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'

const ToggleBelief = ({
  belief,
  value,
  prompt,
  cssClasses,
  storyFragmentId,
}: IToggleBeliefProps) => {
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)
  const enabled = !![
    `FALSE`,
    `NO`,
    `NOT_INTERESTED`,
    `DISAGREE`,
    `STRONGLY_DISAGREE`,
  ].includes(value)

  const handleClick = () => {
    updateBeliefs(belief, value)
    pushEvent(
      {
        verb: value,
        id: belief,
        title: belief,
        type: `Belief`,
      },
      storyFragmentId,
    )
  }

  return (
    <Switch.Group
      as="div"
      className={classNames(`flex items-center `, cssClasses)}
    >
      <Switch
        checked={enabled}
        onChange={handleClick}
        className={classNames(
          enabled ? `bg-orange` : `bg-gray-200`,
          `relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange focus:ring-offset-2`,
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? `translate-x-5` : `translate-x-0`,
            `pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`,
          )}
        />
      </Switch>
      <Switch.Label as="span" className="ml-3 text-sm">
        <span className="font-bold text-black">{prompt}</span>
      </Switch.Label>
    </Switch.Group>
  )
}

export default ToggleBelief
