import { createAxiosClient } from "./createAxiosClient"
import { useAuthStore } from "../api/authStore"

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(tokens) {
  console.log('hitty', tokens)
  const login = useAuthStore.getState().login
  const fingerprint = useAuthStore.getState().fingerprint
  login(tokens, fingerprint)
}

async function logout() {
  const logout = useAuthStore.getState().logout
  logout()
}

function fingerprint() {
  const fingerprint = useAuthStore.getState().fingerprint
  return fingerprint
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
  logout,
  setRefreshedTokens,
  fingerprint,
})
