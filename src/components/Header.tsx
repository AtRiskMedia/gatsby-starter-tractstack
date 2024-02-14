// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { TractStackIcon } from '@tractstack/helpers'
import { MapIcon, BackwardIcon, HomeIcon } from '@heroicons/react/24/outline'
// @ts-ignore
import fetch from 'isomorphic-fetch'
import Client from 'shopify-buy'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { useShopifyStore } from '../stores/shopify'
import Menu from './Menu'
import { CartButton } from '../shopify-components/CartButton'
import { IHeaderProps } from '@tractstack/types'
import { config } from '../../data/SiteConfig'

const Header = ({
  siteTitle,
  open = false,
  isHome = false,
  menu,
}: IHeaderProps) => {
  const menuTheme = typeof menu?.theme !== `undefined` ? menu.theme : null
  const menuPayload =
    typeof menu?.optionsPayload !== `undefined`
      ? JSON.parse(menu.optionsPayload)
      : null
  const initialize = useShopifyStore((state) => state.initialize)
  const setClient = useShopifyStore((state) => state.setClient)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const [shopifyInitialized, setShopifyInitialized] = useState(0)
  const processRead = useStoryStepStore((state) => state.processRead)
  const lastStoryStep = useStoryStepStore((state) => state.lastStoryStep)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const checkout = useShopifyStore((state) => state.checkout)
  const items = checkout ? checkout.lineItems : []
  const quantity = items.reduce((total: any, item: any) => {
    return total + item.quantity
  }, 0)
  const hasStorySteps = Object.keys(storySteps).length > 1

  function navigateBreadcrumbs() {
    processRead(`/breadcrumbs`)
  }
  function reveal() {
    processRead(`/concierge/profile`)
  }
  function goHome() {
    processRead(config.home)
  }
  function hide() {
    processRead(`<`)
  }

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
        if (lastStoryStep) processRead(lastStoryStep)
        else processRead(`/`)
      }
    }
    if (open) {
      document.addEventListener(`keydown`, handleEscapeKey)
      return () => document.removeEventListener(`keydown`, handleEscapeKey)
    }
  }, [open, lastStoryStep, processRead])

  return (
    <header className="relative z-90000">
      <div className="mx-auto flex justify-between px-4 py-5 md:space-x-10 md:px-8 bg-white shadow-inner shadow-darkgrey">
        <div className="flex flex-nowrap">
          <h1 className="text-xl leading-none mb-0 flex items-center font-action">
            {siteTitle}
          </h1>
        </div>
        <div className="inline-flex">
          {hasStorySteps ? (
            <>
              <button className="mx-2 hover:text-blue" onClick={() => hide()}>
                <BackwardIcon
                  className="h-8 w-8"
                  title="Return to previous page"
                />
              </button>
              <button
                className="mx-2 hover:text-blue"
                onClick={() => navigateBreadcrumbs()}
              >
                <MapIcon
                  className="h-8 w-8"
                  title="Your Content Journey | Breadcrumbs Path"
                />
              </button>
            </>
          ) : null}
          {isLoggedIn ? (
            <button
              className="mx-2 hover:text-blue"
              onClick={() => (!open ? reveal() : hide())}
              title="Tract Stack Settings"
            >
              <span className="sr-only">Open Tract Stack settings panel</span>
              <span className="h-8 w-8">
                <img
                  alt="Tract Stack logo. An impossibe square."
                  src={TractStackIcon}
                  className="h-8 w-8"
                />
              </span>
            </button>
          ) : null}
          {!isHome ? (
            <button className="mx-2 hover:text-blue" onClick={() => goHome()}>
              <HomeIcon className="w-8 h-8" title="Go to home page" />
            </button>
          ) : null}
          {menuTheme ? <Menu theme={menuTheme} payload={menuPayload} /> : null}
          {isLoggedIn && config.initializeShopify && quantity > 0 ? (
            <CartButton quantity={quantity} />
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
