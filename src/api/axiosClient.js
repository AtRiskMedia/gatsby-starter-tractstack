import { createAxiosClient } from "./createAxiosClient"
import { useAuthStore } from "./authStore"

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function getCurrentRefreshToken() {
  return useAuthStore.getState().refreshToken
}

function setRefreshedTokens(tokens) {
  const login = useAuthStore.getState().login
  login(tokens)
}

async function logout() {
  const logout = useAuthStore.getState().logout
  logout()
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
  getCurrentRefreshToken,
  refreshTokenUrl: process.env.CONCIERGE_REFRESH_TOKEN_URL,
  logout,
  setRefreshedTokens,
})
