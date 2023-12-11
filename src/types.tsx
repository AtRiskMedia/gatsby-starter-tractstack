import {
  IContentMapDict,
  IStoryFragmentId,
} from 'gatsby-plugin-tractstack/types'

export interface IStoryFragmentPayload {
  data: any // FIX
}

export interface IStoryFragmentRaw {
  payload: {
    resources: any // FIX
    storyFragment: any // FIX
    id: any
  }
}
export interface ITokens {
  encryptedCode: string | null
  encryptedEmail: string | null
}

export interface IAuthStorePayload {
  firstname: string | null
  encryptedEmail: string | null
  encryptedCode: string | null
  email: string
  contactPersona: string
  shortBio: string
  authenticated: boolean
  knownLead: boolean
  badLogin: boolean
}

export interface IReferrer {
  init: boolean | undefined
  httpReferrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

export interface IAuthStoreState {
  accessToken: string | null
  authData: IAuthStorePayload
  fingerprintCheck: boolean
  fingerprint: string | null
  validToken: boolean
  viewportKey: string
  beliefs: { [key: string]: string }
  lastSync: number
  referrer: IReferrer
  setReferrer: Function
  setViewportKey: Function
  setLastSync: Function
  unsetBelief: Function
  updateBeliefs: Function
  updateAuthData: Function
  setFingerprint: Function
  isLoggedIn: Function
  login: Function
  logout: Function
}

export interface IAuthStoreLoginResponse {
  tokens: string
  jwt: string | null
  auth: boolean
  knownLead: boolean
  firstname: string | null
  encryptedEmail: string | null
  encryptedCode: string | null
  beliefs: object | null
}

export interface IShopifyStoreState {
  cart: any // FIX
  isOpen: boolean
  loading: boolean
  initialize: Function
  onOpen: Function
  onClose: Function
  addVariantToCart: Function
  removeLineItem: Function
  updateLineItem: Function
  client: any // FIX
  checkout: any // FIX
  setCheckout: Function
  setClient: Function
  setCheckoutItem: Function
  setLoading: Function
}

export interface IEventStream {
  duration: number
  id: string
  type: string
  verb: string
  targetId?: string
  score?: string
  title?: string
  targetSlug?: string
  isContextPane?: string
}
export interface IEventStreamDict {
  [key: string]: IEventStream
}
export interface IStoryStepStoreState {
  entered: boolean
  setEntered: Function
  controllerOverride: boolean
  setControllerOverride: Function
  panesRevealed: boolean
  withheldPanes: any
  setPanesRevealed: Function
  toggleWithheldPanes: Function
  panesVisible: any
  panesRead: any
  scrollToPane: string
  zoom: boolean
  zoomOverride: boolean
  setZoom: Function
  setZoomOverride: Function
  setScrollToPane: Function
  eventStream: IEventStreamDict
  gotoLastPane: [string | null, string | null]
  lastStoryStep: string | null
  currentStoryStep: string | null
  currentStoryStepCount: string | null
  storySteps: {
    [key: string]: {
      type: string
      id: string
    }
  }
  contentMap: IContentMapDict
  pastStorySteps: {
    [key: string]: {
      timecode: string
    }
  }
  processRead: Function
  pushEvent: Function
  resetGotoLastPane: Function
  setGotoLastPane: Function
  setLastStoryStep: Function
  updateContentMap: Function
  updatePanesRead: Function
  updatePanesVisible: Function
  updateEventStream: Function
  updateEventStreamCleanup: Function
}

interface ISiteConfigSocialItem {
  name: string
  href: string
}
interface ISiteConfigNavItem {
  id: string
  href: string
  title: string
}
export interface ISiteConfig {
  home: string
  readThreshold: number
  softReadThreshold: number
  conciergeSync: number
  conciergeForceInterval: number
  impressionsDelay: number
  action: string
  slogan: string
  footer: string
  social: ISiteConfigSocialItem[]
  localStorageKey: string
  initializeShopify: boolean
  conciergeNav: ISiteConfigNavItem[]
}

export interface IConciergeNavProps {
  active: string
}

export interface IConciergeNavLinksProps {
  active: string
  hasAuth: boolean
}

export interface IYouTubeProps {
  videoId: string
  title: string
  cssClasses: string
}

export interface IToggleBeliefProps {
  belief: string
  value: string
  prompt: string
  cssClasses: string
  storyFragmentId: IStoryFragmentId
}

export interface IBeliefProps {
  value: { slug: string; scale: string; extra?: string }
  cssClasses: string
  cssClassesExtra?: string
  storyFragmentId: IStoryFragmentId
}

export interface IAxiosClientProps {
  options: any
  getCurrentAccessToken: Function
  refreshTokenUrl: string | undefined
  setRefreshedTokens: Function
  getAuthData: Function
  logout: Function
}

export interface IAxiosRegisterProps {
  fingerprint: string
  referrer: IReferrer
  codeword?: string | undefined
  email?: string | undefined
  encryptedEmail?: string | undefined
  encryptedCode?: string | undefined
}

export interface IAxiosPushProps {
  eventStream: IEventStreamDict
  contentMap: IContentMapDict
  tractStackId?: string
}

export interface IAxiosProfileProps {
  profile: {
    bio: string
    codeword: string
    email: string
    firstname: string
    init: boolean
    persona: string
  }
}

export interface ICollectionsRouteProps {
  data: {
    nodeStoryFragment: {
      title: string
      slug: string
      socialImagePath: string
      relationships: {
        tractstack: {
          socialImagePath: string
        }
      }
    }
  }
}

export interface IProductCollectionsRouteProps {
  data: {
    shopifyProduct: {
      title: string
      id: string
      handle: string
    }
  }
}
