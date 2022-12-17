import create from "zustand"

function setTokensToLocalStorage(tokens) {
  if (typeof localStorage === "object") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("fingerprint", tokens.fingerprint)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === "object") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("fingerprint")
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken:
    typeof localStorage === "object"
      ? localStorage.getItem("accessToken")
      : null,
  fingerprint:
    typeof localStorage === "object"
      ? localStorage.getItem("fingerprint") || false
      : false,
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
      fingerprint: false,
    }))
  },
}))
