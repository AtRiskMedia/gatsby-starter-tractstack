// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import * as React from 'react'
import { Link } from 'gatsby'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

export function CartButton(quantity: any) {
  return (
    <Link
      aria-label={`Shopping Cart`}
      title={`Shopping Cart`}
      to="/cart"
      className="pr-6 relative"
    >
      <ShoppingCartIcon className="relative z-70030 h-8 w-8 mx-2 text-darkgrey hover:text-blue" />
      {` `}
      {quantity > 0 && <div>{quantity}</div>}
      <span className="absolute z-70020 top-0 right-3 h-5 w-5 text-xs rounded-full bg-darkgrey bg-opacity-25 text-darkgrey flex justify-center items-center items">
        {quantity.quantity}
      </span>
    </Link>
  )
}
