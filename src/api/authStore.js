import create from "zustand"

function setTokensToLocalStorage(tokens) {
  localStorage.setItem("accessToken", tokens.accessToken)
  localStorage.setItem("fingerprint", tokens.fingerprint)
}

function removeTokensFromLocalStorage() {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("fingerprint")
}

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  fingerprint: localStorage.getItem("fingerprint") || false,
  fingerprintCheck: false,
  setFingerprint: fingerprint => {
    set(state => ({ ...state, fingerprint: fingerprint }))
  },
  setFingerprintCheck: fingerprintCheck => {
    set(state => ({ ...state, fingerprintCheck: fingerprintCheck }))
  },
  isLoggedIn: () => !!get().accessToken,
  login: tokens => {
    setTokensToLocalStorage(tokens)
    set(state => ({
      ...state,
      accessToken: tokens.accessToken,
      fingerprint: tokens.fingerprint,
    }))
  },
  logout: () => {
    removeTokensFromLocalStorage()
    set(state => ({
      ...state,
      accessToken: null,
      fingerprint: null,
    }))
  },
}))
