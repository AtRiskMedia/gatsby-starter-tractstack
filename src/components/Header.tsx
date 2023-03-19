// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { TractStackIcon } from 'gatsby-plugin-tractstack'
import { BackwardIcon, BeakerIcon } from '@heroicons/react/24/outline'
// @ts-ignore
import fetch from 'isomorphic-fetch'
import Client from 'shopify-buy'

import { useStoryStepStore } from '../stores/storyStep'
import { useShopifyStore } from '../stores/shopify'
import { CartButton } from '../shopify-components/CartButton'
import { IHeaderProps } from '../types'
import { config } from '../../data/SiteConfig'

const Header = ({ siteTitle, open = false }: IHeaderProps) => {
  const [loaded, setLoaded] = useState(false)
  const processRead = useStoryStepStore((state) => state.processRead)
  const lastStoryStep = useStoryStepStore((state) => state.lastStoryStep)
  const checkout = useShopifyStore((state) => state.checkout)
  const items = checkout ? checkout.lineItems : []
  const quantity = items.reduce((total: any, item: any) => {
    return total + item.quantity
  }, 0)
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const hasStorySteps = Object.keys(storySteps).length > 1
  const regExp = `/${config.home}/(600|1080|1920)/`
  const isHome =
    typeof window !== `undefined`
      ? window.location.pathname.match(regExp)?.length
      : false

  function navigateHome() {
    processRead(config.home)
  }
  function navigateBreadcrumbs() {
    processRead(`/breadcrumbs`)
  }
  function reveal() {
    processRead(`/concierge/profile`)
  }
  function hide() {
    const goto = lastStoryStep || config.home || `/`
    processRead(goto)
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
        if (lastStoryStep) processRead(lastStoryStep)
        else processRead(`/`)
      }
    }
    if (open) {
      document.addEventListener(`keydown`, handleEscapeKey)
      return () => document.removeEventListener(`keydown`, handleEscapeKey)
    }
  }, [open, lastStoryStep, processRead])

  useEffect(() => {
    if (!loaded) setLoaded(true)
  }, [loaded, setLoaded])

  return (
    <header className="relative z-90000">
      <div className="mx-auto flex justify-between px-4 py-5 sm:px-8 sm:py-4 md:space-x-10 lg:px-8 bg-lightgrey shadow-inner shadow-darkgrey">
        <div className="flex flex-nowrap">
          <h1 className="text-xl leading-none mb-0 flex items-center font-action">
            {siteTitle}
          </h1>
        </div>
        <div className="inline-flex">
          {loaded && !isHome && hasStorySteps ? (
            <button className="mx-2 hover:text-blue" onClick={() => hide()}>
              <BackwardIcon className="h-8 w-8" title="Go to Last Page" />
            </button>
          ) : loaded && !isHome ? (
            <button
              className="mx-2 hover:text-blue"
              onClick={() => navigateHome()}
            >
              <BackwardIcon className="h-8 w-8" title="Go to Home Page" />
            </button>
          ) : null}
          {loaded && hasStorySteps ? (
            <button
              className="mx-2 hover:text-blue"
              onClick={() => navigateBreadcrumbs()}
            >
              <BeakerIcon className="h-8 w-8" title="Breadcrumbs menu" />
            </button>
          ) : null}
          {loaded ? (
            <button
              className="mx-2 hover:text-blue"
              onClick={() => (!open ? reveal() : hide())}
              title="Visit the Concierge"
            >
              <span className="sr-only">Open concierge panel</span>
              <span>
                <img
                  alt="Tract Stack logo. An impossibe square."
                  className="h-8 w-8"
                  src={TractStackIcon}
                />
              </span>
            </button>
          ) : null}
          {loaded && config.initializeShopify && quantity > 0 ? (
            <CartButton quantity={quantity} />
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
