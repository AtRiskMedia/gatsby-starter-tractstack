// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { SocialIcons } from 'gatsby-plugin-tractstack'

import { config } from '../../data/SiteConfig'
import { IFooterProps } from '../types'

const Footer = ({ observe }: IFooterProps) => {
  const footerText = config.footer
  return (
    <footer
      className="z-80000 static"
      aria-labelledby="footer-heading"
      ref={observe}
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl py-4 px-4 sm:px-6 lg:py-8 lg:px-8">
        <div className="mt-2 border-t border-lightgrey pt-4 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {config.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-black"
              >
                <span className="sr-only">{item.name}</span>
                <SocialIcons
                  name={item.name}
                  className="h-6 w-6"
                  ariaHidden={true}
                />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xl text-darkgrey md:order-1 md:mt-0 mr-0 md:mr-16 md:max-w-xl">
            © {new Date().getFullYear()} &middot; {footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
