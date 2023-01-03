import { createAxiosClient } from "./createAxiosClient"
import { register } from "../api/services"
import { useAuthStore } from "../stores/authStore"

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(tokens) {
  const login = useAuthStore.getState().login
  const fingerprint = useAuthStore.getState().fingerprint
  login(tokens, fingerprint)
}

function logout() {
  const logout = useAuthStore.getState().logout
  logout()
}

function getAuth() {
  const fingerprint = useAuthStore.getState().fingerprint
  const auth = useAuthStore.getState().auth
  const firstName = useAuthStore.getState().firstName
  return { fingerprint: fingerprint, firstName: firstName, auth: auth }
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
  logout,
  getAuth,
})

export const getTokens = async (fingerprint, codeword = false) => {
  try {
    const response = await register({ fingerprint, codeword })
    const accessToken = response.data.jwt
    const auth = response.data.auth
    const firstName = response.data.first_name
    return { tokens: accessToken, auth: auth, firstName: firstName, error: null }
  } catch (error) {
    return {
      error: error?.response?.data?.message || error.message,
      tokens: null,
    }
  }
}

