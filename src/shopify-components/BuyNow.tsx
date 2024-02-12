// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useShopifyStore } from '../stores/shopify'

export function BuyNow({ variantId, quantity, available, ...props }: any) {
  const loading = useShopifyStore((state) => state.loading)
  const addVariantToCart = useShopifyStore((state) => state.addVariantToCart)

  function buyNow(e: any) {
    e.preventDefault()
    addVariantToCart(variantId, quantity, true)
  }

  return (
    <button
      type="submit"
      className="mt-2 flex w-full items-center justify-center rounded-md border border-transparent bg-lime-100 py-3 px-8 text-base text-black hover:bg-myorange focus:outline-none focus:ring-2 focus:ring-mygreen focus:ring-offset-2"
      onClick={buyNow}
      disabled={!available || loading}
      {...props}
    >
      {available ? `Buy Now` : `Out of Stock`}
    </button>
  )
}
