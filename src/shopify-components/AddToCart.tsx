// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'

import { useShopifyStore } from '../stores/shopify'

export function AddToCart({ variantId, quantity, available, ...props }: any) {
  const loading = useShopifyStore((state) => state.loading)
  const addVariantToCart = useShopifyStore((state) => state.addVariantToCart)

  function addToCart(e: any) {
    e.preventDefault()
    addVariantToCart(variantId, quantity)
  }

  return (
    <button
      type="submit"
      className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green py-3 px-8 text-base font-medium text-black hover:bg-orange focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
      onClick={addToCart}
      disabled={!available || loading}
      {...props}
    >
      {available ? `Add to Cart` : `Out of Stock`}
    </button>
  )
}
