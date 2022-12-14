import { createAxiosClient } from "./createAxiosClient"
import { register, loadProfile } from "../api/services"
import { useAuthStore } from "../stores/authStore"

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(response) {
  const login = useAuthStore.getState().login
  login(response)
}

function logout() {
  const logout = useAuthStore.getState().logout
  logout()
}

function getAuthData() {
  const fingerprint = useAuthStore.getState().fingerprint
  const authData = useAuthStore.getState().authData
  return {
    fingerprint: fingerprint,
    encryptedCode: authData.encryptedCode,
    encryptedEmail: authData.encryptedEmail,
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: process.env.CONCIERGE_BASE_URL,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  },
  getCurrentAccessToken,
  refreshTokenUrl: process.env.CONCIERGE_REFRESH_TOKEN_URL,
  setRefreshedTokens,
  getAuthData,
  logout,
})

export const getTokens = async (
  fingerprint,
  codeword = false,
  email = false
) => {
  if (fingerprint === "none" || fingerprint === "masked") return null
  const encryptedEmail = useAuthStore.getState().authData.encryptedEmail
  const encryptedCode = useAuthStore.getState().authData.encryptedCode
  const params =
    codeword && email
      ? { codeword: codeword, email: email }
      : encryptedCode && encryptedEmail
      ? { encryptedCode: encryptedCode, encryptedEmail: encryptedEmail }
      : {}
  try {
    const response = await register({ fingerprint, ...params })
    const accessToken = response.data.jwt
    const auth = response.data.auth
    const knownLead = response.data.known_lead
    const emailConflict = response.data.email_conflict
    const firstname = response.data.first_name
    const encryptedEmail = response.data.encryptedEmail
    const encryptedCode = response.data.encryptedCode
    return {
      tokens: accessToken,
      auth: auth,
      firstname: firstname,
      knownLead: knownLead,
      emailConflict: emailConflict,
      encryptedEmail: encryptedEmail,
      encryptedCode: encryptedCode,
      error: null,
    }
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
      tokens: null,
    }
  }
}

export const getProfile = async () => {
  try {
    const response = await loadProfile()
    const firstname = response.data.firstname
    const email = response.data.email
    const contactPersona = response.data.contactPersona
    const shortBio = response.data.shortBio
    return {
      firstname: firstname,
      email: email,
      contactPersona: contactPersona,
      shortBio: shortBio,
    }
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
      tokens: null,
    }
  }
}
