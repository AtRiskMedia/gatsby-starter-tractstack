// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { SocialIcons } from '@tractstack/helpers'
import { IFooterProps } from '@tractstack/types'

import { config } from '../../data/SiteConfig'

const Footer = ({ observe }: IFooterProps) => {
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

  return (
    <footer
      className="z-80000 static"
      aria-labelledby="footer-heading"
      ref={observe}
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl py-4 px-4 md:py-8 md:px-8">
        <div className="mt-2 pt-4 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2 mr-16">
            {socialLinks.map((item) => (
              <a
                key={item?.name}
                href={item?.href}
                title={item?.name}
                className="text-mydarkgrey hover:text-black"
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
          <p className="mt-8 text-xl text-mydarkgrey md:order-1 md:mt-0 mr-0 md:mr-16 md:max-w-xl">
            © {new Date().getFullYear()} &middot; {footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
