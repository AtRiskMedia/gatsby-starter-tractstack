// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { formatPrice } from 'gatsby-plugin-tractstack'

import Seo from '../components/Seo'
import Header from '../components/Header'
import Footer from '../components/Footer'
import LineItem from '../shopify-components/LineItem'
import Wrapper from '../components/Wrapper'
import { useShopifyStore } from '../stores/shopify'
import { useAuthStore } from '../stores/authStore'
import { config } from '../../data/SiteConfig'

const Cart = () => {
  const viewportKey = useAuthStore((state) => state.viewportKey)
  const viewportWidth =
    viewportKey === `mobile`
      ? `600`
      : viewportKey === `tablet`
      ? `1080`
      : `1920`
  const goto = `/${config.home}/${viewportWidth}`
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
          <div className="mx-auto px-2 py-4 sm:px-4 lg:px-6 lg:py-6">
            <div className="overflow-hidden rounded-lg bg-white shadow h-max">
              <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x shadow-inner shadow-lightgrey">
                <div className="lg:col-span-12">
                  <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:px-0">
                    <h2 className="text-center text-3xl tracking-tight text-gray-900 sm:text-4xl">
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
                            className="font-medium text-orange hover:text-allblack"
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
                                <dt className="text-base font-medium text-gray-900">
                                  Subtotal
                                </dt>
                                <dd className="ml-4 text-base font-medium text-gray-900">
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
                              className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-green py-3 px-8 text-base font-medium text-black hover:bg-orange focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2"
                            >
                              Checkout
                            </button>
                          </div>

                          <div className="mt-6 text-center text-sm">
                            <p>
                              or{` `}
                              <Link
                                to={goto}
                                className="font-medium text-orange hover:text-allblack"
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
