// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { IToggleBeliefProps } from 'src/types'
import { useAuthStore } from '../stores/authStore'
import { useStoryStepStore } from '../stores/storyStep'

const ToggleBelief = ({ belief, value, prompt, cssClasses, storyFragmentId }: IToggleBeliefProps) => {
  const updateBeliefs = useAuthStore((state) => state.updateBeliefs)
  const pushEvent = useStoryStepStore((state) => state.pushEvent)

  const handleClick = () => {
    updateBeliefs(belief, value)
    pushEvent(
      {
        verb: value,
        id: belief,
        title: ``,
        type: `Belief`,
      },
      storyFragmentId,
    )
    console.log(belief, value)
  }

  return <button onClick={handleClick} className={cssClasses}>{prompt}</button>
}

export default ToggleBelief
