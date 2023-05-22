// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useEffect, useState } from 'react'
import { TractStackIcon } from 'gatsby-plugin-tractstack'
import { BackwardIcon, BeakerIcon } from '@heroicons/react/24/outline'
// @ts-ignore
import fetch from 'isomorphic-fetch'
import Client from 'shopify-buy'

import { useStoryStepStore } from '../stores/storyStep'
import { useAuthStore } from '../stores/authStore'
import { useShopifyStore } from '../stores/shopify'
import { CartButton } from '../shopify-components/CartButton'
import { IHeaderProps } from '../types'
import { config } from '../../data/SiteConfig'

const Header = ({ siteTitle, open = false }: IHeaderProps) => {
  const initialize = useShopifyStore((state) => state.initialize)
  const setClient = useShopifyStore((state) => state.setClient)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn())
  const [shopifyInitialized, setShopifyInitialized] = useState(0)
  const processRead = useStoryStepStore((state) => state.processRead)
  const lastStoryStep = useStoryStepStore((state) => state.lastStoryStep)
  const currentStoryStepCount = useStoryStepStore(
    (state) => state.currentStoryStepCount,
  )
  const lastStoryStepCount =
    currentStoryStepCount && parseInt(currentStoryStepCount) > 0
      ? (parseInt(currentStoryStepCount) - 1).toString()
      : `0`
  const storySteps = useStoryStepStore((state) => state.storySteps)
  const pastStorySteps = useStoryStepStore((state) => state.pastStorySteps)
  const checkout = useShopifyStore((state) => state.checkout)
  const items = checkout ? checkout.lineItems : []
  const quantity = items.reduce((total: any, item: any) => {
    return total + item.quantity
  }, 0)
  const hasStorySteps = Object.keys(storySteps).length > 1
  const viewport =
    typeof window === `undefined`
      ? `1920`
      : window?.innerWidth < 801
      ? `600`
      : window?.innerWidth < 1367
      ? `1080`
      : `1920`
  const goBackPayload =
    parseInt(lastStoryStepCount) > 0
      ? storySteps[pastStorySteps[lastStoryStepCount].timecode]
      : null
  const goBackText = goBackPayload ? `Go to last page` : `Go to home page`
  const goBackTo =
    goBackPayload?.type === `storyFragment`
      ? `/${goBackPayload.id}/${viewport}`
      : goBackPayload?.type === `content`
      ? `/context/${goBackPayload.id}`
      : goBackPayload?.type === `products`
      ? `/products/${goBackPayload.id}`
      : goBackPayload?.type === `concierge`
      ? `/concierge/${goBackPayload.id}`
      : `/`
  function navigateBreadcrumbs() {
    processRead(`/breadcrumbs`)
  }
  function reveal() {
    processRead(`/concierge/profile`)
  }
  function hide() {
    processRead(goBackTo)
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
      <div className="mx-auto flex justify-between px-4 py-5 sm:px-8 sm:py-4 md:space-x-10 lg:px-8 bg-white shadow-inner shadow-darkgrey">
        <div className="flex flex-nowrap">
          <h1 className="text-xl leading-none mb-0 flex items-center font-action">
            {siteTitle}
          </h1>
        </div>
        <div className="inline-flex">
          {hasStorySteps ? (
            <>
              <button className="mx-2 hover:text-blue" onClick={() => hide()}>
                <BackwardIcon className="h-8 w-8" title={goBackText} />
              </button>
              <button
                className="mx-2 hover:text-blue"
                onClick={() => navigateBreadcrumbs()}
              >
                <BeakerIcon className="h-8 w-8" title="Breadcrumbs menu" />
              </button>
            </>
          ) : null}
          {isLoggedIn ? (
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
          {isLoggedIn && config.initializeShopify && quantity > 0 ? (
            <CartButton quantity={quantity} />
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
