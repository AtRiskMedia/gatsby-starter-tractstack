// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React from 'react'
import { Link } from 'gatsby'
import { classNames } from '@tractstack/helpers'
import { CheckIcon } from '@heroicons/react/20/solid'
import { IViewportKeyProps } from '@tractstack/types'

const pricing = {
  frequencies: [{ value: `monthly`, label: `Monthly`, priceSuffix: `/month` }],
  tiers: [
    {
      name: `Host-your-own`,
      id: `tier-self-hosted`,
      href: `#`,
      price: { monthly: `$0` },
      description: `Tract Stack is source-available and free for commercial use. (Reselling Tract Stack as a Service is not permitted on this license.)`,
      features: [
        `Avaliable under the Functional Source License FSL-1.0-MIT`,
        `Install & build recipes coming soon!`,
      ],
      mostPopular: false,
      product: null,
    },
    {
      name: `Complete`,
      id: `tier-complete`,
      href: `#`,
      price: { monthly: `$100` },
      description: `A fully managed website + analytics in-a-box. This includes your own Tract Stack and dedicated Story Keep (for your stuff).`,
      features: [
        `Fully managed professional hosting of complete website`,
        `Use your own custom domain`,
        `Immediate and out-of-the-box content + engagement analytics`,
        `Build recipes + how-to resources coming soon!`,
        `Integrates with Neo4j AuraDB (knowledge graph + advanced analytics)`,
        `Integrates with Shopify (built-in checkout cart)`,
      ],
      mostPopular: false,
      product: `tract-stack-complete`,
    },
    {
      name: `Complete with Premium Support`,
      id: `tier-premium`,
      href: `#`,
      price: { monthly: `$250` },
      description: `Everything you'll need to get the most out of your Tract Stack. Includes a premium package for initial set-up and ongoing technical support.`,
      features: [
        `Everything included in complete`,
        `Dedicated and proactive support for initial technical set-up of your Tract Stack`,
        `Unlimited ongoing email support`,
        `Priority input on product roadmap and feature development`,
      ],
      mostPopular: true,
      product: `tract-stack-complete-premium`,
    },
  ],
}

const Pricing = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const frequency = pricing.frequencies[0]

  return (
    <div
      id={`${viewportKey}-${storyFragmentId.id}`}
      className="mx-auto my-16 max-w-7xl px-6 md:my-32 xl:px-8"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-base leading-7 text-mydarkgrey">Pricing</h1>
        <p className="mt-2 text-4xl font-bold tracking-tight text-myblack md:text-5xl">
          Get Tract Stack
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-mydarkgrey">
        your all-in-one customer journey analytics and website builder
      </p>
      <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-3 md:max-w-4xl xl:mx-0 xl:max-w-none">
        {pricing.tiers.map((tier) => (
          <div
            key={tier.id}
            className={classNames(
              tier.mostPopular
                ? `ring-2 ring-mygreen/50`
                : `ring-1 ring-gray-200`,
              `rounded-3xl p-8 bg-mywhite`,
            )}
          >
            <h2
              id={tier.id}
              className={classNames(
                tier.mostPopular ? `text-black font-bold` : `text-myblack`,
                `text-xl leading-8`,
              )}
            >
              {tier.name}
            </h2>
            <p className="mt-4 text-md leading-6 text-mydarkgrey">
              {tier.description}
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-myblack">
                {tier.price.monthly}
              </span>
              <span className="text-sm leading-6 text-mydarkgrey">
                {frequency.priceSuffix}
              </span>
            </p>
            {tier.product ? (
              <Link
                to={`/products/${tier.product}`}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? `bg-mygreen text-black font-bold shadow-sm hover:bg-myblack hover:text-white`
                    : `text-myblack ring-1 ring-inset ring-myblack hover:ring-mygreen hover:bg-myblack hover:text-white`,
                  `mt-6 block rounded-md py-2 px-3 text-center text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen`,
                )}
              >
                Buy plan
              </Link>
            ) : (
              <div className="bg-white mt-6 block rounded-md py-2 px-3 text-center text-sm leading-6 text-mydarkgrey">
                FREE
              </div>
            )}
            <ul
              role="list"
              className="mt-8 space-y-3 text-md leading-6 text-mydarkgrey"
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className="h-6 w-5 flex-none text-mygreen"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Pricing
