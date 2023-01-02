import create from "zustand"

function setTokensToLocalStorage(tokens) {
  if (typeof localStorage === "object") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("fingerprint", tokens.fingerprint)
    localStorage.setItem("validToken", true)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === "object") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("fingerprint")
    localStorage.removeItem("validToken")
  }
}

export const useAuthStore = create((set, get) => ({
  accessToken:
    typeof localStorage === "object" &&
      localStorage.getItem("accessToken") !== null
      ? localStorage.getItem("accessToken")
      : null,
  firstName:
    typeof localStorage === "object" &&
      localStorage.getItem("firstName") !== null
      ? localStorage.getItem("firstName")
      : "false",
  auth: false,
  fingerprint:
    typeof localStorage === "object" &&
      localStorage.getItem("fingerprint") !== null
      ? localStorage.getItem("fingerprint")
      : "none",
  fingerprintCheck: false,
  validToken:
    typeof localStorage === "object" &&
      localStorage.getItem("validToken") !== null
      ? localStorage.getItem("validToken")
      : false,
  setValidToken: validToken => {
    set(state => ({ ...state, validToken: validToken }))
  },
  setFirstName: firstName => {
    set(state => ({ ...state, firstName: firstName }))
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
    }))
    if (tokens.auth)
      set(state => ({
        ...state,
        auth: tokens.auth,
      }))
  },
  logout: () => {
    removeTokensFromLocalStorage()
    set(state => ({
      ...state,
      accessToken: null,
      fingerprint: "none",
      auth: null,
    }))
  },
}))
