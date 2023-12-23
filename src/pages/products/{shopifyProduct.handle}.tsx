// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { Fragment, useState, useCallback, useEffect } from 'react'
import { graphql } from 'gatsby'
import { GatsbyImage } from 'gatsby-plugin-image'
import { formatPrice, classNames } from '@tractstack/helpers'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

import { useShopifyStore } from '../../stores/shopify'
import Wrapper from '../../components/Wrapper'
import { AddToCart } from '../../shopify-components/AddToCart'
import { BuyNow } from '../../shopify-components/BuyNow'
import Seo from '../../components/Seo'
import { IProductCollectionsRouteProps } from '../../types'
import { useProductData } from '../../hooks/use-product-data'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export const query = graphql`
  query ($id: String) {
    shopifyProduct(id: { eq: $id }) {
      title
      id
      handle
    }
  }
`

const ShopifyProduct = ({ data }: IProductCollectionsRouteProps) => {
  const product = useProductData().filter(
    (e: any) => e?.node?.id === data.shopifyProduct.id,
  )[0].node
  const {
    options,
    variants,
    variants: [initialVariant],
    priceRangeV2,
    title,
    description,
    featuredImage,
  } = product
  const client = useShopifyStore((state) => state.client)
  const [variant, setVariant] = useState({ ...initialVariant })
  const productVariant =
    client?.product?.helpers?.variantForOptions(product, variant) || variant
  const [selected, setSelected] = useState(options[0].values[0])
  const [available, setAvailable] = useState(productVariant.availableForSale)
  const checkAvailablity = useCallback(
    (productId: string) => {
      client?.product?.fetch(productId).then((fetchedProduct: any) => {
        const result =
          fetchedProduct?.variants.filter(
            (variant: any) => variant.id === productVariant.storefrontId,
          ) ?? []
        if (result.length > 0) {
          setAvailable(result[0].available)
        }
      })
    },
    [productVariant.storefrontId, client.product],
  )
  const price = formatPrice(
    priceRangeV2.minVariantPrice.currencyCode,
    variant.price,
  )
  const hasVariants = variants?.length > 1
  const hasFeaturedImage = featuredImage?.gatsbyImageData
  const handleOptionChange = (option: string, value: string) => {
    const selectedVariant = variants?.find((variant: any) => {
      return (
        variant.selectedOptions[0].name === option &&
        variant.selectedOptions[0].value === value
      )
    })
    setSelected(value)
    setVariant({ ...selectedVariant })
  }

  useEffect(() => {
    checkAvailablity(product.storefrontId)
  }, [productVariant.storefrontId, checkAvailablity, product.storefrontId])

  return (
    <Wrapper slug={product.handle} mode="product">
      <Header siteTitle={title} open={false} />
      <div className="w-full h-full">
        <div className="bg-white">
          <div className="pt-6 pb-16 md:pb-24">
            <div className="mx-auto mt-8 max-w-2xl px-4 md:max-w-7xl md:px-8">
              <div className="md:grid md:auto-rows-min md:grid-cols-12 md:gap-x-8">
                <div className="md:col-span-5 md:col-start-8">
                  <div className="flex justify-between">
                    <h1 className="text-xl text-gray-900">{title}</h1>
                    <p className="text-xl text-gray-900">{price}</p>
                  </div>
                </div>

                <div className="mt-8 md:col-span-7">
                  <h2 className="sr-only">Images</h2>
                  <div className="grid grid-cols-1">
                    {hasFeaturedImage ? (
                      <GatsbyImage
                        objectFit="contain"
                        loading="eager"
                        alt={
                          featuredImage.altText
                            ? featuredImage.altText
                            : `Product Image of ${title}`
                        }
                        image={featuredImage.gatsbyImageData}
                      />
                    ) : null}
                  </div>
                </div>

                <div className="mt-8 md:col-span-5">
                  {hasVariants &&
                    options.map(({ name, values }: any) => (
                      <Listbox
                        value={selected}
                        onChange={(event) => handleOptionChange(name, event)}
                        key={name}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm leading-6 text-gray-900">
                              {name}
                            </Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 md:text-sm md:leading-6">
                                <span className="block truncate">
                                  {selected}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none md:text-sm">
                                  {values.map((value: any) => (
                                    <Listbox.Option
                                      key={value}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? `bg-indigo-600 text-white`
                                            : `text-gray-900`,
                                          `relative cursor-default select-none py-2 pl-3 pr-9`,
                                        )
                                      }
                                      value={value}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected ? `underline` : ``,
                                              `block truncate`,
                                            )}
                                          >
                                            {value}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? `text-white`
                                                  : `text-indigo-600`,
                                                `absolute inset-y-0 right-0 flex items-center pr-4`,
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    ))}
                  <div>
                    <AddToCart
                      variantId={productVariant.storefrontId}
                      quantity="1"
                      available={available}
                    />
                  </div>
                  <div>
                    <BuyNow
                      variantId={productVariant.storefrontId}
                      quantity="1"
                      available={available}
                    />
                  </div>
                  <div className="mt-10">
                    <h2 className="text-sm text-gray-900">Description</h2>

                    <div
                      className="prose prose-sm mt-4 text-gray-500"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Wrapper>
  )
}

export const Head = ({ data }: IProductCollectionsRouteProps) => (
  <Seo title={data.shopifyProduct.title} />
)

export default ShopifyProduct
