import { create } from 'zustand'

import {
  ITokens,
  IAuthStoreState,
  IReferrer,
  IAuthStoreLoginResponse,
} from '../types'

function setTokensToLocalStorage(tokens: ITokens) {
  if (typeof localStorage === `object`) {
    if (tokens.encryptedEmail !== null)
      localStorage.setItem(`email`, tokens.encryptedEmail)
    if (tokens.encryptedCode !== null)
      localStorage.setItem(`code`, tokens.encryptedCode)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === `object`) {
    localStorage.removeItem(`email`)
    localStorage.removeItem(`code`)
  }
}

const authDataSchema = {
  firstname: null,
  encryptedEmail:
    typeof localStorage === `object` && localStorage.getItem(`email`) !== null
      ? localStorage.getItem(`email`)
      : null,
  encryptedCode:
    typeof localStorage === `object` && localStorage.getItem(`code`) !== null
      ? localStorage.getItem(`code`)
      : null,
  email: ``,
  contactPersona: ``,
  shortBio: ``,
  authenticated: false,
  knownLead: false,
  badLogin: false,
}

export const useAuthStore = create<IAuthStoreState>((set, get) => ({
  accessToken: null,
  authData: {
    ...authDataSchema,
  },
  fingerprintCheck: false,
  fingerprint: null,
  validToken: false,
  beliefs: {},
  lastSync: 0,
  viewportKey: `mobile`,
  referrer: {
    init: undefined,
  },
  setReferrer: (referrer: IReferrer) => {
    set((state) => ({ ...state, referrer }))
  },
  setViewportKey: (viewportKey: string) => {
    set((state) => ({ ...state, viewportKey }))
  },
  setLastSync: (lastSync: number) => {
    set((state) => ({ ...state, lastSync }))
  },
  unsetBelief: (key: string) => {
    const beliefs = get().beliefs
    const remainingBeliefs = { ...beliefs }
    delete remainingBeliefs[key]
    set((state) => ({ ...state, beliefs: { ...remainingBeliefs } }))
  },
  updateBeliefs: (key: string, value: string) =>
    set((state) => ({
      beliefs: { ...state.beliefs, [key]: value },
    })),
  updateAuthData: (key: string, value: string) =>
    set((state) => ({
      authData: { ...state.authData, [key]: value },
    })),
  setFingerprint: (fingerprint: string) => {
    set((state) => ({ ...state, fingerprint }))
  },
  isLoggedIn: () => !!get().accessToken,
  login: (response: IAuthStoreLoginResponse) => {
    const fingerprint = get().fingerprint || ``
    const updateBeliefs = get().updateBeliefs
    if (typeof fingerprint === `string` && fingerprint.length) {
      const beliefs = response.beliefs
      if (typeof beliefs === `object`) {
        const thisBeliefs: any = beliefs
        Object.entries(thisBeliefs || {}).forEach((value: any) => {
          if (
            typeof value[1].slug === `string` &&
            typeof value[1].verb === `string` &&
            typeof value[1].object === `string`
          )
            updateBeliefs(value[1].slug, value[1].object)
          else if (
            typeof value[1].id === `string` &&
            typeof value[1].verb === `string`
          )
            updateBeliefs(value[1].id, value[1].verb)
        })
      }
      if (
        typeof response.encryptedEmail === `string` &&
        typeof response.encryptedCode === `string`
      )
        setTokensToLocalStorage({
          encryptedEmail: response.encryptedEmail,
          encryptedCode: response.encryptedCode,
        })
      set((state) => ({
        ...state,
        accessToken: response.tokens || response.jwt,
        fingerprint,
        validToken: true,
        authData: { ...state.authData, badLogin: false },
      }))
      if (response.knownLead)
        set((state) => ({
          authData: { ...state.authData, knownLead: response.knownLead },
        }))
      if (response.firstname)
        set((state) => ({
          authData: { ...state.authData, firstname: response.firstname },
        }))
      if (response.auth) {
        set((state) => ({
          authData: { ...state.authData, authenticated: response.auth },
        }))
      } else {
        set((authData) => ({
          ...authData,
          badLogin: false,
        }))
      }
      if (response.encryptedEmail && response.encryptedCode) {
        set((state) => ({
          authData: {
            ...state.authData,
            encryptedEmail: response.encryptedEmail,
            encryptedCode: response.encryptedCode,
          },
        }))
      }
    }
  },
  logout: (full: boolean = false) => {
    if (full) removeTokensFromLocalStorage()
    set((state) => ({
      ...state,
      accessToken: null,
      authData: { ...authDataSchema },
      validToken: false,
    }))
  },
}))
