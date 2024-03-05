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
      className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent
      py-3 px-8 text-base
                    bg-mygreen/50 text-black font-bold shadow-sm hover:bg-mydarkgrey hover:text-white
                 text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
      onClick={addToCart}
      disabled={!available || loading}
      {...props}
    >
      {available ? `Add to Cart` : `Out of Stock`}
    </button>
  )
}
