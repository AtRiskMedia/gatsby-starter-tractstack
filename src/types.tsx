import {
  ICodeHook,
  ICodeHookIframe,
  ICodeHookShopify,
  IPane,
} from 'gatsby-plugin-tractstack'
import {
  IComposedStoryFragment,
  IContentChildrenDict,
  IContentMapDict,
  IImpressionDict,
} from 'gatsby-plugin-tractstack/types'

export interface IStoryFragmentPayload {
  data: any
}

interface IRenderedStoryFragment {
  contentChildren: IContentChildrenDict
  contentMap: IContentMapDict
  id: string
  menu: any
  slug: string
  storyFragment: { [key: string]: IComposedStoryFragment | undefined }
  title: string
  tractStackId: string
  tractStackSlug: string
  tractStackTitle: string
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
  emailConflict: string | null
  badLogin: boolean
}

export interface IAuthStoreState {
  accessToken: string | null
  authData: IAuthStorePayload
  fingerprintCheck: boolean
  fingerprint: string | null
  validToken: boolean
  beliefs: { [key: string]: string }
  lastSync: number
  setLastSync: Function
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
  emailConflict: string | null
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
}
export interface IEventStreamDict {
  [key: string]: IEventStream
}
export interface IStoryStepStoreState {
  panesVisible: any
  panesRead: any
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
  pastStorySteps: {
    [key: string]: {
      timecode: string
    }
  }
  processRead: Function
  resetGotoLastPane: Function
  setGotoLastPane: Function
  setLastStoryStep: Function
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
  impressionsDelay: number
  slogan: string
  footer: string
  social: ISiteConfigSocialItem[]
  localStorageKey: string
  initializeShopify: boolean
  conciergeNav: ISiteConfigNavItem[]
}

export interface IContextPageProps {
  pageContext: any
}

export interface IFooterProps {
  observe?: any
}

export interface IPaneProps {
  thisId: string
  children: any
  inView?: any
  observe?: any
  hasMaxHScreen: boolean
}

export interface ICodeHookProps {
  thisId: string
  payload: ICodeHook
  viewportKey: string
}
export interface ICodeHookShopifyProps {
  thisId: string
  payload: ICodeHookShopify
}
export interface ICodeHookIframeProps {
  thisId: string
  payload: ICodeHookIframe
  viewportKey: string
}

export interface IStoryFragmentRenderProps {
  viewportKey: string
  payload: IRenderedStoryFragment
}

export interface ICodeHookDict {
  [key: string]: any
}

export interface IMenuPayloadItem {
  id: string
  field_title: string
  field_slug: string
  field_options: string | null
  field_level: number | null
}

export interface IMenuPayload {
  field_options: string | null
  field_theme: string
  id: string
  internal: { type: string }
  relationships: {
    field_image_logo: any
    field_menu_items: IMenuPayloadItem[]
    field_svg_logo: {
      id: string
      localFile: string
    }
  }
}

export interface IStoryFragmentCompositorHooks {
  belief: Function
  youtube: Function
  processRead: Function
  updateEventStream: Function
  GatsbyImage: Function
  getImage: Function
}

export interface IMenuProps {
  menuPayload: IMenuPayload
  viewportKey: string
  hooks: IStoryFragmentCompositorHooks
}

export interface IContextPanesPayload {
  field_slug: string
  id: string
  relationships: { field_pane_fragments: any[] }
  title: string
}

export interface IStoryFragmentCompositorPayload {
  field_slug: string
  field_social_image_path: string | null
  field_tailwind_background_colour: string | null
  id: string
  title: string
  relationships: {
    field_context_panes: IContextPanesPayload
    field_menu: IMenuPayload
    field_panes: IPane[]
    field_tract_stack: {
      field_slug: string
      field_social_image_path: string | null
      id: string
      relationships: {
        field_context_panes: IContextPanesPayload
        field_story_fragments: { id: string; title: string; slug: string }
      }
      title: string
    }
  }
}
export interface IStoryFragmentCompositorProps {
  data: IStoryFragmentCompositorPayload
  viewportKey: string
  hooks: IStoryFragmentCompositorHooks
}

export interface IStoryFragmentProps {
  viewportKey: string
  payload: IRenderedStoryFragment
}

export interface IViewportKeyProps {
  viewportKey: string
}

export interface INavLinkProps {
  children: any
  to: string
}

export interface IHeaderProps {
  siteTitle: string
  open: boolean
}

export interface IH5PProps {
  src: string
  title: string
  parent: string
}

export interface ID3Props {
  options: any
  slug: string
}

export interface IImpressionProps {
  payload: {
    id: string
    actionsLisp: string
    body: string
    buttonText: string
    icon: string
    parentId: string
    title: string
    weight: number
  }
}
export interface IControllerProps {
  impressions: IImpressionDict | null
  impressionPanes: string[]
  viewportKey: string
  contentMap: IContentMapDict
}

export interface IConciergeNavProps {
  active: string
  auth: boolean
}

export interface IYouTubeProps {
  videoId: string
  title: string
  cssClasses: string
}

export interface IBeliefProps {
  value: { slug: string; scale: string }
  cssClasses: string
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
  codeword?: string | undefined
  email?: string | undefined
  encryptedEmail?: string | undefined
  encryptedCode?: string | undefined
}

export interface IAxiosPushProps {
  eventStream: IEventStreamDict
  contentMap: IContentMapDict
  tractStackId: string
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
      field_slug: string
      field_social_image_path: string
      relationships: {
        field_tract_stack: {
          field_social_image_path: string
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
