// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { classNames } from 'gatsby-plugin-tractstack'
import {
  UserCircleIcon,
  BeakerIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

import { IConciergeNavProps } from '../types'

const _subNavigation = ({ active, auth = false }: IConciergeNavProps) => {
  const notAuth = [
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
  const hasAuth = [
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
  ]

  if (!auth) return notAuth.concat(links)
  return hasAuth.concat(links)
}

const ConciergeNav = ({ active, auth }: IConciergeNavProps) => {
  const subNavigation = _subNavigation({ active, auth })
  return (
    <>
      {subNavigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={classNames(
            item.current
              ? `bg-slate-100 border-slate-200 text-black hover:text-black`
              : `border-transparent text-gray-900 hover:bg-slate-200 hover:text-gray-900`,
            `group border-l-4 px-3 py-2 flex items-center text-sm font-medium`,
          )}
          aria-current={item.current ? `page` : undefined}
        >
          <item.icon
            className={classNames(
              item.current
                ? `text-blue group-hover:text-blue`
                : `text-gray-400 group-hover:text-gray-500`,
              `flex-shrink-0 -ml-1 mr-3 h-6 w-6`,
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </Link>
      ))}
    </>
  )
}

export default ConciergeNav
