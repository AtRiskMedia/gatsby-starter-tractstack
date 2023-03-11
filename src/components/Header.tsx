// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { navigate } from 'gatsby'
import { TractStackIcon } from 'gatsby-plugin-tractstack'
import { LockClosedIcon, HomeIcon } from '@heroicons/react/24/outline'
// @ts-ignore
import fetch from 'isomorphic-fetch'
import Client from 'shopify-buy'

import { useStoryStepStore } from '../stores/storyStep'
import { useShopifyStore } from '../stores/shopify'
import { CartButton } from '../shopify-components/CartButton'
import { IHeaderProps } from '../types'
import { config } from '../../data/SiteConfig'

const Header = ({ siteTitle, open = false, masked = false }: IHeaderProps) => {
  const processRead = useStoryStepStore((state) => state.processRead)
  const last = useStoryStepStore((state) => state.last)
  const checkout = useShopifyStore((state) => state.checkout)
  const items = checkout ? checkout.lineItems : []
  const quantity = items.reduce((total: any, item: any) => {
    return total + item.quantity
  }, 0)

  function navigateHome() {
    const regExp = `/${config.home}/(600|1080|1920)/`
    const thisViewport =
      typeof window === `undefined`
        ? false
        : window.innerWidth < 801
        ? `600`
        : window.innerWidth < 1367
        ? `1080`
        : `1920`
    const goto = window.location.pathname.match(regExp)?.length
      ? false
      : `/${config.home}/${thisViewport}`
    if (goto) navigate(goto)
  }
  function reveal() {
    processRead()
    navigate(`/concierge/profile`)
  }
  function hide() {
    if (last && typeof last === `string`) navigate(last)
    else navigate(`/`)
  }

  const initialize = useShopifyStore((state) => state.initialize)
  const setClient = useShopifyStore((state) => state.setClient)
  const [shopifyInitialized, setShopifyInitialized] = useState(0)
  useEffect(() => {
    if (shopifyInitialized === 0 && config.initializeShopify) {
      const client = Client.buildClient(
        {
          domain: process.env.GATSBY_SHOPIFY_STORE_URL || ``,
          storefrontAccessToken:
            process.env.GATSBY_STOREFRONT_ACCESS_TOKEN || ``,
          apiVersion: `2023-01`,
        },
        fetch,
      )
      setClient(client)
      initialize()
      setShopifyInitialized(1)
    } else if (!config.initializeShopify) {
      setShopifyInitialized(-1)
    }
  }, [initialize, setClient, shopifyInitialized, setShopifyInitialized])

  useEffect(() => {
    function handleEscapeKey(event: any) {
      if (event.code === `Escape`) {
        if (last && typeof last === `string`) navigate(last)
        else navigate(`/`)
      }
    }
    if (open) {
      document.addEventListener(`keydown`, handleEscapeKey)
      return () => document.removeEventListener(`keydown`, handleEscapeKey)
    }
  }, [open, last])

  return (
    <header>
      <div className="mx-auto flex justify-between px-4 py-5 sm:px-6 sm:py-4 md:space-x-10 lg:px-8 bg-lightgrey shadow-inner shadow-darkgrey">
        <div className="flex flex-nowrap">
          <button onClick={() => navigateHome()}>
            <HomeIcon className="h-6 w-6 pb-1" />
          </button>
          {` `}
          &nbsp; | &nbsp;{` `}
          <h1 className="text-xl leading-none mb-0 flex items-center">
            {siteTitle}
          </h1>
        </div>
        <div className="inline-flex">
          {masked ? (
            <>
              <span className="sr-only">
                Privacy-first browser detected. All concierge services
                disengaged!
              </span>
              <LockClosedIcon
                className="h-6 w-6"
                aria-hidden="true"
                title="Privacy-first browser detected. All concierge services disengaged!"
              />
            </>
          ) : !open ? (
            <button onClick={() => reveal()}>
              <span className="sr-only">Open concierge panel</span>
              <span>
                <img
                  alt="At Risk Media logo"
                  height={`30px`}
                  style={{ margin: 0, maxHeight: `30px` }}
                  src={TractStackIcon}
                />
              </span>
            </button>
          ) : (
            <button className="hover:text-blue" onClick={() => hide()}>
              <span className="sr-only">Hide concierge panel</span>
              Go Back
            </button>
          )}
          {config.initializeShopify && quantity > 0 ? (
            <CartButton quantity={quantity} />
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
