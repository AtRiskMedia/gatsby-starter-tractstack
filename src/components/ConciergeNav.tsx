// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { classNames } from '@tractstack/helpers'
import {
  UserCircleIcon,
  BeakerIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  BackwardIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { IConciergeNavProps, IConciergeNavLinksProps } from '../types'

const _subNavigation = ({ active, hasAuth }: IConciergeNavLinksProps) => {
  const linksNotAuth = [
    {
      name: `Welcome`,
      href: `/concierge/profile`,
      icon: UserCircleIcon,
      current: active === `profile`,
    },
    {
      name: `Login`,
      href: `/concierge/login`,
      icon: ShieldCheckIcon,
      current: active === `login`,
    },
  ]
  const linksHasAuth = [
    {
      name: `Profile`,
      href: `/concierge/profile`,
      icon: UserCircleIcon,
      current: active === `profile`,
    },
  ]
  const links = [
    {
      name: `Knowledge Graph`,
      href: `/concierge/graph`,
      icon: BeakerIcon,
      current: active === `graph`,
    },
    {
      name: `Zero-Party Policy`,
      href: `/concierge/zeroParty`,
      icon: DocumentTextIcon,
      current: active === `zeroParty`,
    },
    {
      name: `Edit this Site`,
      href: `/concierge/storykeep`,
      icon: RectangleGroupIcon,
      current: active === `storykeep`,
    },
  ]
  if (!hasAuth) return linksNotAuth.concat(links)
  return linksHasAuth.concat(links)
}

const ConciergeNav = ({ active }: IConciergeNavProps) => {
  const processRead = useStoryStepStore((state) => state.processRead)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const hasAuth = !!isLoggedIn
  const subNavigation = _subNavigation({ active, hasAuth })

  return (
    <>
      {subNavigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => processRead()}
          className={classNames(
            item.current
              ? `bg-myorange/10 border-slate-200 text-black`
              : `border-transparent text-myblack hover:bg-myorange/5 hover:text-myblack`,
            `group border-l-4 px-3 py-2 flex items-center text-sm`,
          )}
          aria-current={item.current ? `page` : undefined}
        >
          <item.icon
            className={classNames(
              item.current
                ? `text-myblue group-hover:text-myblue`
                : `text-mydarkgrey group-hover:text-myblack`,
              `flex-shrink-0 -ml-1 mr-3 h-6 w-6`,
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </Link>
      ))}
      <Link
        key="close"
        to="/"
        onClick={() => processRead()}
        className="border-transparent text-myblack hover:bg-myorange/5 hover:text-myblack group border-l-4 px-3 py-2 flex items-center text-sm"
      >
        <BackwardIcon
          className="text-mydarkgrey group-hover:text-myblack flex-shrink-0 -m1-1 mr-3 h-6 w-6"
          aria-hidden="true"
        />
        <span className="truncate">Close this Panel</span>
      </Link>
    </>
  )
}

export default ConciergeNav
