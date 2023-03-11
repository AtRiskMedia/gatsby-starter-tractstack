import { create } from 'zustand'

import { IShopifyStoreState } from '../types'
import { config } from '../../data/SiteConfig'

export const useShopifyStore = create<IShopifyStoreState>((set, get) => ({
  cart: [],
  isOpen: false,
  loading: false,
  client: {},
  checkout: null,
  initialize: () => {
    const isBrowser = typeof window !== `undefined`
    const client = get().client
    const setCheckoutItem = get().setCheckoutItem
    const initializeCheckout = async () => {
      const existingCheckoutID = isBrowser
        ? window.localStorage.getItem(config.localStorageKey)
        : null
      if (existingCheckoutID && existingCheckoutID !== `null`) {
        try {
          const existingCheckout = await client.checkout.fetch(
            existingCheckoutID,
          )
          if (!existingCheckout.completedAt) {
            setCheckoutItem(existingCheckout)
            return
          }
        } catch (e) {
          localStorage.removeItem(config.localStorageKey)
        }
      }
      const newCheckout = await client.checkout.create()
      setCheckoutItem(newCheckout)
    }
    initializeCheckout()
  },
  onOpen: () => {},
  onClose: () => {},
  addVariantToCart: (variantId: string, quantity: string, buyNow?: boolean) => {
    const checkout = get().checkout
    if (
      buyNow &&
      checkout.lineItems.filter((e: any) => e.variant.id === variantId).length
    ) {
      window.open(checkout.webUrl)
      return null
    }
    const setLoading = get().setLoading
    const setCheckout = get().setCheckout
    const client = get().client
    setLoading(true)
    const checkoutID = checkout?.id
    if (checkoutID) {
      const lineItemsToUpdate = [
        {
          variantId,
          quantity: parseInt(quantity, 10),
        },
      ]
      return client.checkout
        .addLineItems(checkoutID, lineItemsToUpdate)
        .then((res: any) => {
          setCheckout(res)
          setLoading(false)
          if (buyNow) window.open(checkout.webUrl)
        })
    }
  },
  removeLineItem: (checkoutID: string, lineItemID: number) => {
    const setLoading = get().setLoading
    const setCheckout = get().setCheckout
    const client = get().client
    setLoading(true)
    return client.checkout
      .removeLineItems(checkoutID, [lineItemID])
      .then((res: any) => {
        setCheckout(res)
        setLoading(false)
      })
  },
  updateLineItem: (
    checkoutID: string,
    lineItemID: number,
    quantity: string,
  ) => {
    const setLoading = get().setLoading
    const setCheckout = get().setCheckout
    const client = get().client
    setLoading(true)
    const lineItemsToUpdate = [
      { id: lineItemID, quantity: parseInt(quantity, 10) },
    ]
    return client.checkout
      .updateLineItems(checkoutID, lineItemsToUpdate)
      .then((res: any) => {
        setCheckout(res)
        setLoading(false)
      })
  },
  setIsOpen: (open: boolean) => {
    set((state) => ({ ...state, isOpen: open }))
  },
  setLoading: (loading: boolean) => {
    set((state) => ({ ...state, isLoading: loading }))
  },
  setClient: (client: any) => {
    set((state) => ({ ...state, client }))
  },
  setCheckout: (checkout: any) => {
    set((state) => ({ ...state, checkout }))
  },
  setCheckoutItem: (checkout: any) => {
    const isBrowser = typeof window !== `undefined`
    const setCheckout = get().setCheckout
    if (isBrowser)
      window.localStorage.setItem(config.localStorageKey, checkout.id)
    setCheckout(checkout)
  },
}))
