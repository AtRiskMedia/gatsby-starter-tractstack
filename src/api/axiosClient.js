import { createAxiosClient } from "./createAxiosClient"
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

function resetFingerprint() {
  const setFingerprint = useAuthStore(state => state.setFingerprint)
  console.log('setting fingerprint 0')
  setFingerprint(0)
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
  resetFingerprint,
})
