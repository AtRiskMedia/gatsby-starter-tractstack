import create from "zustand"

function setTokensToLocalStorage(tokens) {
  if (typeof localStorage === "object") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("fingerprint", tokens.fingerprint)
    localStorage.setItem("validToken", true)
    if (typeof tokens.firstname === "string" && tokens.firstname !== "false")
      localStorage.setItem("firstname", tokens.firstname)
    if (typeof tokens.encryptedEmail === "string" && tokens.encryptedEmail !== "false")
      localStorage.setItem("email", tokens.encryptedEmail)
    if (typeof tokens.encryptedCode === "string" && tokens.encryptedCode !== "false")
      localStorage.setItem("code", tokens.encryptedCode)
  }
}

function removeTokensFromLocalStorage() {
  if (typeof localStorage === "object") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("fingerprint")
    localStorage.removeItem("firstname")
    localStorage.removeItem("validToken")
    localStorage.removeItem("email")
    localStorage.removeItem("code")
  }
}

const authDataSchema = {
  firstname:
    typeof localStorage === "object" &&
      localStorage.getItem("firstname") !== null
      ? localStorage.getItem("firstname")
      : "",
  encryptedEmail:
    typeof localStorage === "object" &&
      localStorage.getItem("email") !== null
      ? localStorage.getItem("email")
      : "",
  encryptedCode:
    typeof localStorage === "object" &&
      localStorage.getItem("code") !== null
      ? localStorage.getItem("code")
      : "",
  email: "",
  contactPersona: "",
  shortBio: "",
  authenticated: false,
  emailAlreadyKnown: false,
}

export const useAuthStore = create((set, get) => ({
  accessToken:
    typeof localStorage === "object" &&
      localStorage.getItem("accessToken") !== null
      ? localStorage.getItem("accessToken")
      : null,
  authData: {
    ...authDataSchema,
  },
  fingerprintCheck: false,
  fingerprint:
    typeof localStorage === "object" &&
      localStorage.getItem("fingerprint") !== null
      ? localStorage.getItem("fingerprint")
      : "none",
  validToken:
    typeof localStorage === "object" &&
      localStorage.getItem("validToken") !== null
      ? localStorage.getItem("validToken")
      : false,
  updateAuthData: (key, value) =>
    set(state => ({
      authData: { ...state.authData, [key]: value },
    })),
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
      validToken: true,
    }))
    if (tokens.firstname)
      set(state => ({
        authData: { ...state.authData, firstname: tokens.firstname },
      }))
    if (tokens.auth)
      set(state => ({
        authData: { ...state.authData, authenticated: tokens.auth },
      }))
    if (tokens.encryptedEmail && tokens.encryptedCode) {
      set(state => ({
        authData: { ...state.authData, encryptedEmail: tokens.encryptedEmail, encryptedCode: tokens.encryptedCode },
      }))
    }
  },
  logout: () => {
    removeTokensFromLocalStorage()
    set(state => ({
      ...state,
      accessToken: null,
      fingerprint: "none",
      authData: { ...authDataSchema },
      validToken: false,
    }))
  },
}))
