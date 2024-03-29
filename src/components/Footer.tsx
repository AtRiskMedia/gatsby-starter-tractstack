// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { ArrowUpIcon } from '@heroicons/react/20/solid'
import { SocialIcons } from '@tractstack/helpers'
import { IFooterProps } from '@tractstack/types'

import FooterMenu from './FooterMenu'
import { config } from '../../data/SiteConfig'

const Footer = ({ menu }: IFooterProps) => {
  const footerText = config.footer
  const socials = config.social.split(`,`)
  const socialLink = (href: string) => {
    let name = ``
    if (href && href.includes(`twitter.com`)) name = `Twitter`
    else if (href && href.includes(`github.com`)) name = `GitHub`
    if (name) return { name, href }
    return null
  }
  const socialLinks = socials
    .map((e: string) => {
      return socialLink(e.trim())
    })
    .filter((e) => e)
  const menuTheme = typeof menu?.theme !== `undefined` ? menu.theme : null
  const menuPayload =
    typeof menu?.optionsPayload !== `undefined`
      ? JSON.parse(menu.optionsPayload)
      : null

  const scrollToTop = () => {
    if (typeof window !== `undefined`)
      window.scrollTo({
        top: 0,
        behavior: `smooth`,
      })
  }

  return (
    <footer className="bg-white">
      <div className="text-right px-6 pt-6">
        <button onClick={scrollToTop} title="Back to top">
          <ArrowUpIcon className="w-12 h-12 text-myblue/50 hover:text-black" />
        </button>
      </div>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 pb-20 sm:pb-24 lg:px-8">
        {menuTheme ? (
          <FooterMenu theme={menuTheme} payload={menuPayload} />
        ) : null}
        <div className="mt-10 flex justify-center space-x-10">
          {socialLinks.map((item) => (
            <a
              key={item?.name}
              href={item?.href}
              title={item?.name}
              className="text-mylightgrey hover:text-myblue"
            >
              <span className="sr-only">{item?.name}</span>
              <SocialIcons
                name={item?.name || ``}
                className="h-6 w-6"
                ariaHidden={true}
              />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-mydarkgrey">
          © {new Date().getFullYear()} &middot; {footerText}
        </p>
      </div>
    </footer>
  )
}

export default Footer
