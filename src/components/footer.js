import * as React from "react"
import { SocialIcons } from "gatsby-plugin-tractstack"

import config from "../../data/SiteConfig"

const Footer = ({ observe }) => {
  return (
    <footer className="bg-white" aria-labelledby="footer-heading" ref={observe}>
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {config.social.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                <SocialIcons
                  name={item.name}
                  className="h-6 w-6"
                  ariaHidden="true"
                />
              </a>
            ))}
          </div>
          <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0 mr-0 md:mr-16 md:max-w-xl">
            © {new Date().getFullYear()} &middot; {config.footer}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
