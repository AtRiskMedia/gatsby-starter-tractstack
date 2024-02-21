// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { MapIcon, HomeIcon } from '@heroicons/react/24/outline'
// @ts-ignore
import fetch from 'isomorphic-fetch'
import Client from 'shopify-buy'

import { useStoryStepStore } from '../stores/storyStep'
import { useShopifyStore } from '../stores/shopify'
import Menu from './Menu'
import { CartButton } from '../shopify-components/CartButton'
import { IHeaderProps } from '@tractstack/types'
import { config } from '../../data/SiteConfig'
import Wordmark from '../../assets/wordmark.svg'
import Logo from '../../assets/logo.svg'

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
  function goHome() {
    processRead(config.home)
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
    <header className="relative z-90000 bg-white shadow-inner">
      <div className="flex flex-row flex-nowrap items-center justify-between py-3 px-4 md:px-8 bg-mygreen/10">
        <div className="flex flex-row flex-nowrap items-center">
          <Logo className="h-8" />
          <span className="w-1.5" />
          <Wordmark className="h-5 fill-myblack" />
        </div>
        {menuTheme ? <Menu theme={menuTheme} payload={menuPayload} /> : null}
      </div>
      <div className="flex flex-row flex-nowrap justify-between pt-4 pb-3 px-4 md:px-8 bg-mywhite shadow-inner">
        <h1 className="text-myblack truncate">{siteTitle}</h1>
        <div className="flex flex-row flex-nowrap">
          {config.initializeShopify && quantity > 0 ? (
            <CartButton quantity={quantity} />
          ) : null}
          {!isHome ? (
            <button className="mx-2 hover:text-blue" onClick={() => goHome()}>
              <HomeIcon className="w-6 h-6" title="Go to home page" />
            </button>
          ) : null}
          {hasStorySteps ? (
            <button
              className="mx-2 hover:text-blue"
              onClick={() => navigateBreadcrumbs()}
            >
              <MapIcon
                className="h-6 w-6"
                title="Your Content Journey | Breadcrumbs Path"
              />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
