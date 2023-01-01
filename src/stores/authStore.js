import create from "zustand"

function setTokensToLocalStorage(tokens) {
  if (typeof localStorage === "object") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("fingerprint", tokens.fingerprint)
    localStorage.setItem("auth", tokens.auth)
    localStorage.setItem("validToken", true)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === "object") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("fingerprint")
    localStorage.removeItem("validToken")
    localStorage.removeItem("auth")
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken:
    typeof localStorage === "object" &&
      localStorage.getItem("accessToken") !== null
      ? localStorage.getItem("accessToken")
      : null,
  auth:
    typeof localStorage === "object" &&
      localStorage.getItem("auth") !== null
      ? localStorage.getItem("auth")
      : "false",
  fingerprint:
    typeof localStorage === "object" &&
      localStorage.getItem("fingerprint") !== null
      ? localStorage.getItem("fingerprint")
      : "none",
  fingerprintCheck: false,
  setAuth: auth => {
    set(state => ({ ...state, auth: auth }))
  },
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
      auth: tokens.auth,
    }))
  },
  logout: () => {
    removeTokensFromLocalStorage()
    set(state => ({
      ...state,
      accessToken: null,
      fingerprint: "none",
      auth: "false",
    }))
  },
}))
