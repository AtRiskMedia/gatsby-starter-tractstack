import create from "zustand"

function setTokensToLocalStorage(tokens) {
  if (typeof localStorage === "object") {
    localStorage.setItem("accessToken", tokens.accessToken)
    localStorage.setItem("fingerprint", tokens.fingerprint)
    localStorage.setItem("validToken", true)
    if (typeof tokens.firstname === "string" && tokens.firstname !== "false")
      localStorage.setItem("firstname", tokens.firstname)
    if (
      typeof tokens.encryptedEmail === "string" &&
      tokens.encryptedEmail !== "false"
    )
      localStorage.setItem("email", tokens.encryptedEmail)
    if (
      typeof tokens.encryptedCode === "string" &&
      tokens.encryptedCode !== "false"
    )
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
    typeof localStorage === "object" && localStorage.getItem("email") !== null
      ? localStorage.getItem("email")
      : "",
  encryptedCode:
    typeof localStorage === "object" && localStorage.getItem("code") !== null
      ? localStorage.getItem("code")
      : "",
  email: "",
  contactPersona: "",
  shortBio: "",
  authenticated: false,
  knownLead: false,
  emailConflict: "",
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
  beliefs: {},
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
  updateBeliefs: (key, value) =>
    set(state => ({
      beliefs: { ...state.beliefs, [key]: value },
    })),
  setFingerprint: fingerprint => {
    set(state => ({ ...state, fingerprint: fingerprint }))
  },
  setFingerprintCheck: fingerprintCheck => {
    set(state => ({ ...state, fingerprintCheck: fingerprintCheck }))
  },
  isLoggedIn: () => !!get().accessToken,
  login: response => {
    const fingerprint = get().fingerprint
    const accessToken =
      typeof response.tokens === "string"
        ? response.tokens
        : typeof response.jwt === "string"
        ? response.jwt
        : false
    const auth = typeof response.auth === "boolean" ? response.auth : false
    const knownLead =
      typeof response.knownLead === "boolean" ? response.knownLead : false
    const emailConflict =
      typeof response.emailConflict === "string" ? response.emailConflict : ""
    const firstname =
      typeof response.firstname === "string" ? response.firstname : false
    const encryptedEmail =
      typeof response.encryptedEmail === "string"
        ? response.encryptedEmail
        : false
    const encryptedCode =
      typeof response.encryptedCode === "string"
        ? response.encryptedCode
        : false
    if (accessToken) {
      setTokensToLocalStorage({
        accessToken: accessToken,
        fingerprint: fingerprint,
        firstname: firstname,
        encryptedEmail: encryptedEmail,
        encryptedCode: encryptedCode,
      })
      set(state => ({
        ...state,
        accessToken: accessToken,
        fingerprint: fingerprint,
        validToken: true,
      }))
      if (emailConflict)
        set(state => ({
          authData: { ...state.authData, emailConflict: emailConflict },
        }))
      if (knownLead)
        set(state => ({
          authData: { ...state.authData, knownLead: knownLead },
        }))
      if (firstname)
        set(state => ({
          authData: { ...state.authData, firstname: firstname },
        }))
      if (auth) {
        set(state => ({
          authData: { ...state.authData, authenticated: auth },
        }))
        console.log("authenticated")
      } else {
        console.log("not authenticated")
      }
      if (encryptedEmail && encryptedCode) {
        set(state => ({
          authData: {
            ...state.authData,
            encryptedEmail: encryptedEmail,
            encryptedCode: encryptedCode,
          },
        }))
      }
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
