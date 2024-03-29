// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { formatPrice } from '@tractstack/helpers'

import Seo from '../components/Seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LineItem from '../shopify-components/LineItem'
import Wrapper from '../components/Wrapper'
import { useShopifyStore } from '../stores/shopify'

const Cart = () => {
  const goto = `/`
  const checkout = useShopifyStore((state) => state.checkout)
  const loading = useShopifyStore((state) => state.loading)
  const emptyCart = !(checkout?.lineItems?.length > 0)
  const handleCheckout = () => {
    window.open(checkout.webUrl)
  }

  return (
    <Wrapper slug="cart" mode="cart">
      <Header siteTitle="Powered by Tract Stack" open={false} />
      <div className="w-full h-full">
        <main className="relative bg-blue-gradient">
          <div className="mx-auto px-2 py-4 md:px-6 md:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 md:grid md:grid-cols-12 md:divide-y-0 md:divide-x shadow-inner shadow-mylightgrey">
                <div className="md:col-span-12">
                  <div className="mx-auto max-w-2xl py-16 px-4 md:px-0">
                    <h2 className="text-center text-3xl tracking-tight text-mydarkgrey md:text-4xl">
                      Shopping Cart
                    </h2>

                    {emptyCart ? (
                      <>
                        <p className="text-center pt-12">
                          No items in your cart.
                        </p>
                        <p className="text-center pt-12">
                          <Link
                            to={goto}
                            className="text-myblue hover:text-black"
                          >
                            Continue Browsing
                            <span aria-hidden="true"> &rarr;</span>
                          </Link>
                        </p>
                      </>
                    ) : (
                      <form className="mt-12">
                        <section aria-labelledby="cart-heading">
                          <h2 id="cart-heading" className="sr-only">
                            Items in your shopping cart
                          </h2>

                          <ul
                            role="list"
                            className="divide-y divide-gray-200 border-t border-b border-gray-200"
                          >
                            {checkout?.lineItems.map((product: any) => (
                              <LineItem key={product.id} product={product} />
                            ))}
                          </ul>
                        </section>

                        {/* Order summary */}
                        <section
                          aria-labelledby="summary-heading"
                          className="mt-10"
                        >
                          <h2 id="summary-heading" className="sr-only">
                            Order summary
                          </h2>

                          <div>
                            <dl className="space-y-4">
                              <div className="flex items-center justify-between">
                                <dt className="text-base text-mydarkgrey">
                                  Subtotal
                                </dt>
                                <dd className="ml-4 text-base text-mydarkgrey">
                                  {formatPrice(
                                    checkout.subtotalPriceV2.currencyCode,
                                    checkout.subtotalPriceV2.amount,
                                  )}
                                </dd>
                              </div>
                            </dl>
                          </div>

                          <div className="mt-10">
                            <button
                              type="submit"
                              onClick={handleCheckout}
                              disabled={loading}
                              className="mt-8 flex w-full items-center justify-center rounded-md border border-block transparent
                                py-3 px-8 text-base
                    bg-mygreen text-black font-bold shadow-sm hover:bg-myblack hover:text-white
                 text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen"
                            >
                              Checkout
                            </button>
                          </div>

                          <div className="mt-6 text-center text-sm">
                            <p>
                              or{` `}
                              <Link
                                to={goto}
                                className="text-myblue hover:text-black"
                              >
                                Continue Browsing
                                <span aria-hidden="true"> &rarr;</span>
                              </Link>
                            </p>
                          </div>
                        </section>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </Wrapper>
  )
}

export const Head = () => <Seo />

export default Cart
