// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useMemo, useState } from 'react'
import { GatsbyImage } from 'gatsby-plugin-image'
import { formatPrice } from '@tractstack/helpers'
import { getShopifyImage } from 'gatsby-source-shopify'

import { useShopifyStore } from '../stores/shopify'

export function LineItem({ product }: any) {
  const [quantity] = useState(product.quantity)
  const checkout = useShopifyStore((state) => state.checkout)
  const removeLineItem = useShopifyStore((state) => state.removeLineItem)
  const variantImage = {
    ...product.variant.image,
    originalSrc: product.variant.image.src,
  }
  const price = formatPrice(
    product.variant.priceV2.currencyCode,
    Number(product.variant.priceV2.amount),
  )
  const image = useMemo(
    () =>
      getShopifyImage({
        image: variantImage,
        layout: `constrained`,
        crop: `contain`,
        width: 160,
        height: 160,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [variantImage.src],
  )
  const handleRemove = () => {
    removeLineItem(checkout.id, product.id)
  }

  return (
    <li key={product.id} className="flex py-6">
      <div className="flex-shrink-0">
        {image && (
          <GatsbyImage
            key={product.variant.image.src}
            image={image}
            alt={product.variant.image.altText ?? product.variant.title}
          />
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col sm:ml-6">
        <div>
          <div className="flex justify-between">
            <h4 className="text-sm">{product.title}</h4>
            <p className="ml-4 text-sm text-mydarkgrey">
              {quantity === 1 ? `${price}` : `${quantity}x ${price}`}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-1 items-end justify-between">
          <div className="ml-4">
            <button
              type="button"
              onClick={handleRemove}
              className="text-sm text-myorange hover:text-black"
            >
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LineItem
