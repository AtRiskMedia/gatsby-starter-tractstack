import { ISiteConfig } from "../src/types"

export const config: ISiteConfig = {
  title: process.env.TITLE || ``,
  author: process.env.AUTHOR || ``,
  home: process.env.HOMEPAGE || ``,
  siteUrl: process.env.SITE_URL || ``,
  readThreshold: typeof process.env.READ_THRESHOLD !== `undefined` ? parseInt(process.env.READ_THRESHOLD) : 40000,
  softReadThreshold: typeof process.env.SOFT_READ_THRESHOLD !== `undefined` ? parseInt(process.env.SOFT_READ_THRESHOLD) : 40000,
  conciergeSync: typeof process.env.CONCIERGE_SYNC !== `undefined` ? parseInt(process.env.CONCIERGE_SYNC) : 30000,
  conciergeForceInterval: typeof process.env.CONCIERGE_FORCE_INTERVAL !== `undefined` ? parseInt(process.env.CONCIERGE_FORCE_INTERVAL) : 2,
  impressionsDelay: typeof process.env.IMPRESSIONS_DELAY !== `undefined` ? parseInt(process.env.IMPRESSIONS_DELAY) : 22000,
  action: process.env.ACTION || ``,
  slogan: process.env.SLOGAN || ``,
  footer: process.env.FOOTER || ``,
  localStorageKey: process.env.LOCAL_STORAGE_KEY || `shopify_checkout_id`,
  initializeShopify: typeof process.env.INITIALIZE_SHOPIFY !== `undefined` && process.env.INITIALIZE_SHOPIFY === `true` ? true : false,
  social: process.env.SOCIAL || ``,
}
