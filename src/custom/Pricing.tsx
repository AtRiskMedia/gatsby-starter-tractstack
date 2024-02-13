// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
import React, { useState } from 'react'
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
      description: `The essentials to provide your best work for clients.`,
      features: [
        `5 products`,
        `Up to 1,000 subscribers`,
        `Basic analytics`,
        `48-hour support response time`,
      ],
      mostPopular: false,
    },
    {
      name: `Complete`,
      id: `tier-complete`,
      href: `#`,
      price: { monthly: `$100` },
      description: `A plan that scales with your rapidly growing business.`,
      features: [
        `25 products`,
        `Up to 10,000 subscribers`,
        `Advanced analytics`,
        `24-hour support response time`,
        `Marketing automations`,
      ],
      mostPopular: true,
    },
    {
      name: `Complete with Premium Support`,
      id: `tier-premium`,
      href: `#`,
      price: { monthly: `$250` },
      description: `Dedicated support and infrastructure for your company.`,
      features: [
        `Unlimited products`,
        `Unlimited subscribers`,
        `Advanced analytics`,
        `1-hour, dedicated support response time`,
        `Marketing automations`,
        `Custom reporting tools`,
      ],
      mostPopular: false,
    },
  ],
}

const Pricing = ({ viewportKey, storyFragmentId }: IViewportKeyProps) => {
  const frequency = pricing.frequencies[0]

  return (
    <div
      id={`${viewportKey}-${storyFragmentId.id}`}
      className="mx-auto my-16 max-w-7xl px-6 md:my-32 xl:px-8">
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
              tier.mostPopular ? `ring-2 ring-mygreen` : `ring-1 ring-gray-200`,
              `rounded-3xl p-8`,
            )}
          >
            <h2
              id={tier.id}
              className={classNames(
                tier.mostPopular ? `text-black font-bold` : `text-myblack`,
                `text-lg leading-8`,
              )}
            >
              {tier.name}
            </h2>
            <p className="mt-4 text-sm leading-6 text-mydarkgrey">
              {tier.description}
            </p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-myblack">
                {tier.price[frequency.value]}
              </span>
              <span className="text-sm leading-6 text-mydarkgrey">
                {frequency.priceSuffix}
              </span>
            </p>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.mostPopular
                  ? `bg-mygreen text-black font-bold shadow-sm hover:bg-myblack hover:text-white`
                  : `text-myblack ring-1 ring-inset ring-myblack hover:ring-mygreen`,
                `mt-6 block rounded-md py-2 px-3 text-center text-sm leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mygreen`,
              )}
            >
              Buy plan
            </a>
            <ul
              role="list"
              className="mt-8 space-y-3 text-sm leading-6 text-mydarkgrey"
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
