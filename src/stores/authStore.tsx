import { create } from 'zustand'

import { ITokens, IAuthStoreState, IAuthStoreLoginResponse } from '../types'

function setTokensToLocalStorage(tokens: ITokens) {
  if (typeof localStorage === `object`) {
    localStorage.setItem(
      `accessToken`,
      typeof tokens.accessToken === `string` ? tokens.accessToken : ``,
    )
    if (typeof tokens.fingerprint === `string` && tokens.fingerprint.length > 0)
      localStorage.setItem(`party`, tokens.fingerprint)
    if (typeof tokens.accessToken === `string`)
      localStorage.setItem(`validToken`, `true`)
    else localStorage.setItem(`validToken`, `false`)
    if (tokens.firstname !== null)
      localStorage.setItem(`firstname`, tokens.firstname)
    if (tokens.encryptedEmail !== null)
      localStorage.setItem(`email`, tokens.encryptedEmail)
    if (tokens.encryptedCode !== null)
      localStorage.setItem(`code`, tokens.encryptedCode)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === `object`) {
    localStorage.removeItem(`accessToken`)
    localStorage.removeItem(`party`)
    localStorage.removeItem(`firstname`)
    localStorage.removeItem(`validToken`)
    localStorage.removeItem(`email`)
    localStorage.removeItem(`code`)
  }
}

const authDataSchema = {
  firstname:
    typeof localStorage === `object` &&
    localStorage.getItem(`firstname`) !== null
      ? localStorage.getItem(`firstname`)
      : null,
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
  emailConflict: ``,
  badLogin: false,
}

export const useAuthStore = create<IAuthStoreState>((set, get) => ({
  accessToken:
    typeof localStorage === `object` &&
    localStorage.getItem(`accessToken`) !== null
      ? localStorage.getItem(`accessToken`)
      : null,
  authData: {
    ...authDataSchema,
  },
  fingerprintCheck: false,
  fingerprint:
    typeof localStorage === `object` && localStorage.getItem(`party`) !== null
      ? localStorage.getItem(`party`)
      : null,
  validToken: !!(
    typeof localStorage === `object` &&
    localStorage.getItem(`validToken`) === `true`
  ),
  beliefs: {},
  lastSync: 0,
  setLastSync: (lastSync: number) => {
    set((state) => ({ ...state, lastSync }))
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
    if (typeof fingerprint === `string` && fingerprint.length) {
      setTokensToLocalStorage({
        accessToken: response.tokens || response.jwt,
        fingerprint,
        firstname: response.firstname,
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
      if (response.emailConflict)
        set((state) => ({
          authData: {
            ...state.authData,
            emailConflict: response.emailConflict,
          },
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
  logout: () => {
    removeTokensFromLocalStorage()
    set((state) => ({
      ...state,
      accessToken: null,
      authData: { ...authDataSchema },
      validToken: false,
    }))
  },
}))
